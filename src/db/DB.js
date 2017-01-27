'use strict';

const OCL = require('openchemlib');
const Molecule = OCL.Molecule;
const parseSDF = require('sdf-parser');
const Papa = require('papaparse');

const moleculeCreator = require('./moleculeCreator');

const defaultDBOptions = {
    length: 0,
    computeProperties: false
};

const defaultSDFOptions = {
    onStep: function (current, total) {}
};

const defaultCSVOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    onStep: function (current, total) {}
};

const defaultSearchOptions = {
    format: 'oclid',
    mode: 'substructure',
    limit: 0
};

class MoleculeDB {
    constructor(options) {
        options = Object.assign({}, defaultDBOptions, options);
        this.data = new Array(options.length);
        this.molecules = new Array(options.length);
        this.statistics = null;
        this.length = 0;
        this.computeProperties = !!options.computeProperties;
        this.searcher = null;
    }

    static parseSDF(sdf, options) {
        if (typeof sdf !== 'string') {
            throw new TypeError('sdf must be a string');
        }
        options = Object.assign({}, defaultSDFOptions, options);
        return new Promise(function (resolve, reject) {
            var parsed = parseSDF(sdf);
            var molecules = parsed.molecules;
            var db = new MoleculeDB(options);
            db.statistics = parsed.statistics;
            var i = 0, l = molecules.length;
            parseNext();
            function parseNext() {
                if (i === l) {
                    return resolve(db);
                }
                try {
                    db.push(Molecule.fromMolfile(molecules[i].molfile), molecules[i]);
                } catch (e) {
                    return reject(e);
                }
                options.onStep(++i, l);
                setImmediate(parseNext);
            }
        });
    }

    static parseCSV(csv, options) {
        if (typeof csv !== 'string') {
            throw new TypeError('csv must be a string');
        }
        options = Object.assign({}, defaultCSVOptions, options);
        return new Promise(function (resolve, reject) {
            var parsed = Papa.parse(csv, options);
            var fields = parsed.meta.fields;
            var stats = new Array(fields.length);
            var firstElement = parsed.data[0];
            var datatype, datafield;
            for (let i = 0; i < fields.length; i++) {
                stats[i] = {
                    label: fields[i],
                    isNumeric: typeof firstElement[fields[i]] === 'number'
                };
                var lowerField = fields[i].toLowerCase();
                if (moleculeCreator.has(lowerField)) {
                    datatype = moleculeCreator.get(lowerField);
                    datafield = fields[i];
                }
            }
            if (!datatype) {
                throw new Error('this document does not contain any molecule field');
            }
            var db = new MoleculeDB(options);
            db.statistics = stats;

            var i = 0, l = parsed.data.length;
            parseNext();
            function parseNext() {
                if (i === l) {
                    return resolve(db);
                }
                try {
                    db.push(datatype(parsed.data[i][datafield]), parsed.data[i]);
                } catch (e) {
                    return reject(e);
                }
                options.onStep(++i, l);
                setImmediate(parseNext);
            }
        });
    }

    push(molecule, data) {
        if (data === undefined) data = {};
        this.molecules[this.length] = molecule;
        var molecularFormula;
        if (!molecule.index) {
            molecule.index = molecule.getIndex();
        }
        if (!molecule.idcode) {
            molecule.idcode = molecule.getIDCode();
        }
        if (!molecule.mw) {
            molecularFormula = molecule.getMolecularFormula();
            molecule.mw = molecularFormula.relativeWeight;
        }
        this.data[this.length++] = data;
        if (this.computeProperties) {
            if (!molecularFormula) {
                molecularFormula = molecule.getMolecularFormula();
            }
            var properties = molecule.getProperties();
            data.properties = {
                absoluteWeight: molecularFormula.absoluteWeight,
                relativeWeight: molecule.mw,
                formula: molecularFormula.formula,
                acceptorCount: properties.acceptorCount,
                donorCount: properties.donorCount,
                logP: properties.logP,
                logS: properties.logS,
                polarSurfaceArea: properties.polarSurfaceArea,
                rotatableBondCount: properties.rotatableBondCount,
                stereoCenterCount: properties.stereoCenterCount
            };
        }
    }

    search(query, options) {
        options = Object.assign({}, defaultSearchOptions, options);

        if (typeof query === 'string') {
            query = moleculeCreator.get(options.format.toLowerCase())(query);
        } else if (!(query instanceof Molecule)) {
            throw new TypeError('toSearch must be a Molecule or string');
        }

        var result;
        switch (options.mode.toLowerCase()) {
            case 'exact':
                result = this.exactSearch(query, options.limit);
                break;
            case 'substructure':
                result = this.subStructureSearch(query, options.limit);
                break;
            case 'similarity':
                result = this.similaritySearch(query, options.limit);
                break;
            default:
                throw new Error('unknown search mode: ' + options.mode);
        }
        return result;
    }

    exactSearch(query, limit) {
        var queryIdcode = query.getIDCode();
        var result = new MoleculeDB();
        limit = limit || Number.MAX_SAFE_INTEGER;
        for (let i = 0; i < this.length; i++) {
            if (this.molecules[i].idcode === queryIdcode) {
                result.push(this.molecules[i], this.data[i]);
                if (result.length >= limit) break;
            }
        }
        return result;
    }

    subStructureSearch(query, limit) {
        var needReset = false;
        if (!query.isFragment()) {
            needReset = true;
            query.setFragment(true);
        }

        var queryIndex = query.getIndex();
        var queryMW = query.getMolecularFormula().relativeWeight;
        var searcher = this.getSearcher();

        searcher.setFragment(query, queryIndex);
        var searchResult = [];
        for (let i = 0; i < this.length; i++) {
            searcher.setMolecule(this.molecules[i], this.molecules[i].index);
            if (searcher.isFragmentInMolecule()) {
                searchResult.push([this.molecules[i], i]);
            }
        }
        searchResult.sort(function (a, b) {
            return Math.abs(queryMW - a[0].mw) - Math.abs(queryMW - b[0].mw);
        });

        var length = Math.min(limit || searchResult.length, searchResult.length);
        var result = new MoleculeDB({length: length});
        for (let i = 0; i < length; i++) {
            result.push(this.molecules[searchResult[i][1]], this.data[searchResult[i][1]]);
        }

        if (needReset) {
            query.setFragment(false);
        }
        return result;
    }

    similaritySearch(query, limit) {
        var queryIndex = query.getIndex();
        var queryMW = query.getMolecularFormula().relativeWeight;
        var queryIDCode = query.getIDCode();

        var searchResult = new Array(this.length);
        var similarity;
        for (let i = 0; i < this.length; i++) {
            if (this.molecules[i].idcode === queryIDCode) {
                similarity = 1e10;
            } else {
                similarity = OCL.SSSearcherWithIndex.getSimilarityTanimoto(queryIndex, this.molecules[i].index)
                    * 100000 - Math.abs(queryMW - this.molecules[i].mw) / 1000;
            }
            searchResult[i] = [similarity, i];
        }
        searchResult.sort(function (a, b) {
            return b[0] - a[0];
        });

        var length = Math.min(limit || searchResult.length, searchResult.length);
        var result = new MoleculeDB({length: length});
        for (let i = 0; i < length; i++) {
            result.push(this.molecules[searchResult[i][1]], this.data[searchResult[i][1]]);
        }
        return result;
    }

    getSearcher() {
        return this.searcher || (this.searcher = new OCL.SSSearcherWithIndex());
    }
}

module.exports = MoleculeDB;

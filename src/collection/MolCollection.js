'use strict';

var OCL = require('openchemlib');
var Molecule = OCL.Molecule;
var parseSDF = require('sdf-parser');
var Papa = require('papaparse');
var extend = require('extend');

var moleculeCreator = require('./moleculeCreator');

var defaultCollectionOptions = {
    length: 0,
    computeProperties: false
};

function MolCollection(options) {
    options = extend({}, defaultCollectionOptions, options);
    this.data = new Array(options.length);
    this.molecules = new Array(options.length);
    this.statistics = null;
    this.length = 0;
    this.computeProperties = !!options.computeProperties;
    this.searcher = null;
}

var defaultSDFOptions = {
    onStep: function (current, total) {}
};

MolCollection.parseSDF = function (sdf, options) {
    if (typeof sdf !== 'string') {
        throw new TypeError('sdf must be a string');
    }
    options = extend({}, defaultSDFOptions, options);
    return new Promise(function (resolve, reject) {
        var parsed = parseSDF(sdf);
        var molecules = parsed.molecules;
        var collection = new MolCollection(options);
        collection.statistics = parsed.statistics;
        var i = 0, l = molecules.length;
        parseNext();
        function parseNext() {
            if (i === l) {
                return resolve(collection);
            }
            try {
                collection.push(Molecule.fromMolfile(molecules[i].molfile.value), molecules[i]);
            } catch (e) {
                return reject(e);
            }
            options.onStep(++i, l);
            setImmediate(parseNext);
        }
    });
};

var defaultCSVOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    onStep: function (current, total) {}
};

MolCollection.parseCSV = function (csv, options) {
    if (typeof csv !== 'string') {
        throw new TypeError('csv must be a string');
    }
    options = extend({}, defaultCSVOptions, options);
    return new Promise(function (resolve, reject) {
        var parsed = Papa.parse(csv, options);
        var fields = parsed.meta.fields;
        var stats = new Array(fields.length);
        var firstElement = parsed.data[0];
        var datatype, datafield;
        for (var i = 0; i < fields.length; i++) {
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
        var collection = new MolCollection(options);
        collection.statistics = stats;

        var i = 0, l = parsed.data.length;
        parseNext();
        function parseNext() {
            if (i === l) {
                return resolve(collection);
            }
            try {
                collection.push(datatype(parsed.data[i][datafield]), parsed.data[i]);
            } catch (e) {
                return reject(e);
            }
            options.onStep(++i, l);
            setImmediate(parseNext);
        }
    });
};

MolCollection.prototype.push = function (molecule, data) {
    if (data === undefined) data = {};
    this.molecules[this.length] = molecule;
    if (!molecule.index) {
        molecule.index = molecule.getIndex();
        molecule.idcode = molecule.getIDCode();
    }
    this.data[this.length++] = data;
    if (this.computeProperties) {
        var molecularFormula = molecule.getMolecularFormula();
        var properties = molecule.getProperties();
        data.properties = {
            absoluteWeight: molecularFormula.getAbsoluteWeight(),
            relativeWeight: molecularFormula.getRelativeWeight(),
            formula: molecularFormula.getFormula(),
            acceptorCount: properties.getAcceptorCount(),
            donorCount: properties.getDonorCount(),
            logP: properties.getLogP(),
            logS: properties.getLogS(),
            polarSurfaceArea: properties.getPolarSurfaceArea(),
            rotatableBondCount: properties.getRotatableBondCount(),
            stereoCenterCount: properties.getStereoCenterCount()
        };
    }
};

var defaultSearchOptions = {
    format: 'oclid',
    mode: 'substructure',
    limit: 0
};

MolCollection.prototype.search = function (query, options) {
    options = extend({}, defaultSearchOptions, options);

    if (typeof query === 'string') {
        query = moleculeCreator.get(options.format.toLowerCase())(query);
    } else if (!(query instanceof Molecule)) {
        throw new TypeError('toSearch must be a Molecule or string');
    }

    var result;
    switch (options.mode.toLowerCase()) {
        case 'substructure':
            result = this.subStructureSearch(query);
            break;
        case 'similarity':
            result = this.similaritySearch(query);
        default:
            throw new Error('unknown search mode: ' + options.mode);
    }
    return result;
};

MolCollection.prototype.subStructureSearch = function (query) {
    var needReset = false;
    if (!query.isFragment()) {
        needReset = true;
        query.setFragment(true);
    }

    var queryIndex = query.getIndex();
    var searcher = this.getSearcher();

    searcher.setFragment(query, queryIndex);
    var result = new MolCollection();
    for (var i = 0; i < this.length; i++) {
        searcher.setMolecule(this.molecules[i], this.molecules[i].index);
        if (searcher.isFragmentInMolecule()) {
            result.push(this.molecules[i], this.data[i]);
        }
    }

    if (needReset) {
        query.setFragment(false);
    }
    return result;
};

MolCollection.prototype.similaritySearch = function (query) {
    throw new Error('similarity search is not implemented yet');
};

MolCollection.prototype.getSearcher = function () {
    return this.searcher || (this.searcher = new OCL.SSSearcherWithIndex());
};

module.exports = MolCollection;

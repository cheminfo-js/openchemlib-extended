'use strict';

const parseSDF = require('sdf-parser');
const Papa = require('papaparse');

const getMoleculeCreators = require('./moleculeCreators');

module.exports = function (OCL) {
  const cHelperRings = OCL.Molecule.cHelperRings;
  const Molecule = OCL.Molecule;

  const moleculeCreators = getMoleculeCreators(Molecule);

  const defaultDBOptions = {
    length: 0,
    computeProperties: false
  };

  const defaultSDFOptions = {
    onStep: function (/* current, total*/) {
      // empty function
    }
  };

  const defaultCSVOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    onStep: function (/* current, total*/) {
      // empty function
    }
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
        const parsed = parseSDF(sdf);
        const molecules = parsed.molecules;
        const db = new MoleculeDB(options);
        db.statistics = parsed.statistics;
        let i = 0;
        const l = molecules.length;
        parseNext();
        function parseNext() {
          if (i === l) {
            resolve(db);
            return;
          }
          try {
            db.push(Molecule.fromMolfile(molecules[i].molfile), molecules[i]);
          } catch (e) {
            reject(e);
            return;
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
        const parsed = Papa.parse(csv, options);
        const fields = parsed.meta.fields;
        const stats = new Array(fields.length);
        const firstElement = parsed.data[0];
        let datatype, datafield;
        for (let i = 0; i < fields.length; i++) {
          stats[i] = {
            label: fields[i],
            isNumeric: typeof firstElement[fields[i]] === 'number'
          };
          const lowerField = fields[i].toLowerCase();
          if (moleculeCreators.has(lowerField)) {
            datatype = moleculeCreators.get(lowerField);
            datafield = fields[i];
          }
        }
        if (!datatype) {
          throw new Error('this document does not contain any molecule field');
        }
        const db = new MoleculeDB(options);
        db.statistics = stats;

        let i = 0;
        const l = parsed.data.length;
        parseNext();
        function parseNext() {
          if (i === l) {
            resolve(db);
            return;
          }
          try {
            db.push(datatype(parsed.data[i][datafield]), parsed.data[i]);
          } catch (e) {
            reject(e);
            return;
          }
          options.onStep(++i, l);
          setImmediate(parseNext);
        }
      });
    }

    push(molecule, data) {
      if (data === undefined) data = {};
      this.molecules[this.length] = molecule;
      // ensure helper arrays needed for substructure search
      molecule.ensureHelperArrays(cHelperRings);
      let molecularFormula;
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
        const properties = new OCL.MoleculeProperties(molecule);
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
        query = moleculeCreators.get(options.format.toLowerCase())(query);
      } else if (!(query instanceof Molecule)) {
        throw new TypeError('toSearch must be a Molecule or string');
      }

      let result;
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
          throw new Error(`unknown search mode: ${options.mode}`);
      }
      return result;
    }

    exactSearch(query, limit) {
      const queryIdcode = query.getIDCode();
      const result = new MoleculeDB();
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
      let needReset = false;

      if (!query.isFragment()) {
        needReset = true;
        query.setFragment(true);
      }

      const queryMW = getMW(query);

      const queryIndex = query.getIndex();
      const searcher = this.getSearcher();

      searcher.setFragment(query, queryIndex);
      const searchResult = [];
      for (let i = 0; i < this.length; i++) {
        searcher.setMolecule(this.molecules[i], this.molecules[i].index);
        if (searcher.isFragmentInMolecule()) {
          searchResult.push([this.molecules[i], i]);
        }
      }
      searchResult.sort(function (a, b) {
        return Math.abs(queryMW - a[0].mw) - Math.abs(queryMW - b[0].mw);
      });

      const length = Math.min(limit || searchResult.length, searchResult.length);
      const result = new MoleculeDB({ length: length });
      for (let i = 0; i < length; i++) {
        result.push(this.molecules[searchResult[i][1]], this.data[searchResult[i][1]]);
      }

      if (needReset) {
        query.setFragment(false);
      }
      return result;
    }

    similaritySearch(query, limit) {
      const queryIndex = query.getIndex();

      const queryMW = getMW(query);
      const queryIDCode = query.getIDCode();

      const searchResult = new Array(this.length);
      let similarity;
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

      const length = Math.min(limit || searchResult.length, searchResult.length);
      const result = new MoleculeDB({ length: length });
      for (let i = 0; i < length; i++) {
        result.push(this.molecules[searchResult[i][1]], this.data[searchResult[i][1]]);
      }
      return result;
    }

    getSearcher() {
      return this.searcher || (this.searcher = new OCL.SSSearcherWithIndex());
    }
  }

  return MoleculeDB;
};

function getMW(query) {
  let copy = query.getCompactCopy();
  copy.setFragment(false);
  return copy.getMolecularFormula().relativeWeight;
}

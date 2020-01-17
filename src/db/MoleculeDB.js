'use strict';

module.exports = function(OCL) {
  /*
    this.db is an object with properties 'oclID' that has as value
    an object that contains the following properties:
    * molecule: an OCL molecule instance
    * index: OCL index used for substructure searching
    * properties: all the calculates properties
    * data: array containing free data associated with this molecule
  */

  class MoleculeDB {
    constructor(options = {}) {
      const { computeProperties = false } = options;
      this.db = {};
      this.statistics = null;
      this.computeProperties = computeProperties;
      this.searcher = new OCL.SSSearcherWithIndex();
    }

    pushEntry(molecule, data, moleculeInfo) {
      const pushEntry = require('./pushEntry');
      return pushEntry.call(
        { moleculeDB: this, OCL },
        molecule,
        data,
        moleculeInfo,
      );
    }

    pushMoleculeInfo(moleculeInfo, data) {
      const pushMoleculeInfo = require('./pushMoleculeInfo');
      return pushMoleculeInfo.call(
        { moleculeDB: this, OCL },
        moleculeInfo,
        data,
      );
    }

    search(query, options) {
      const search = require('./search');
      return search.call(
        { moleculeDB: this, OCL, searcher: this.searcher },
        query,
        options,
      );
    }

    getDB() {
      return Object.keys(this.db).map((key) => this.db[key]);
    }
  }

  MoleculeDB.parseCSV = function(csv, options) {
    const parseCSV = require('./parseCSV');
    return parseCSV.call({ OCL, MoleculeDB }, csv, options);
  };

  MoleculeDB.parseSDF = function(sdf, options) {
    const parseSDF = require('./parseSDF');
    return parseSDF.call({ OCL, MoleculeDB }, sdf, options);
  };

  return MoleculeDB;
};

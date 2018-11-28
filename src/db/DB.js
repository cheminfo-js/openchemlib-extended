'use strict';

const getMoleculeCreators = require('./moleculeCreators');

module.exports = function(OCL) {
  const Molecule = OCL.Molecule;

  const defaultDBOptions = {length: 0, computeProperties: false};

  const defaultSearchOptions = {
    format: 'oclid',
    mode: 'substructure',
    limit: 0
  };

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
      options = Object.assign({}, defaultDBOptions, options);
      this.db = {};
      this.statistics = null;
      this.computeProperties = !!options.computeProperties;
      this.searcher = null;
    }
  }

  MoleculeDB.parseCSV = function(csv, options) {
    const parseCSV = require('./parseCSV');
    return parseCSV.call(this, csv, options);
  };

  return MoleculeDB;
};

function getMW(query) {
  let copy = query.getCompactCopy();
  copy.setFragment(false);
  return copy.getMolecularFormula().relativeWeight;
}

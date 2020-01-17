'use strict';

const sdfParser = require('sdf-parser');

const defaultSDFOptions = {
  onStep: function(/* current, total*/) {
    // empty function
  },
};

/**
 * Create a new DB from a CSV file
 * @memberof DB
 * @param {text} sdf - text file containing the sdf
 * @param {object} [options={}]
 * @param {boolean} [computeProperties=false]
 * @param {function} [options.onStep=()=>{}] call back to execute after each molecule
 * @returns {DB}
 */

function parseSDF(sdf, options = {}) {
  if (typeof sdf !== 'string') {
    throw new TypeError('sdf must be a string');
  }
  let Molecule = this.OCL.Molecule;
  options = Object.assign({}, defaultSDFOptions, options);
  let db = new this.MoleculeDB(options);
  return new Promise(function(resolve, reject) {
    const parsed = sdfParser(sdf);
    const molecules = parsed.molecules;
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
        db.pushEntry(Molecule.fromMolfile(molecules[i].molfile), molecules[i]);
      } catch (e) {
        reject(e);
        return;
      }
      options.onStep(++i, l);
      setTimeout(parseNext, 0);
    }
  });
}

module.exports = parseSDF;

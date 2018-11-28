'use strict';

const parseSDF = require('sdf-parser');

const defaultSDFOptions = {
  onStep: function(/* current, total*/) {
    // empty function
  }
};

function parseSDF(sdf, options = {}) {
  if (typeof sdf !== 'string') {
    throw new TypeError('sdf must be a string');
  }
  options = Object.assign({}, defaultSDFOptions, options);
  return new Promise(function(resolve, reject) {
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

module.exports = parseSDF;

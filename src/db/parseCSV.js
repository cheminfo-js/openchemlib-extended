'use strict';

const Papa = require('papaparse');

const defaultCSVOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  onStep: function(/* current, total*/) {
    // empty function
  },
};

/**
 * Create a new DB from a CSV file
 * @memberof DB
 * @param {text} csv - text file containing the comma separated value file
 * @param {object} [options={}]
 * @param {boolean} [options.header=true]
 * @param {boolean} [options.dynamicTyping=true]
 * @param {boolean} [options.skipEmptyLines=true]
 * @param {boolean} [computeProperties=false]
 * @param {function} [options.onStep=()=>{}] call back to execute after each molecule
 * @returns {DB}
 */

function parseCSV(csv, options = {}) {
  const getMoleculeCreators = require('./moleculeCreators');
  const moleculeCreators = getMoleculeCreators(this.OCL.Molecule);

  if (typeof csv !== 'string') {
    throw new TypeError('csv must be a string');
  }
  options = Object.assign({}, defaultCSVOptions, options);

  let db = new this.MoleculeDB(options);
  return new Promise(function(resolve, reject) {
    const parsed = Papa.parse(csv, options);
    const fields = parsed.meta.fields;
    const stats = new Array(fields.length);
    const firstElement = parsed.data[0];
    let moleculeCreator, moleculeField;
    for (let i = 0; i < fields.length; i++) {
      stats[i] = {
        label: fields[i],
        isNumeric: typeof firstElement[fields[i]] === 'number',
      };
      const lowerField = fields[i].toLowerCase();
      if (moleculeCreators.has(lowerField)) {
        moleculeCreator = moleculeCreators.get(lowerField);
        moleculeField = fields[i];
      }
    }
    if (!moleculeCreator) {
      throw new Error('this document does not contain any molecule field');
    }
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
        db.pushEntry(
          moleculeCreator(parsed.data[i][moleculeField]),
          parsed.data[i],
        );
      } catch (e) {
        reject(e);
        return;
      }
      options.onStep(++i, l);
      setTimeout(parseNext, 0);
    }
  });
}

module.exports = parseCSV;

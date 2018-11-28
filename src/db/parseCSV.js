'use strict';

const moleculeCreators = getMoleculeCreators(Molecule);

const Papa = require('papaparse');

const defaultCSVOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  onStep: function (/* current, total*/) {
    // empty function
  }
};

function parseCSV(csv, options = {}) {
  if (typeof csv !== 'string') {
    throw new TypeError('csv must be a string');
  }
  options = Object.assign({}, defaultCSVOptions, options);
  return new Promise(function (resolve, reject) {
    const parsed = Papa.parse(csv, options);
    const fields = parsed.meta.fields;
    const stats = new Array(fields.length);
    const firstElement = parsed.data[0];
    let moleculeCreator, moleculeField;
    for (let i = 0; i < fields.length; i++) {
      stats[i] = {
        label: fields[i],
        isNumeric: typeof firstElement[fields[i]] === 'number'
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
    let db = new this.MoleculeDB(options);
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
          moleculeCreator(parsed.data[i][moleculeField]), parsed.data[i]);
      } catch (e) {
        reject(e);
        return;
      }
      options.onStep(++i, l);
      setImmediate(parseNext);
    }
  });
}

module.exports = parseCSV;

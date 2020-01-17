'use strict';

module.exports = function getNumberOfAtoms(options = {}) {
  let label = options.atomLabel;
  let mf = this.getMolecularFormula().formula;
  let parts = mf.split(/(?=[A-Z])/);
  for (let part of parts) {
    let atom = part.replace(/[0-9]/g, '');
    if (atom === label) {
      return part.replace(/[^0-9]/g, '') * 1 || 1;
    }
  }

  return 0;
};

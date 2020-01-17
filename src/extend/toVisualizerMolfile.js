'use strict';

module.exports = function toVisualizerMolfile(options = {}) {
  let diastereotopic = options.diastereotopic;

  let highlight = [];
  let atoms = {};
  if (diastereotopic) {
    let heavyAtomHydrogen = options.heavyAtomHydrogen;
    let hydrogenInfo = {};
    this.getExtendedDiastereotopicAtomIDs().forEach(function(line) {
      hydrogenInfo[line.oclID] = line;
    });

    let diaIDs = this.getGroupedDiastereotopicAtomIDs();
    diaIDs.forEach(function(diaID) {
      atoms[diaID.oclID] = diaID.atoms;
      highlight.push(diaID.oclID);
      if (heavyAtomHydrogen) {
        if (
          hydrogenInfo[diaID.oclID] &&
          hydrogenInfo[diaID.oclID].nbHydrogens > 0
        ) {
          hydrogenInfo[diaID.oclID].hydrogenOCLIDs.forEach(function(id) {
            highlight.push(id);
            atoms[id] = diaID.atoms;
          });
        }
      }
    });
  } else {
    let size = this.getAllAtoms();
    highlight = new Array(size).fill(0).map((a, index) => index);
    atoms = highlight.map((a) => [a]);
  }

  let molfile = {
    type: 'mol2d',
    value: this.toMolfile(),
    _highlight: highlight,
    _atoms: atoms,
  };

  return molfile;
};

'use strict';

module.exports = function toDiastereotopicSVG(options = {}) {
  let {
    width = 300,
    height = 200,
    prefix = 'ocl',
    heavyAtomHydrogen = false,
  } = options;
  let svg = options.svg;
  let diaIDs = [];

  let hydrogenInfo = {};
  this.getExtendedDiastereotopicAtomIDs().forEach(function(line) {
    hydrogenInfo[line.oclID] = line;
  });

  if (heavyAtomHydrogen) {
    for (let i = 0; i < this.getAtoms(); i++) {
      diaIDs.push([]);
    }
    let groupedDiaIDs = this.getGroupedDiastereotopicAtomIDs();
    groupedDiaIDs.forEach(function(diaID) {
      if (
        hydrogenInfo[diaID.oclID] &&
        hydrogenInfo[diaID.oclID].nbHydrogens > 0
      ) {
        diaID.atoms.forEach((atom) => {
          hydrogenInfo[diaID.oclID].hydrogenOCLIDs.forEach((id) => {
            if (!diaIDs[atom * 1].includes(id)) diaIDs[atom].push(id);
          });
        });
      }
    });
  } else {
    diaIDs = this.getDiastereotopicAtomIDs().map((a) => [a]);
  }

  if (!svg) svg = this.toSVG(width, height, prefix);

  svg = svg.replace(/Atom:[0-9]+"/g, function(value) {
    let atom = value.replace(/[^0-9]/g, '');
    return `${value} data-atomid="${diaIDs[atom].join(',')}"`;
  });

  return svg;
};

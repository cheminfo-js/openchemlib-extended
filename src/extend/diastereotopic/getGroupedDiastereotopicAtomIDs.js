'use strict';

/**
 * This function groups the diasterotopic atomIds of the molecule based of equivalence of atoms. This
 * equivalente can be at the level of chemical equivalente(Default) or at the level of magentic equivalence of protons
 */
module.exports = function getGroupedDiastereotopicAtomIDs(options = {}) {
  var label = options.atomLabel;
  var diaIDs = this.getDiastereotopicAtomIDs(options);
  var diaIDsObject = {};
  for (let i = 0; i < diaIDs.length; i++) {
    if (!label || this.getAtomLabel(i) === label) {
      var diaID = diaIDs[i];
      if (!diaIDsObject[diaID]) {
        diaIDsObject[diaID] = {
          counter: 1,
          atoms: [i],
          oclID: diaID,
          atomLabel: this.getAtomLabel(i),
          _highlight: [diaID]
        };
      } else {
        diaIDsObject[diaID].counter++;
        diaIDsObject[diaID].atoms.push(i);
      }
    }
  }
  // Find the Magnetically equivalent groups
  let pathOptions = { maxLength: 9999 };
  if (label) {
    pathOptions.fromLabel = label;
    pathOptions.toLabel = label;
  }
  let paths = this.getAllPaths(pathOptions);
  for (let key of Object.keys(diaIDsObject)) {
    let hashTable = {};
    for (let i = 0; i < paths.length; i++) {
      let pair = paths[i];
      if (pair.fromDiaID === key && pair.toDiaID !== key) {
        let groupB = pair.fromAtoms;
        groupB.forEach((value, index) => {
          if (!hashTable[value]) {
            hashTable[value] = {};
          }
          hashTable[value][pair.toAtoms[index]] = pair.pathLength;
        });
      }
    }
    // console.log(hashTable);
    let keys = Object.keys(hashTable);
    let groups = {};
    for (let atomID of keys) {
      let uniqueColumn = JSON.stringify(hashTable[atomID]);
      if (groups[uniqueColumn]) {
        groups[uniqueColumn].push(atomID);
      } else {
        groups[uniqueColumn] = [atomID];
      }
    }
    // console.log(groups);
    keys = Object.keys(groups);
    if (keys.length === 0) {
      diaIDsObject[key].magneticGroups = [diaIDsObject[key].atoms.slice()];
    } else {
      diaIDsObject[key].magneticGroups = Object.values(groups);
    }
  }
  // End of Magnetically equivalent groups

  var diaIDsTable = [];
  for (var key of Object.keys(diaIDsObject)) {
    diaIDsTable.push(diaIDsObject[key]);
  }
  return diaIDsTable;
};

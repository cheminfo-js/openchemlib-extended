'use strict';

/**
 * This function groups the diasterotopic atomIds of the molecule based on equivalence of atoms. The output object contains
 * a set of chemically equivalent atoms(element.atoms) and the groups of magnetically equivalent atoms (element.magneticGroups)
 * {object}[options={}]
 * {string}[options.atomLabel] Return only the atoms of the given atomLabel. By default it returns all the explicit atoms in the molecule
 */
module.exports = function getGroupedDiastereotopicAtomIDs(options = {}) {
  let label = options.atomLabel;
  let diaIDs = this.getDiastereotopicAtomIDs(options);
  let diaIDsObject = {};
  for (let i = 0; i < diaIDs.length; i++) {
    if (!label || this.getAtomLabel(i) === label) {
      let diaID = diaIDs[i];
      if (!diaIDsObject[diaID]) {
        diaIDsObject[diaID] = {
          counter: 1,
          atoms: [i],
          oclID: diaID,
          atomLabel: this.getAtomLabel(i),
          _highlight: [diaID],
        };
      } else {
        diaIDsObject[diaID].counter++;
        diaIDsObject[diaID].atoms.push(i);
      }
    }
  }
  // Find the Magnetically equivalent groups
  let pathOptions = { maxLength: Number.MAX_SAFE_INTEGER };
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
        let groupB = pair.fromTo;
        groupB.forEach((value) => {
          if (!hashTable[value[0]]) {
            hashTable[value[0]] = {};
          }
          hashTable[value[0]][value[1]] = pair.pathLength;
        });
      }
    }
    // console.log(hashTable);
    let keys = Object.keys(hashTable);
    let groups = {};
    for (let atomID of keys) {
      let uniqueColumn = Object.keys(hashTable[atomID])
        .sort()
        .reduce((key, id) => `${key}${id}:${hashTable[atomID][id]},`, '');
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

  let diaIDsTable = [];
  for (let key of Object.keys(diaIDsObject)) {
    diaIDsTable.push(diaIDsObject[key]);
  }
  return diaIDsTable;
};

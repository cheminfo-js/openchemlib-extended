'use strict';

module.exports = function(OCL) {
  const Util = OCL.Util;
  return function getGroupedHOSECodes(options = {}) {
    const diaIDs = this.getGroupedDiastereotopicAtomIDs(options);
    diaIDs.forEach(function(diaID) {
      const hoses = Util.getHoseCodesFromDiastereotopicID(diaID.oclID, options);

      diaID.hoses = [];
      let level = 1;
      for (const hose of hoses) {
        diaID.hoses.push({
          level: level++,
          oclID: hose,
        });
      }
    });

    return diaIDs;
  };
};

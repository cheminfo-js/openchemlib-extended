'use strict';

module.exports = function getGroupedDiastereotopicIDs(options) {
    var diaIDs=molecule.getDiastereotopicAtomIDs(options);
    var diaIDsObject={};

    for (var i=0; i<diaIDs.length; i++) {
        var diaID=diaIDs[i];
        if (! diaIDsObject[diaID]) {
            diaIDsObject[diaID]={
                counter:1,
                atom: [i],
                oclID: oclID
            }
        } else {
            diaIDsObject[diaID].counter++;
            diaIDsObject[diaID].atom.push(i);
        }
    }

    var diaIDsTable=[];
    for (var key in Object.keys(diaIDsObject)) {
        diaIDsTable.push(diaIDsObject[key]);
    }
    return diaIDsTable;
}

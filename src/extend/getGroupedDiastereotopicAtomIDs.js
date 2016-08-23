'use strict';

module.exports = function getGroupedDiastereotopicAtomIDs(elementLabel) {
    var diaIDs=this.getDiastereotopicAtomIDs(elementLabel);
    var diaIDsObject={};

    for (var i=0; i<diaIDs.length; i++) {
        var diaID=diaIDs[i];
        if (! diaIDsObject[diaID]) {
            diaIDsObject[diaID]={
                counter:1,
                atom: [i],
                oclID: diaID,
                _highlight: [diaID]
            }
        } else {
            diaIDsObject[diaID].counter++;
            diaIDsObject[diaID].atom.push(i);
        }
    }

    var diaIDsTable=[];
    for (var key of Object.keys(diaIDsObject)) {
        diaIDsTable.push(diaIDsObject[key]);
    }
    return diaIDsTable;
}

'use strict';

var Util = require('openchemlib').Util;

module.exports = function getGroupedHOSECodes(options) {
    var diaIDs=this.getGroupedDiastereotopicAtomIDs();
    diaIDs.forEach(function(diaID) {
        var hoses=Util.getHoseCodesFromDiastereotopicID(diaID.oclID, options);

        diaID.hoses=[];
        var level=1;
        for (var hose of hoses) {
            diaID.hoses.push(
                {
                    level: level++,
                    oclID: hose
                })
        }
    });

    return diaIDs;
};

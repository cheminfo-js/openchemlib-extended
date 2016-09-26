'use strict';

module.exports = function toVisualizerMolfile(options) {
    var options = options || {};
    var heavyAtomHydrogen = options.heavyAtomHydrogen;
    
    var hydrogenInfo={};
    this.getExtendedDiastereotopicAtomIDs().forEach(function(line) {
        hydrogenInfo[line.oclID]=line;
    });
    
    var diaIDs=this.getGroupedDiastereotopicAtomIDs();
    
    var highlight=[];
    var atoms={};
    diaIDs.forEach(function(diaID) {
        atoms[diaID.oclID]=diaID.atoms;
        highlight.push(diaID.oclID);
        if (heavyAtomHydrogen) {
            if (hydrogenInfo[diaID.oclID] && hydrogenInfo[diaID.oclID].nbHydrogens>0) {
                hydrogenInfo[diaID.oclID].hydrogenOCLIDs.forEach(function(id) {
                    highlight.push(id);
                    atoms[id]=diaID.atoms;
                })
                
            }
        }
    });
    
    var molfile={
        type:'mol2d',
        value:this.toMolfile(),
        _highlight:highlight,
        _atoms:atoms
    }

    return molfile;
}

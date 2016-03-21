'use strict';

module.exports = function toVisualizerMolfile() {
    var diaIDs=this.getGroupedDiastereotopicAtomIDs();

    var highlight=[];
    var atoms={};
    diaIDs.forEach(function(diaID) {
        atoms[diaID.oclID]=diaID.atom;
        highlight.push(diaID.oclID);
    })

    var molfile={
        type:'mol2d',
        value:this.toMolfile(),
        _highlight:highlight,
        _atoms:atoms
    }

    return molfile;
}

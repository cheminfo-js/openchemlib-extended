'use strict';

module.exports = function getConnectivityMatrix(options) {
    
    // TODO remove this line when the bug is fixed ... (in OCL addImplicitHydrogens)
    this.toMolfile();

    var nbAtoms=this.getAllAtoms();
    var result=new Array(nbAtoms);
    for (var i=0; i<nbAtoms; i++) {
        result[i]=new Array(nbAtoms).fill(0);
        result[i][i]=1;
    }

    for (var i=0; i<nbAtoms; i++) {
        for (var j=0; j<this.getAllConnAtoms(i); j++) {
            result[i][this.getConnAtom(i,j)]=1;
        }
    }
    
    return result;
}

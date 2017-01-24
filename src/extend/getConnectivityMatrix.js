'use strict';

var OCL = require('openchemlib');

module.exports = function getConnectivityMatrix(options) {
    var options = options || {};
    var sdt=options.sdt;
    var mass=options.mass;
    var atomicNo=options.atomicNo;

    this.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);
    var nbAtoms=this.getAllAtoms();
    var result=new Array(nbAtoms);
    for (var i=0; i<nbAtoms; i++) {
        result[i]=new Array(nbAtoms).fill(0);
        if (atomicNo) {
            result[i][i]=this.getAtomicNo(i);
        } else {
            result[i][i]=(mass) ? OCL.Molecule.cRoundedMass[this.getAtomicNo(i)] : 1;
        }
        
    }

    for (var i=0; i<nbAtoms; i++) {
        for (var j=0; j<this.getAllConnAtoms(i); j++) {
            result[i][this.getConnAtom(i,j)]=(sdt) ? this.getConnBondOrder(i,j) : 1;
        }
    }
    return result;
}

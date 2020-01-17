'use strict';

let floydWarshall = require('ml-floyd-warshall');
let Matrix = require('ml-matrix').Matrix;

module.exports = function(OCL) {
  return function getConnectivityMatrix(options = {}) {
    this.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);
    let nbAtoms = this.getAllAtoms();
    let i, j, l;
    let result = new Array(nbAtoms).fill();
    result = result.map(() => new Array(nbAtoms).fill(0));

    if (!options.pathLength) {
      if (options.atomicNo) {
        for (i = 0; i < nbAtoms; i++) {
          result[i][i] = this.getAtomicNo(i);
        }
      } else if (options.mass) {
        for (i = 0; i < nbAtoms; i++) {
          result[i][i] = OCL.Molecule.cRoundedMass[this.getAtomicNo(i)];
        }
      } else {
        for (i = 0; i < nbAtoms; i++) {
          result[i][i] = 1;
        }
      }
    }

    if (options.sdt) {
      for (i = 0; i < nbAtoms; i++) {
        l = this.getAllConnAtoms(i);
        for (j = 0; j < l; j++) {
          result[i][this.getConnAtom(i, j)] = this.getConnBondOrder(i, j);
        }
      }
    } else {
      for (i = 0; i < nbAtoms; i++) {
        l = this.getAllConnAtoms(i);
        for (j = 0; j < l; j++) {
          result[i][this.getConnAtom(i, j)] = 1;
        }
      }
    }

    if (options.pathLength) {
      result = floydWarshall(new Matrix(result)).to2DArray();
    }

    return result;
  };
};

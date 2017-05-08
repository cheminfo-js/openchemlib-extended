'use strict';
var floydWarshall = require('ml-floyd-warshall');
var Matrix = require('ml-matrix');

module.exports = function (OCL) {
    return function getConnectivityMatrix(options = {}) {
        this.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);
        var nbAtoms = this.getAllAtoms();
        var i = nbAtoms;
        var result = new Array(nbAtoms).fill();
        result = result.map(i => {return new Array(nbAtoms).fill(0)});

        if (!options.pathLength) {
            if (options.atomicNo) {
                while (i--) {
                    result[i][i] = this.getAtomicNo(i);
                }
            } else if (options.mass) {
                while (i--) {
                    result[i][i] = OCL.Molecule.cRoundedMass[this.getAtomicNo(i)];
                }
            } else {
                while (i--) {
                    result[i][i] = 1;
                }
            }
        }

        var j;
        i = nbAtoms;
        if (options.sdt) {
            while (i--) {
                j = this.getAllConnAtoms(i);
                while (j--) {
                    result[i][this.getConnAtom(i, j)] = this.getConnBondOrder(i, j);
                }
            }
        } else {
            while (i--) {
                j = this.getAllConnAtoms(i);
                while (j--) {
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

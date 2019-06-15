'use strict';

const OCLE = require('../../..');

/**
 * Returns an array of all the different atom diaIDs that are connected
 * {OCLE} molecule
 * {object} [options={}]
 * {string} [options.fromLabel='H']
 * {string} [options.toLabel='H']
 * {number} [options.minLength=1]
 * {number} [options.maxLength=4]
 */

function getAllCouplings(molecule, options = {}) {
  const {
    fromLabel = 'H',
    toLabel = 'H',
    minLength = 1,
    maxLength = 4
  } = options;
  let paths = molecule.getAllPaths({
    fromLabel,
    toLabel,
    minLength,
    maxLength
  });

  let fragment = new OCLE.Molecule(0, 0);
  for (let path of paths) {
    path.info = [];
    for (let fromTo of path.fromTo) {
      let atoms = [];
      molecule.getPath(atoms, fromTo[0], fromTo[1], path.pathLength);
      let torsion;
      if (atoms.length === 4) {
        torsion = molecule.calculateTorsion(atoms);
      }
      path.info.push({
        atoms,
        torsion
      });

      if (!path.code) {
        let atomMask = new Array(molecule.getAllAtoms()).fill(false);
        for (let atom of atoms) {
          atomMask[atom] = true;
        }
        molecule.copyMoleculeByAtoms(fragment, atomMask, true, null);
        path.code = fragment.getCanonizedIDCode();
      }
    }
  }
  return paths;
}

module.exports = getAllCouplings;

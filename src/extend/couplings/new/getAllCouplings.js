'use strict';

const OCLE = require('../../..');
const changeAtom = require('../../diastereotopic/migrated/changeAtom');
const makeRacemic = require('../../diastereotopic/migrated/makeRacemic');

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

  const minSphereSize = 0;
  const maxSphereSize = 2;

  let fragment = new OCLE.Molecule(0, 0);
  for (let path of paths.slice(0, 1)) {
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
        path.code = [];

        let tmpMolecule = molecule.getCompactCopy();
        makeRacemic(tmpMolecule);
        changeAtom(tmpMolecule, atoms[0]);
        changeAtom(tmpMolecule, atoms[atoms.length - 1]);
        console.log(atoms);
        let atomMask = new Array(tmpMolecule.getAllAtoms()).fill(false);
        let atomList = [];
        let max = 0;
        let min = 0;
        for (var sphere = 0; sphere <= maxSphereSize; sphere++) {
          if (max === 0) {
            for (let atom of atoms) {
              atomMask[atom] = true;
              atomList.push(atom);
              max++;
            }
          } else {
            let newMax = max;
            for (let i = min; i < max; i++) {
              let atom = atomList[i];
              for (let j = 0; j < tmpMolecule.getConnAtoms(atom); j++) {
                let connAtom = tmpMolecule.getConnAtom(atom, j);
                atomMask[connAtom] = true;
                atomList[newMax++] = connAtom;
              }
            }
            min = max;
            max = newMax;
          }
          tmpMolecule.copyMoleculeByAtoms(fragment, atomMask, true, null);
          if (sphere >= minSphereSize) {
            path.code.push(
              fragment.getCanonizedIDCode(
                OCLE.Molecule.CANONIZER_ENCODE_ATOM_CUSTOM_LABELS
              )
            );
          }
        }
      }
    }
  }
  return paths;
}

module.exports = getAllCouplings;

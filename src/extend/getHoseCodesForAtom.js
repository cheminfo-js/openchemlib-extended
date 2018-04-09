
// This is a javascript COPY of the java class !!!!
'use strict';


module.exports = function (OCL) {
  return function getHoseCodesForAtom(rootAtom, options = {}) {
    let FULL_HOSE_CODE = 1;
    let HOSE_CODE_CUT_C_SP3_SP3 = 2;
    const {
      minSphereSize = 0,
      maxSphereSize = 4,
      kind = FULL_HOSE_CODE,
    } = options;

    let molecule = this.getCompactCopy();

    molecule.setAtomCustomLabel(rootAtom, `${molecule.getAtomLabel(rootAtom)}*`);
    molecule.setAtomicNo(rootAtom, OCL.Molecule.getAtomicNoFromLabel('X'));

    let fragment = new OCL.Molecule();
    let results = [];
    let min = 0;
    let max = 0;
    let atomMask = new Array(molecule.getAllAtoms());
    let atomList = new Array(molecule.getAllAtoms());

    for (var sphere = 0; sphere <= maxSphereSize; sphere++) {
      if (max === 0) {
        atomList[0] = rootAtom;
        atomMask[rootAtom] = true;
        max = 1;
      } else {
        let newMax = max;
        for (let i = min; i < max; i++) {
          let atom = atomList[i];
          for (let j = 0; j < molecule.getConnAtoms(atom); j++) {
            let connAtom = molecule.getConnAtom(atom, j);
            if (!atomMask[connAtom]) {
              switch (kind) {
                case FULL_HOSE_CODE:
                  atomMask[connAtom] = true;
                  atomList[newMax++] = connAtom;
                  break;
                case HOSE_CODE_CUT_C_SP3_SP3:
                  if (!(isCsp3(molecule, atom) && isCsp3(molecule, connAtom))) {
                    atomMask[connAtom] = true;
                    atomList[newMax++] = connAtom;
                  }
                  break;
                default:
                  throw new Error('getHoseCoesForAtom unknown kind');
              }
            }
          }
        }
        min = max;
        max = newMax;
      }
      molecule.copyMoleculeByAtoms(fragment, atomMask, true, null);
      if (sphere >= minSphereSize) {
        results.push(fragment.getCanonizedIDCode(OCL.Molecule.CANONIZER_ENCODE_ATOM_CUSTOM_LABELS));
      }
    }
    return results;
  };

  function isCsp3(molecule, atomID) {
    if (molecule.getAtomicNo(atomID) !== 6) return false;
    if (molecule.getAtomCharge(atomID) !== 0) return false;
    if ((molecule.getImplicitHydrogens(atomID) + molecule.getConnAtoms(atomID)) !== 4) return false;
    return true;
  }
};

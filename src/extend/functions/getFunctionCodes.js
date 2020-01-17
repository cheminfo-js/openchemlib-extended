'use strict';

module.exports = function(OCL) {
  return function getFunctionCodes() {
    let molecule = this.getCompactCopy();
    let atoms = molecule.getAtomsInfo();
    for (let i = 0; i < molecule.getAllAtoms(); i++) {
      let atom = atoms[i];
      atom.i = i;
      atom.mapNo = molecule.getAtomMapNo(i);
      atom.links = []; // we will store connected atoms of broken bonds
    }

    let bonds = [];
    for (let i = 0; i < molecule.getAllBonds(); i++) {
      let bond = {};
      bonds.push(bond);
      bond.i = i;
      bond.order = molecule.getBondOrder(i);
      bond.atom1 = molecule.getBondAtom(0, i);
      bond.atom2 = molecule.getBondAtom(1, i);
      bond.type = molecule.getBondType(i);
      bond.isAromatic = molecule.isAromaticBond(i);

      if (
        !bond.isAromatic &&
        molecule.getBondTypeSimple(i) === 1 &&
        molecule.getAtomicNo(bond.atom1) === 6 &&
        molecule.getAtomicNo(bond.atom2) === 6 &&
        (atoms[bond.atom1].extra.cnoHybridation === 3 ||
          atoms[bond.atom2].extra.cnoHybridation === 3)
      ) {
        bond.selected = true;
        atoms[bond.atom1].links.push(bond.atom2);
        atoms[bond.atom2].links.push(bond.atom1);
      }
    }

    let brokenMolecule = molecule.getCompactCopy();
    for (let bond of bonds) {
      if (bond.selected) {
        brokenMolecule.markBondForDeletion(bond.i);
      }
    }

    brokenMolecule.deleteMarkedAtomsAndBonds();
    let fragmentMap = [];
    let nbFragments = brokenMolecule.getFragmentNumbers(fragmentMap);

    let results = {};

    for (let i = 0; i < nbFragments; i++) {
      let result = {};
      result.atomMap = [];
      let includeAtom = fragmentMap.map(function(id) {
        return id === i;
      });
      let fragment = new OCL.Molecule(0, 0);
      let atomMap = [];
      brokenMolecule.copyMoleculeByAtoms(fragment, includeAtom, false, atomMap);
      let parent = fragment.getCompactCopy();
      parent.setFragment(true);
      // we will remove the hydrogens of the broken carbon
      for (let j = 0; j < atomMap.length; j++) {
        if (atomMap[j] > -1) {
          //                var numberDeletedHydrogens = 0;
          if (atoms[j].links.length > 0) {
            for (let k = 0; k < atoms[j].links.length; k++) {
              if (parent.getAtomicNo(atoms[j].links[k]) === 1) {
                //                           numberDeletedHydrogens++;
                fragment.deleteAtom(atoms[j].links[k]);
              }
            }
          }
          fragment.ensureHelperArrays(OCL.Molecule.cHelperBitNeighbours);
          // we will allow any substitution on sp3 hydrogens
          // that is at an extremety (only one connection)

          if (
            atoms[j].atomicNo === 6 &&
            fragment.getConnAtoms(atomMap[j]) > 1
          ) {
            if (atoms[j].allHydrogens !== 0) {
              parent.setAtomQueryFeature(
                atomMap[j],
                OCL.Molecule.cAtomQFNot0Hydrogen,
                true,
              );
            }
            if (atoms[j].allHydrogens !== 1) {
              parent.setAtomQueryFeature(
                atomMap[j],
                OCL.Molecule.cAtomQFNot1Hydrogen,
                true,
              );
            }
            if (atoms[j].allHydrogens !== 2) {
              parent.setAtomQueryFeature(
                atomMap[j],
                OCL.Molecule.cAtomQFNot2Hydrogen,
                true,
              );
            }
            if (atoms[j].allHydrogens !== 3) {
              parent.setAtomQueryFeature(
                atomMap[j],
                OCL.Molecule.cAtomQFNot3Hydrogen,
                true,
              );
            }
          }
          if (atoms[j].atomicNo !== 6) {
            parent.setAtomQueryFeature(
              atomMap[j],
              OCL.Molecule.cAtomQFNoMoreNeighbours,
              true,
            );
          }
        }
      }

      result.parent = parent.getIDCode();
      fragment.setFragment(false); // required for small molecules like methanol

      // we will add some R groups at the level of the broken bonds
      for (let j = 0; j < atomMap.length; j++) {
        if (atomMap[j] > -1) {
          result.atomMap.push(j);
          if (atoms[j].links.length > 0) {
            for (let k = 0; k < atoms[j].links.length; k++) {
              let rGroup = fragment.addAtom(154);
              let x = molecule.getAtomX(atoms[j].links[k]);
              let y = molecule.getAtomY(atoms[j].links[k]);
              fragment.setAtomX(rGroup, x);
              fragment.setAtomY(rGroup, y);
              fragment.addBond(atomMap[j], rGroup, 1);
            }
          }
        }
      }
      result.idCode = fragment.getIDCode();

      if (results[result.idCode]) {
        results[result.idCode].atomMap = results[result.idCode].atomMap.concat(
          result.atomMap,
        );
      } else {
        results[result.idCode] = {
          atomMap: result.atomMap,
          idCode: result.idCode,
        };
      }

      if (results[result.parent]) {
        results[result.parent].atomMap = results[result.parent].atomMap.concat(
          result.atomMap,
        );
      } else {
        results[result.parent] = {
          atomMap: result.atomMap,
          idCode: result.parent,
        };
      }
    }

    // fragments should be unique
    let fragments = [];
    Object.keys(results).forEach(function(key) {
      fragments.push(results[key]);
    });
    return fragments;
  };
};

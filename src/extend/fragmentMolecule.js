'use strict';

/**
 * @returns [array] array of extended bond bonds
 */

function cleaveBonds(molecule, options = {}) {
  const {
    filter = (bond) => !bond.isAromatic && bond.kind === 1 && bond.ringSize === 0,
    hose = {

    }
  } = options;
  var atoms = [];
  for (var i = 0; i < molecule.getAllAtoms(); i++) {
    var atom = {};
    atoms.push(atom);
    atom.i = i;
    atom.mapNo = molecule.getAtomMapNo(i);
    atom.links = []; // we will store connected atoms of broken bonds
  }

  var bonds = [];
  for (let i = 0; i < molecule.getAllBonds(); i++) {
    let bond = {};
    bond.i = i;
    bond.order = molecule.getBondOrder(i);
    bond.atom1 = molecule.getBondAtom(0, i);
    bond.atom2 = molecule.getBondAtom(1, i);
    bond.kind = molecule.getBondType(i);
    bond.isAromatic = molecule.isAromaticBond(i);
    bond.ringSize = molecule.getBondRingSize(i);
    if (filter(bond)) {
      bond.selected = true;
      atoms[bond.atom1].links.push(bond.atom2);
      atoms[bond.atom2].links.push(bond.atom1);
      bonds.push(bond);
    }
  }

  for (var bond of bonds) {
    bond.fragments = breakMolecule(molecule, atoms, bond);
  }
  return bonds;
}


function breakMolecule(molecule, atoms, bond) {
  let brokenMolecule = molecule.getCompactCopy();
  brokenMolecule.markBondForDeletion(bond.i);
  brokenMolecule.deleteMarkedAtomsAndBonds();
  var fragmentMap = [];
  var nbFragments = brokenMolecule.getFragmentNumbers(fragmentMap);
  var results = [];
  for (var i = 0; i < nbFragments; i++) {
    var result = {};
    result.atomMap = [];
    var includeAtom = fragmentMap.map((id) => id === i);
    var fragment = new OCL.Molecule();
    var atomMap = [];
    brokenMolecule.copyMoleculeByAtoms(fragment, includeAtom, false, atomMap);
    // we will add some R groups at the level of the broken bonds
    fragment.setFragment(false);
    if (atomMap[bond.atom1] > -1) {
      fragment.addBond(atomMap[bond.atom1], fragment.addAtom(154), 1);
      bond.hoses1 = getHoseCodesForAtom(fragment, atomMap[bond.atom1], {
        maxSphereSize: 4,
        kind: 1
      }).map((f, i) => ({ f, i }));
    }
    if (atomMap[bond.atom2] > -1) {
      fragment.addBond(atomMap[bond.atom2], fragment.addAtom(154), 1);
      bond.hoses2 = getHoseCodesForAtom(fragment, atomMap[bond.atom2], {
        maxSphereSize: 4,
        kind: 1
      }).map((f, i) => ({ f, i }));
    }
    result.idCode = fragment.getIDCode();
    result.mf = fragment.getMolecularFormula().formula.replace(/R([1-9]|(?=[A-Z])|$)/, '');
    results.push(result);
  }
  return results;
}


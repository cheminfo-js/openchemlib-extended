'use strict';

/**
 * @returns [array] array of extended bond bonds
 */

module.exports = function(OCL) {
  return function cleaveBonds(options = {}) {
    const {
      filter = bond =>
        !bond.isAromatic && bond.kind === 1 && bond.ringSize === 0,
      hose = {
        minSphereSize: 1,
        maxSphereSize: 3
      }
    } = options;

    var atoms = [];
    for (var i = 0; i < this.getAllAtoms(); i++) {
      const atom = {};
      atoms.push(atom);
      atom.i = i;
      atom.mapNo = this.getAtomMapNo(i);
      atom.links = []; // we will store connected atoms of broken bonds
    }

    const bonds = [];
    for (let i = 0; i < this.getAllBonds(); i++) {
      let bond = {};
      bond.i = i;
      bond.order = this.getBondOrder(i);
      bond.atom1 = this.getBondAtom(0, i);
      bond.atom2 = this.getBondAtom(1, i);
      bond.kind = this.getBondType(i);
      bond.isAromatic = this.isAromaticBond(i);
      bond.ringSize = this.getBondRingSize(i);
      if (filter(bond)) {
        bond.selected = true;
        atoms[bond.atom1].links.push(bond.atom2);
        atoms[bond.atom2].links.push(bond.atom1);
        bonds.push(bond);
      }
    }

    for (var bond of bonds) {
      bond.fragments = breakMolecule(this, atoms, bond, hose);
    }
    return bonds;
  };

  function breakMolecule(molecule, atoms, bond, hoseOptions) {
    let brokenMolecule = molecule.getCompactCopy();
    brokenMolecule.markBondForDeletion(bond.i);
    brokenMolecule.deleteMarkedAtomsAndBonds();
    var fragmentMap = [];
    var nbFragments = brokenMolecule.getFragmentNumbers(fragmentMap);
    var results = [];
    for (var i = 0; i < nbFragments; i++) {
      var result = {};
      result.atomMap = [];
      var includeAtom = fragmentMap.map(id => id === i); // eslint-disable-line no-loop-func
      var fragment = new OCL.Molecule(0, 0);
      var atomMap = [];
      brokenMolecule.copyMoleculeByAtoms(fragment, includeAtom, false, atomMap);
      // we will add some R groups at the level of the broken bonds
      fragment.setFragment(false);
      if (atomMap[bond.atom1] > -1) {
        fragment.addBond(atomMap[bond.atom1], fragment.addAtom(154), 1);
        bond.hoses1 = fragment
          .getHoseCodesForAtom(atomMap[bond.atom1], hoseOptions)
          .map((f, i) => ({ f, i }));
      }
      if (atomMap[bond.atom2] > -1) {
        fragment.addBond(atomMap[bond.atom2], fragment.addAtom(154), 1);
        bond.hoses2 = fragment
          .getHoseCodesForAtom(atomMap[bond.atom2], hoseOptions)
          .map((f, i) => ({ f, i }));
      }
      result.idCode = fragment.getIDCode();
      result.mf = fragment.getMF().mf.replace(/R([1-9]|(?=[A-Z(])|$)/, '');
      results.push(result);
    }
    return results;
  }
};

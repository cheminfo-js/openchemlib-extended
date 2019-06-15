'use strict';

const FS = require('fs');

const OCL = require('openchemlib');

const DiastereotopicAtomID = require('../DiastereotopicAtomID');


describe('DiastereotopicAtomID', () => {
  it('check diastereotopicID implicit hydrogens ', () => {
    // This is a manual snapshot. It should not be reconstructed!. Use 100 examples for speed reasons
    let smiles = FS.readFileSync(`${__dirname}/diaids.snapshot`).toString().split('\n').slice(0, 50);
    // for each predict all atomIDs, expands Hydroges do the same using bot versions of the library
    smiles.forEach((line) => {
      let row = line.split('\t');
      let value = row[0];
      if (value && value.length > 0) {
        let molecule = OCL.Molecule.fromSmiles(value);
        let newIds = DiastereotopicAtomID.getAtomIDs(molecule);
        // let oldIDs = molecule.getDiastereotopicAtomIDs();
        // console.log(value + '\t' + JSON.stringify(oldIDs));
        expect(JSON.stringify(newIds)).toBe(row[1]);
      }
    });
  });

  it('check diastereotopicID explicit hydrogens ', () => {
    // This is a manual snapshot. It should not be reconstructed!. Use 100 examples for speed reasons
    let smiles = FS.readFileSync(`${__dirname}/diaids_h.snapshot`).toString().split('\n').slice(0, 50);
    // for each predict all atomIDs, expands Hydroges do the same using bot versions of the library
    smiles.forEach((line) => {
      let row = line.split('\t');
      let value = row[0];
      if (value && value.length > 0) {
        let molecule = OCL.Molecule.fromSmiles(value);
        molecule.addImplicitHydrogens();
        let newIds = DiastereotopicAtomID.getAtomIDs(molecule);
        // let oldIDs = molecule.getDiastereotopicAtomIDs();
        // console.log(value + '\t' + JSON.stringify(oldIDs));
        expect(JSON.stringify(newIds)).toBe(row[1]);
      }
    });
  });
});

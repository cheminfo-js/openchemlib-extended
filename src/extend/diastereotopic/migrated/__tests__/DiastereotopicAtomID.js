'use strict';

const OCL = require('openchemlib');

const DiastereotopicAtomID = require('../DiastereotopicAtomID');

describe('DiastereotopicAtomID', () => {
  it('check that is contains the diastereotopicID', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC');
    let ids = DiastereotopicAtomID.getAtomIDs(molecule);
    console.log(ids);
    expect(svg.indexOf('data-atomid=')).toBe(619);
  });
});

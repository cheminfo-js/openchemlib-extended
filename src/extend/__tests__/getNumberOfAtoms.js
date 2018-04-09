'use strict';

const OCLE = require('../..');

describe('getNumberOfAtoms test 1-chloropropane', () => {
  test('check 1-chloropropane', () => {
    var molecule = OCLE.Molecule.fromSmiles('CCCCl');
    expect(molecule.getNumberOfAtoms({ atomLabel: 'H' })).toBe(7);
    expect(molecule.getNumberOfAtoms({ atomLabel: 'Cl' })).toBe(1);
    expect(molecule.getNumberOfAtoms({ atomLabel: 'Br' })).toBe(0);
  });
});

'use strict';

const OCLE = require('../..');

describe('getGroupedDiastereotopicIDs test propane', () => {
  test('should yield the right table for all atoms', () => {
    var molecule = OCLE.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();
    var diaIDs = molecule.getGroupedDiastereotopicAtomIDs();
    expect(diaIDs).toHaveLength(4);
    expect(diaIDs[0].counter).toBe(2);
    expect(diaIDs[0].atoms).toHaveLength(2);
    expect(diaIDs[0].oclID).toBe('eM@Df`Xb`RP\\Jh');
  });

  test('should yield the right table for carbons', () => {
    var molecule = OCLE.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();
    var diaIDs = molecule.getGroupedDiastereotopicAtomIDs({
      atomLabel: 'C'
    });
    expect(diaIDs).toHaveLength(2);
    expect(diaIDs[0].counter).toBe(2);
    expect(diaIDs[0].atoms).toHaveLength(2);
    expect(diaIDs[0].oclID).toBe('eM@Df`Xb`RP\\Jh');
  });

  test('should yield the right table for hydrogens', () => {
    var molecule = OCLE.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();
    var diaIDs = molecule.getGroupedDiastereotopicAtomIDs({
      atomLabel: 'H'
    });
    expect(diaIDs).toHaveLength(2);
    expect(diaIDs[0].counter).toBe(6);
    expect(diaIDs[0].atoms).toHaveLength(6);
    expect(diaIDs[0].oclID).toBe('gC`HALiKT@\u007FRHDRj@');
  });
});

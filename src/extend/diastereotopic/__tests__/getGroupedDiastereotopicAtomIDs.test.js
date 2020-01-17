'use strict';

const OCLE = require('../../..');

describe('getGroupedDiastereotopicIDs test propane', () => {
  it('should yield the right table for all atoms', () => {
    let molecule = OCLE.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();
    let diaIDs = molecule.getGroupedDiastereotopicAtomIDs();
    expect(diaIDs).toHaveLength(4);
    expect(diaIDs[0].counter).toBe(2);
    expect(diaIDs[0].atoms).toHaveLength(2);
    expect(diaIDs[0].oclID).toBe('eM@Df`Xb`RP\\Jh');
  });

  it('should yield the right table for carbons', () => {
    let molecule = OCLE.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();
    let diaIDs = molecule.getGroupedDiastereotopicAtomIDs({
      atomLabel: 'C',
    });
    expect(diaIDs).toHaveLength(2);
    expect(diaIDs[0].counter).toBe(2);
    expect(diaIDs[0].atoms).toHaveLength(2);
    expect(diaIDs[0].oclID).toBe('eM@Df`Xb`RP\\Jh');
  });

  it('should yield the right table for hydrogens', () => {
    let molecule = OCLE.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();
    let diaIDs = molecule.getGroupedDiastereotopicAtomIDs({
      atomLabel: 'H',
    });
    expect(diaIDs).toHaveLength(2);
    expect(diaIDs[0].counter).toBe(6);
    expect(diaIDs[0].atoms).toHaveLength(6);
    expect(diaIDs[0].oclID).toBe('gC`HALiKT@\u007FRHDRj@');
  });
});

'use strict';

const OCLE = require('../..');

describe('getGroupedHOSECodes test propane', () => {
  test('should yield the right table without atom filtering', () => {
    var molecule = OCLE.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();
    var diaIDs = molecule.getGroupedHOSECodes();
    expect(diaIDs).toHaveLength(4);
    expect(diaIDs[0].counter).toBe(2);
    expect(diaIDs[0].atoms).toHaveLength(2);
    expect(diaIDs[0].oclID).toBe('eM@Df`Xb`RP\\Jh');
    expect(diaIDs[0].hoses).toHaveLength(3);
  });

  test('should yield the right table only C', () => {
    var molecule = OCLE.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();
    var diaIDs = molecule.getGroupedHOSECodes({
      atomLabel: 'C'
    });
    expect(diaIDs).toHaveLength(2);
    expect(diaIDs[0].counter).toBe(2);
    expect(diaIDs[0].atoms).toHaveLength(2);
    expect(diaIDs[0].oclID).toBe('eM@Df`Xb`RP\\Jh');
    expect(diaIDs[0].hoses).toHaveLength(3);
  });

  test('should yield the right table only H', () => {
    var molecule = OCLE.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();
    var diaIDs = molecule.getGroupedHOSECodes({
      atomLabel: 'H'
    });
    expect(diaIDs).toHaveLength(2);
    expect(diaIDs[0].counter).toBe(6);
    expect(diaIDs[0].atoms).toHaveLength(6);
    expect(diaIDs[0].oclID).toBe('gC`HALiKT@\u007FRHDRj@');
    expect(diaIDs[0].hoses).toHaveLength(4);
  });
});

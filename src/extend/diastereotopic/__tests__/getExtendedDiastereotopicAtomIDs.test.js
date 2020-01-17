'use strict';

const OCLE = require('../../..');

describe('getExtendedDiastereotopicIDs test propane', () => {
  it('should yield the right table - propane', () => {
    let molecule = OCLE.Molecule.fromSmiles('CCC');
    let diaIDs = molecule.getExtendedDiastereotopicAtomIDs();

    expect(diaIDs).toHaveLength(11);
    expect(diaIDs[0].nbHydrogens).toBe(3);
    expect(diaIDs[0].hydrogenOCLIDs).toHaveLength(1);
    expect(diaIDs[0].hydrogenOCLIDs[0]).toBe('gC`HALiKT@RHDRj@');
  });
});

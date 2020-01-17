'use strict';

const OCLE = require('../../..');

describe('getCouplings test propane', () => {
  it('should yield the right table without atom filtering', () => {
    let molecule = OCLE.Molecule.fromSmiles('CCC');
    let diaIDs = molecule.getDiastereotopicHoseCodes();
    expect(diaIDs).toHaveLength(3);
    expect(diaIDs[0].oclID).toBe('eM@Df`Xb`RP\\Jh');
    expect(diaIDs[0].hoses).toHaveLength(3);
  });
});

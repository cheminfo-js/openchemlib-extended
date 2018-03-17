'use strict';

const OCLE = require('../..');

describe('getExtendedDiastereotopicIDs test propane', () => {

  test('should yield the right table - propane', () => {
    var molecule = OCLE.Molecule.fromSmiles('CCC');
    var diaIDs = molecule.getExtendedDiastereotopicAtomIDs();

    expect(diaIDs).toHaveLength(11);
    expect(diaIDs[0].nbHydrogens).toBe(3);
    expect(diaIDs[0].hydrogenOCLIDs).toHaveLength(1);
    expect(diaIDs[0].hydrogenOCLIDs[0]).toBe('gC`HALiKT@RHDRj@');
  });

});

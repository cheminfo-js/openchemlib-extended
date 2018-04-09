'use strict';


const OCLE = require('../..');


describe('getAllPaths test propane', () => {
  test('min:1, max:2', () => {
    var molecule = OCLE.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();

    var paths = molecule.getAllPaths({
      fromLabel: 'C',
      toLabel: 'H',
      minLength: 1,
      maxLength: 2
    });

    expect(paths).toEqual([
      { fromDiaID: 'eM@Df`Xb`RP\\Jh',
        toDiaID: 'gC`HALiKT@RHDRj@',
        fromAtoms: [0, 2],
        toAtoms: [3, 4, 5, 8, 9, 10],
        fromLabel: 'C',
        toLabel: 'H',
        pathLength: 1 },
      { fromDiaID: 'eM@Df`Xb`RP\\Jh',
        toDiaID: 'gC`HALiMT@RHDRj@',
        fromAtoms: [0, 2],
        toAtoms: [6, 7],
        fromLabel: 'C',
        toLabel: 'H',
        pathLength: 2 },
      { fromDiaID: 'eM@HzAbJC}IApj`',
        toDiaID: 'gC`HALiKT@RHDRj@',
        fromAtoms: [1],
        toAtoms: [3, 4, 5, 8, 9, 10],
        fromLabel: 'C',
        toLabel: 'H',
        pathLength: 2 },
      { fromDiaID: 'eM@HzAbJC}IApj`',
        toDiaID: 'gC`HALiMT@RHDRj@',
        fromAtoms: [1],
        toAtoms: [6, 7],
        fromLabel: 'C',
        toLabel: 'H',
        pathLength: 1 }
    ]);
  });

  test('min:2, max:2', () => {
    var molecule = OCLE.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();

    var paths = molecule.getAllPaths({
      fromLabel: 'C',
      toLabel: 'H',
      minLength: 2,
      maxLength: 2
    });
    expect(paths[1].toAtoms).toEqual([3, 4, 5, 8, 9, 10]);
  });
});

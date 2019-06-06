'use strict';


const OCLE = require('../..');


describe('getAllPaths test propane', () => {
  it('min:1, max:2', () => {
    var molecule = OCLE.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();

    var paths = molecule.getAllPaths({
      fromLabel: 'C',
      toLabel: 'H',
      minLength: 1,
      maxLength: 2
    });

    expect(paths).toStrictEqual([
      { fromDiaID: 'eM@Df`Xb`RP\\Jh',
        toDiaID: 'gC`HALiKT@RHDRj@',
        fromAtoms: [0, 0, 0, 2, 2, 2],
        toAtoms: [3, 4, 5, 8, 9, 10],
        fromLabel: 'C',
        toLabel: 'H',
        pathLength: 1 },
      { fromDiaID: 'eM@Df`Xb`RP\\Jh',
        toDiaID: 'gC`HALiMT@RHDRj@',
        fromAtoms: [0, 0, 2, 2],
        toAtoms: [6, 7, 6, 7],
        fromLabel: 'C',
        toLabel: 'H',
        pathLength: 2 },
      { fromDiaID: 'eM@HzAbJC}IApj`',
        toDiaID: 'gC`HALiKT@RHDRj@',
        fromAtoms: [1, 1, 1, 1, 1, 1],
        toAtoms: [3, 4, 5, 8, 9, 10],
        fromLabel: 'C',
        toLabel: 'H',
        pathLength: 2 },
      { fromDiaID: 'eM@HzAbJC}IApj`',
        toDiaID: 'gC`HALiMT@RHDRj@',
        fromAtoms: [1, 1],
        toAtoms: [6, 7],
        fromLabel: 'C',
        toLabel: 'H',
        pathLength: 1 }
    ]);
  });

  it('min:2, max:2', () => {
    var molecule = OCLE.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();

    var paths = molecule.getAllPaths({
      fromLabel: 'C',
      toLabel: 'H',
      minLength: 2,
      maxLength: 2
    });
    expect(paths[1].toAtoms).toStrictEqual([3, 4, 5, 8, 9, 10]);
  });
});

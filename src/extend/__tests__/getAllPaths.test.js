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

    paths = JSON.parse(JSON.stringify(paths).replace(/\u007F/g, ''));
    expect(paths).toStrictEqual([
      {
        fromDiaID: 'eM@Df`Xb`RP\\Jh',
        toDiaID: 'gC`HALiKT@RHDRj@',
        fromTo: [[0, 3], [0, 4], [0, 5], [2, 8], [2, 9], [2, 10]],
        fromLabel: 'C',
        toLabel: 'H',
        pathLength: 1
      },
      {
        fromDiaID: 'eM@Df`Xb`RP\\Jh',
        toDiaID: 'gC`HALiMT@RHDRj@',
        fromTo: [[0, 6], [0, 7], [2, 6], [2, 7]],
        fromLabel: 'C',
        toLabel: 'H',
        pathLength: 2
      },
      {
        fromDiaID: 'eM@HzAbJC}IApj`',
        toDiaID: 'gC`HALiKT@RHDRj@',
        fromTo: [[1, 3], [1, 4], [1, 5], [1, 8], [1, 9], [1, 10]],
        fromLabel: 'C',
        toLabel: 'H',
        pathLength: 2
      },
      {
        fromDiaID: 'eM@HzAbJC}IApj`',
        toDiaID: 'gC`HALiMT@RHDRj@',
        fromTo: [[1, 6], [1, 7]],
        fromLabel: 'C',
        toLabel: 'H',
        pathLength: 1
      }
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
    expect(paths[1].fromTo).toStrictEqual([
      [1, 3],
      [1, 4],
      [1, 5],
      [1, 8],
      [1, 9],
      [1, 10]
    ]);
  });

  it('CCC J-HH 1 to 4 ', () => {
    var molecule = OCLE.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();

    var paths = molecule.getAllPaths({
      fromLabel: 'H',
      toLabel: 'H',
      minLength: 1,
      maxLength: 4
    });

    paths = JSON.parse(JSON.stringify(paths).replace(/\u007F/g, ''));

    expect(paths).toStrictEqual([
      {
        fromDiaID: 'gC`HALiKT@RHDRj@',
        toDiaID: 'gC`HALiKT@RHDRj@',
        fromTo: [
          [3, 4],
          [3, 5],
          [4, 3],
          [4, 5],
          [5, 3],
          [5, 4],
          [8, 9],
          [8, 10],
          [9, 8],
          [9, 10],
          [10, 8],
          [10, 9]
        ],
        fromLabel: 'H',
        toLabel: 'H',
        pathLength: 2
      },
      {
        fromDiaID: 'gC`HALiKT@RHDRj@',
        toDiaID: 'gC`HALiMT@RHDRj@',
        fromTo: [
          [3, 6],
          [3, 7],
          [4, 6],
          [4, 7],
          [5, 6],
          [5, 7],
          [8, 6],
          [8, 7],
          [9, 6],
          [9, 7],
          [10, 6],
          [10, 7]
        ],
        fromLabel: 'H',
        toLabel: 'H',
        pathLength: 3
      },
      {
        fromDiaID: 'gC`HALiKT@RHDRj@',
        toDiaID: 'gC`HALiKT@RHDRj@',
        fromTo: [
          [3, 8],
          [3, 9],
          [3, 10],
          [4, 8],
          [4, 9],
          [4, 10],
          [5, 8],
          [5, 9],
          [5, 10],
          [8, 3],
          [8, 4],
          [8, 5],
          [9, 3],
          [9, 4],
          [9, 5],
          [10, 3],
          [10, 4],
          [10, 5]
        ],
        fromLabel: 'H',
        toLabel: 'H',
        pathLength: 4
      },
      {
        fromDiaID: 'gC`HALiMT@RHDRj@',
        toDiaID: 'gC`HALiKT@RHDRj@',
        fromTo: [
          [6, 3],
          [6, 4],
          [6, 5],
          [6, 8],
          [6, 9],
          [6, 10],
          [7, 3],
          [7, 4],
          [7, 5],
          [7, 8],
          [7, 9],
          [7, 10]
        ],
        fromLabel: 'H',
        toLabel: 'H',
        pathLength: 3
      },
      {
        fromDiaID: 'gC`HALiMT@RHDRj@',
        toDiaID: 'gC`HALiMT@RHDRj@',
        fromTo: [[6, 7], [7, 6]],
        fromLabel: 'H',
        toLabel: 'H',
        pathLength: 2
      }
    ]);
  });

  it('p-aromatic', () => {
    var molecule = OCLE.Molecule.fromSmiles('c1(Cl)ccc(Br)cc1');
    molecule.addImplicitHydrogens();

    var paths = molecule.getAllPaths({
      fromLabel: 'H',
      toLabel: 'H',
      minLength: 1,
      maxLength: 5
    });
    expect(paths).toStrictEqual([
      {
        fromDiaID: 'did@p@fRbAqDfYun``H@GzP`HeT',
        toDiaID: 'did@p@fRqAbDfYun``H@GzP`HeT',
        fromTo: [[8, 9], [11, 10]],
        fromLabel: 'H',
        toLabel: 'H',
        pathLength: 3
      },
      {
        fromDiaID: 'did@p@fRbAqDfYun``H@GzP`HeT',
        toDiaID: 'did@p@fRqAbDfYun``H@GzP`HeT',
        fromTo: [[8, 10], [11, 9]],
        fromLabel: 'H',
        toLabel: 'H',
        pathLength: 5
      },
      {
        fromDiaID: 'did@p@fRbAqDfYun``H@GzP`HeT',
        toDiaID: 'did@p@fRbAqDfYun``H@GzP`HeT',
        fromTo: [[8, 11], [11, 8]],
        fromLabel: 'H',
        toLabel: 'H',
        pathLength: 4
      },
      {
        fromDiaID: 'did@p@fRqAbDfYun``H@GzP`HeT',
        toDiaID: 'did@p@fRbAqDfYun``H@GzP`HeT',
        fromTo: [[9, 8], [10, 11]],
        fromLabel: 'H',
        toLabel: 'H',
        pathLength: 3
      },
      {
        fromDiaID: 'did@p@fRqAbDfYun``H@GzP`HeT',
        toDiaID: 'did@p@fRqAbDfYun``H@GzP`HeT',
        fromTo: [[9, 10], [10, 9]],
        fromLabel: 'H',
        toLabel: 'H',
        pathLength: 4
      },
      {
        fromDiaID: 'did@p@fRqAbDfYun``H@GzP`HeT',
        toDiaID: 'did@p@fRbAqDfYun``H@GzP`HeT',
        fromTo: [[9, 11], [10, 8]],
        fromLabel: 'H',
        toLabel: 'H',
        pathLength: 5
      }
    ]);
  });
});

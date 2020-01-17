'use strict';

const OCLE = require('../..');

describe('getConnectivityMatrix test propane', () => {
  it('propane with expanded hydrogens', () => {
    let molecule = OCLE.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();

    let connectivityMatrix = molecule.getConnectivityMatrix();
    expect(connectivityMatrix).toStrictEqual([
      [1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0],
      [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    ]);
  });

  it('benzene', () => {
    let molecule = OCLE.Molecule.fromSmiles('c1ccccc1');
    let connectivityMatrix = molecule.getConnectivityMatrix();
    expect(connectivityMatrix).toStrictEqual([
      [1, 1, 0, 0, 0, 1],
      [1, 1, 1, 0, 0, 0],
      [0, 1, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 0],
      [0, 0, 0, 1, 1, 1],
      [1, 0, 0, 0, 1, 1],
    ]);
  });

  it('benzene with single, double, triple', () => {
    let molecule = OCLE.Molecule.fromSmiles('c1ccccc1');
    let connectivityMatrix = molecule.getConnectivityMatrix({
      sdt: true,
    });
    expect(connectivityMatrix).toStrictEqual([
      [1, 2, 0, 0, 0, 1],
      [2, 1, 1, 0, 0, 0],
      [0, 1, 1, 2, 0, 0],
      [0, 0, 2, 1, 1, 0],
      [0, 0, 0, 1, 1, 2],
      [1, 0, 0, 0, 2, 1],
    ]);
  });

  it('benzene with mass diagonal', () => {
    let molecule = OCLE.Molecule.fromSmiles('c1ccccc1');
    let connectivityMatrix = molecule.getConnectivityMatrix({
      mass: true,
    });
    expect(connectivityMatrix).toStrictEqual([
      [12, 1, 0, 0, 0, 1],
      [1, 12, 1, 0, 0, 0],
      [0, 1, 12, 1, 0, 0],
      [0, 0, 1, 12, 1, 0],
      [0, 0, 0, 1, 12, 1],
      [1, 0, 0, 0, 1, 12],
    ]);
  });

  it('benzene with atomic number on diagonal', () => {
    let molecule = OCLE.Molecule.fromSmiles('c1ccccc1');
    let connectivityMatrix = molecule.getConnectivityMatrix({
      atomicNo: true,
    });
    expect(connectivityMatrix).toStrictEqual([
      [6, 1, 0, 0, 0, 1],
      [1, 6, 1, 0, 0, 0],
      [0, 1, 6, 1, 0, 0],
      [0, 0, 1, 6, 1, 0],
      [0, 0, 0, 1, 6, 1],
      [1, 0, 0, 0, 1, 6],
    ]);
  });

  it('benzene pathLength matrix', () => {
    let molecule = OCLE.Molecule.fromSmiles('c1ccccc1');
    let connectivityMatrix = molecule.getConnectivityMatrix({
      pathLength: true,
    });
    expect(connectivityMatrix).toStrictEqual([
      [0, 1, 2, 3, 2, 1],
      [1, 0, 1, 2, 3, 2],
      [2, 1, 0, 1, 2, 3],
      [3, 2, 1, 0, 1, 2],
      [2, 3, 2, 1, 0, 1],
      [1, 2, 3, 2, 1, 0],
    ]);
  });
});

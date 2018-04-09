'use strict';

const OCLE = require('../..');

describe('getMF test', () => {
  test('check benzene', () => {
    var molecule = OCLE.Molecule.fromSmiles('c1ccccc1');
    var result = molecule.getMF();
    expect(result.mf).toBe('C6H6');
    expect(result.parts).toHaveLength(1);
    expect(result.parts[0]).toBe('C6H6');
  });
  test('check glycine', () => {
    var molecule = OCLE.Molecule.fromSmiles('[NH3+]CC(=O)[O-]');
    var result = molecule.getMF();
    expect(result.mf).toBe('C2H5NO2');
    expect(result.parts).toHaveLength(1);
    expect(result.parts[0]).toBe('C2H5NO2');
  });
  test('check isotope of pentane', () => {
    var molecule = OCLE.Molecule.fromSmiles('CC[13CH2]CC([2H])([2H])([2H])');
    var result = molecule.getMF();
    expect(result.mf).toBe('C4H9[13C][2H]3');
    expect(result.parts).toHaveLength(1);
    expect(result.parts[0]).toBe('C4H9[13C][2H]3');
  });
  test('check multipart', () => {
    var molecule = OCLE.Molecule.fromSmiles('OCC(N)CCl.[CH2+][2H]');
    var result = molecule.getMF();
    expect(result.mf).toBe('C4H10ClNO[2H](+)');
    expect(result.parts).toHaveLength(2);
    expect(result.parts[0]).toBe('C3H8ClNO');
    expect(result.parts[1]).toBe('CH2[2H](+)');
  });
  test('check multihydrate', () => {
    var molecule = OCLE.Molecule.fromSmiles('[ClH].O.O.O.O');

    var result = molecule.getMF();
    expect(result.mf).toBe('H9ClO4');
    expect(result.parts).toHaveLength(2);
    expect(result.parts[0]).toBe('4H2O');
    expect(result.parts[1]).toBe('HCl');
  });

  test('check 4 H2O', () => {
    var molecule = OCLE.Molecule.fromSmiles('O.O.O.O');

    var result = molecule.getMF();
    expect(result.mf).toBe('H8O4');
    expect(result.parts).toHaveLength(1);
    expect(result.parts[0]).toBe('4H2O');
  });

  test('check Li+ OH-', () => {
    var molecule = OCLE.Molecule.fromIDCode('eDJRpCjP@');
    var result = molecule.getMF();
    expect(result.mf).toBe('HLiO');
    expect(result.parts).toHaveLength(2);
    expect(result.parts[0]).toBe('HO(-)');
    expect(result.parts[1]).toBe('Li(+)');
  });

  test('check 2 atoms of cobalt', () => {
    // if we have the same molecular formula we group them and count in front
    var molecule = OCLE.Molecule.fromIDCode('eDACXm`@@');
    var result = molecule.getMF();
    expect(result.mf).toBe('Co2');
    expect(result.parts).toHaveLength(1);
    expect(result.parts[0]).toBe('2Co');
  });

  test('check O--', () => {
    var molecule = OCLE.Molecule.fromSmiles('[O--]');
    var result = molecule.getMF();
    expect(result.mf).toBe('O(-2)');
    expect(result.parts).toHaveLength(1);
    expect(result.parts[0]).toBe('O(-2)');
  });
});

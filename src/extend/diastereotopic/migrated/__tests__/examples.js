'use strict';

const FS = require('fs');

const OCL = require('openchemlib');

const DiastereotopicAtomID = require('../DiastereotopicAtomID');

//c1ccccc1 Benzeno Completamente simétrico
//Cc1ccc(C)cc1   2 ejes de simetría
//Clc1ccc(Br)cc1   Un solo eje de simetría
//c2ccc(Oc1ccccc1)cc2   2 ejes de simetría. Benzeno - Oxigeno - Benzeno
//CCC Un eje de simetría. 2 grupos todos acoplados
//CCOCC     Simetrico 2 grupos acoplados. Cada grupo aparece 2 veces pero no acoplados entre ellos

let smiles = ['c1ccccc1', 'Cc1ccc(C)cc1', 'Clc1ccc(Br)cc1', 'c2ccc(Oc1ccccc1)cc2', 'CCC', 'CCOCC'];


describe('Magnetically equivalent vs Chemicallu equivalent', () => {
  it('Chemically equivalent c1ccccc1', () => {
    let molecule = OCL.Molecule.fromSmiles('c1ccccc1');
    let ids = molecule.getGroupedDiastereotopicAtomIDs();
    expect(ids.length).toBe(1);
  });

  it('Chemically equivalent Cc1ccc(C)cc1', () => {
    let molecule = OCL.Molecule.fromSmiles('Cc1ccc(C)cc1');
    let ids = molecule.getGroupedDiastereotopicAtomIDs();
    expect(ids.length).toBe(3);
  });

  it('Chemically equivalent Clc1ccc(Br)cc1', () => {
    let molecule = OCL.Molecule.fromSmiles('Clc1ccc(Br)cc1');
    let ids = molecule.getGroupedDiastereotopicAtomIDs();
    expect(ids.length).toBe(2);
  });

  it('Chemically equivalent c2ccc(Oc1ccccc1)cc2', () => {
    let molecule = OCL.Molecule.fromSmiles('c2ccc(Oc1ccccc1)cc21');
    let ids = molecule.getGroupedDiastereotopicAtomIDs();
    expect(ids.length).toBe(4);
  });

  it('Chemically equivalent CCC', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC');
    let ids = molecule.getGroupedDiastereotopicAtomIDs();
    expect(ids.length).toBe(2);
  });

  it('Chemically equivalent CCOCC', () => {
    let molecule = OCL.Molecule.fromSmiles('CCOCC');
    let ids = molecule.getGroupedDiastereotopicAtomIDs();
    expect(ids.length).toBe(2);
  });

  it('Magnetically equivalent c1ccccc1', () => {
    let molecule = OCL.Molecule.fromSmiles('c1ccccc1');
    let ids = molecule.getGroupedDiastereotopicAtomIDs({type: "magnetic"});
    expect(ids.length).toBe(1);
  });

  it('Magnetically equivalent Cc1ccc(C)cc1 is 5???', () => {
    let molecule = OCL.Molecule.fromSmiles('Cc1ccc(C)cc1');
    let ids = molecule.getGroupedDiastereotopicAtomIDs({type: "magnetic"});
    expect(ids.length).toBe(5);
  });

  it('Magnetically equivalent Clc1ccc(Br)cc1', () => {
    let molecule = OCL.Molecule.fromSmiles('Clc1ccc(Br)cc1');
    let ids = molecule.getGroupedDiastereotopicAtomIDs({type: "magnetic"});
    expect(ids.length).toBe(4);
  });

  it('Magnetically equivalent c2ccc(Oc1ccccc1)cc2 is 6????', () => {
    let molecule = OCL.Molecule.fromSmiles('c2ccc(Oc1ccccc1)cc21');
    let ids = molecule.getGroupedDiastereotopicAtomIDs({type: "magnetic"});
    expect(ids.length).toBe(6);
  });

  it('Magnetically equivalent CCC', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC');
    let ids = molecule.getGroupedDiastereotopicAtomIDs({type: "magnetic"});
    expect(ids.length).toBe(2);
  });

  it('Magnetically equivalent CCOCC is 2??', () => {
    let molecule = OCL.Molecule.fromSmiles('CCOCC');
    let ids = molecule.getGroupedDiastereotopicAtomIDs({type: "magnetic"});
    expect(ids.length).toBe(2);
  });

});

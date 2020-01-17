'use strict';

const OCL = require('../../../..');

// c1ccccc1 Benzeno Completamente simétrico
// Cc1ccc(C)cc1   2 ejes de simetría
// Clc1ccc(Br)cc1   Un solo eje de simetría
// c2ccc(Oc1ccccc1)cc2   2 ejes de simetría. Benzeno - Oxigeno - Benzeno
// CCC Un eje de simetría. 2 grupos todos acoplados
// CCOCC     Simetrico 2 grupos acoplados. Cada grupo aparece 2 veces pero no acoplados entre ellos

// let smiles = ['c1ccccc1', 'Cc1ccc(C)cc1', 'Clc1ccc(Br)cc1', 'c2ccc(Oc1ccccc1)cc2', 'CCC', 'CCOCC', 'O=C1CCC(=S)CC1'];

describe('Magnetically equivalent and Chemically equivalent', () => {
  it('Chemically equivalent c1ccccc1', () => {
    let molecule = OCL.Molecule.fromSmiles('c1ccccc1');
    molecule.addImplicitHydrogens();
    let ids = molecule.getGroupedDiastereotopicAtomIDs({ atomLabel: 'H' });
    expect(ids).toHaveLength(1);

    // magnetic groups check
    let magGroups = 0;
    ids.forEach((id) => {
      magGroups += id.magneticGroups.length;
    });
    expect(magGroups).toBe(1);
  });

  it('Chemically equivalent Cc1ccc(C)cc1', () => {
    let molecule = OCL.Molecule.fromSmiles('Cc1ccc(C)cc1');
    molecule.addImplicitHydrogens();
    let ids = molecule.getGroupedDiastereotopicAtomIDs({ atomLabel: 'H' });
    expect(ids).toHaveLength(2);

    // magnetic groups check
    let magGroups = 0;
    ids.forEach((id) => {
      magGroups += id.magneticGroups.length;
    });
    expect(magGroups).toBe(4);
  });

  it('Chemically equivalent Clc1ccc(Br)cc1', () => {
    let molecule = OCL.Molecule.fromSmiles('Clc1ccc(Br)cc1');
    molecule.addImplicitHydrogens();
    let ids = molecule.getGroupedDiastereotopicAtomIDs({ atomLabel: 'H' });
    expect(ids).toHaveLength(2);

    // magnetic groups check
    let magGroups = 0;
    ids.forEach((id) => {
      magGroups += id.magneticGroups.length;
    });
    expect(magGroups).toBe(4);
  });

  it('Chemically equivalent c2ccc(Oc1ccccc1)cc2', () => {
    let molecule = OCL.Molecule.fromSmiles('c2ccc(Oc1ccccc1)cc2');
    molecule.addImplicitHydrogens();
    let ids = molecule.getGroupedDiastereotopicAtomIDs({ atomLabel: 'H' });
    expect(ids).toHaveLength(3);

    // magnetic groups check
    let magGroups = 0;
    ids.forEach((id) => {
      magGroups += id.magneticGroups.length;
    });
    expect(magGroups).toBe(10);
  });

  it('Chemically equivalent CCC', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();
    let ids = molecule.getGroupedDiastereotopicAtomIDs({ atomLabel: 'H' });
    expect(ids).toHaveLength(2);

    // magnetic groups check
    let magGroups = 0;
    ids.forEach((id) => {
      magGroups += id.magneticGroups.length;
    });
    expect(magGroups).toBe(2);
  });

  it('Chemically equivalent CCOCC', () => {
    let molecule = OCL.Molecule.fromSmiles('CCOCC');
    molecule.addImplicitHydrogens();
    let ids = molecule.getGroupedDiastereotopicAtomIDs({ atomLabel: 'H' });
    expect(ids).toHaveLength(2);
    // magnetic groups check
    let magGroups = 0;
    ids.forEach((id) => {
      magGroups += id.magneticGroups.length;
    });
    expect(magGroups).toBe(4);
  });

  it('Chemically equivalent O=C1CCC(=S)CC1', () => {
    let molecule = OCL.Molecule.fromSmiles('O=C1CCC(=S)CC1');
    molecule.addImplicitHydrogens();
    let ids = molecule.getGroupedDiastereotopicAtomIDs({ atomLabel: 'H' });
    expect(ids).toHaveLength(2);
    // magnetic groups check
    let magGroups = 0;
    ids.forEach((id) => {
      magGroups += id.magneticGroups.length;
    });
    expect(magGroups).toBe(4);
  });
});

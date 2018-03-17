'use strict';


const OCLE = require('../..');


describe('getAtomsInfo test propane', () => {

  test('should yield the right table - methanol', () => {
    var molecule = OCLE.Molecule.fromSmiles('CO');
    molecule.addImplicitHydrogens();
    var atoms = molecule.getAtomsInfo();

    expect(atoms[0]).toEqual({ oclID: 'eFHBLCETGzRSaU@',
      extra:
            { singleBonds: 4,
              doubleBonds: 0,
              tripleBonds: 0,
              aromaticBonds: 0,
              cnoHybridation: 3,
              totalBonds: 4 },
      abnormalValence: -1,
      charge: 0,
      cipParity: 0,
      color: 0,
      customLabel: null,
      atomicNo: 6,
      label: 'C',
      mass: 0,
      radical: 0,
      ringBondCount: 0,
      ringSize: 0,
      x: 0.8660254037844387,
      y: 0,
      z: 0,
      allHydrogens: 3,
      connAtoms: 1,
      allConnAtoms: 4,
      implicitHydrogens: 0,
      isAromatic: false,
      isAllylic: false,
      isStereoCenter: false,
      isRing: false,
      isSmallRing: false,
      isStabilized: false });

    expect(atoms[5]).toEqual({ oclID: 'eMJHfTf`_iHHeT',
      extra:
            { singleBonds: 1,
              doubleBonds: 0,
              tripleBonds: 0,
              aromaticBonds: 0,
              cnoHybridation: 0,
              totalBonds: 1,
              hydrogenOnAtomicNo: 8,
              labileHydrogen: true
            },
      abnormalValence: -1,
      charge: 0,
      cipParity: 0,
      color: 0,
      customLabel: null,
      atomicNo: 1,
      label: 'H',
      mass: 0,
      radical: 0,
      ringBondCount: 0,
      ringSize: 0,
      x: -0.25881904510252085,
      y: 1.4659258262890682,
      z: 0,
      allHydrogens: 0,
      connAtoms: 1,
      allConnAtoms: 1,
      implicitHydrogens: 0,
      isAromatic: false,
      isAllylic: false,
      isStereoCenter: false,
      isRing: false,
      isSmallRing: false,
      isStabilized: false });
  });

  test('should yield the right table', () => {
    var molecule = OCLE.Molecule.fromSmiles('C=CC');
    // molecule.addImplicitHydrogens();
    var atoms = molecule.getAtomsInfo();
    expect(atoms[2]).toEqual({ oclID: 'eM@DfPXb`RP\\Jh',
      extra:
            { singleBonds: 4,
              doubleBonds: 0,
              tripleBonds: 0,
              aromaticBonds: 0,
              cnoHybridation: 3,
              totalBonds: 4 },
      abnormalValence: -1,
      charge: 0,
      cipParity: 0,
      color: 0,
      customLabel: null,
      atomicNo: 6,
      label: 'C',
      mass: 0,
      radical: 0,
      ringBondCount: 0,
      ringSize: 0,
      x: 0,
      y: 0.5,
      z: 0,
      allHydrogens: 3,
      connAtoms: 1,
      allConnAtoms: 1,
      isAromatic: false,
      isAllylic: true,
      implicitHydrogens: 3,
      isStereoCenter: false,
      isRing: false,
      isSmallRing: false,
      isStabilized: false });

    // console.log(atoms);
  });

});

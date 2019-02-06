'use strict';

const OCLE = require('../..');

describe('toVisualizerMolfile on propane', () => {
  it('should yield the right molfile', () => {
    var molecule = OCLE.Molecule.fromSmiles('CCC');
    var molfile = molecule.toVisualizerMolfile({ diastereotopic: true });

    expect(molfile._atoms).toStrictEqual({ 'eM@Df`Xb`RP\\Jh': [0, 2], 'eM@HzAbJC}IApj`': [1] });
    expect(molfile._highlight).toStrictEqual(['eM@Df`Xb`RP\\Jh', 'eM@HzAbJC}IApj`']);
  });

  it('should yield the right molfile with ID on the heavy atom', () => {
    var molecule = OCLE.Molecule.fromSmiles('CCC');
    var molfile = molecule.toVisualizerMolfile({
      heavyAtomHydrogen: true,
      diastereotopic: true
    });
    expect(molfile._atoms).toStrictEqual({
      'eM@Df`Xb`RP\\Jh': [0, 2],
      'gC`HALiKT@RHDRj@': [0, 2],
      'eM@HzAbJC}IApj`': [1],
      'gC`HALiMT@RHDRj@': [1]
    });
    expect(molfile._highlight).toStrictEqual([
      'eM@Df`Xb`RP\\Jh',
      'gC`HALiKT@RHDRj@',
      'eM@HzAbJC}IApj`',
      'gC`HALiMT@RHDRj@'
    ]);
  });
});

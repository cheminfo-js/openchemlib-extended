'use strict';

const OCLE = require('../..');

describe('getFunctions test acetone', () => {
  test('should yield to ketone', () => {
    var molecule = OCLE.Molecule.fromSmiles('CC(=O)C');
    var functions = molecule.getFunctions();

    expect(functions).toHaveLength(1);
    expect(functions[0].name).toBe('ketone');
    expect(functions[0].atomMap).toEqual([1, 2]);
  });
});

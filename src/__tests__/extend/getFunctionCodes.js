'use strict';

const OCLE = require('../..');

describe('getFunctionCodes test acetone', () => {
  test('should yield the right table function codes', () => {
    var molecule = OCLE.Molecule.fromSmiles('CC(=O)C');
    var functionCodes = molecule.getFunctionCodes();

    expect(functionCodes).toHaveLength(4);
    expect(functionCodes[2].idCode).toBe('gCaDLEeKJST`@');
    expect(functionCodes[3].idCode).toBe('eFHBJD');
  });
});

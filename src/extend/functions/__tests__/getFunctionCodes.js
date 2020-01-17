'use strict';

const OCLE = require('../../..');

describe('getFunctionCodes test acetone', () => {
  it('should yield the right table function codes', () => {
    let molecule = OCLE.Molecule.fromSmiles('CC(=O)C');
    let functionCodes = molecule.getFunctionCodes();

    expect(functionCodes).toHaveLength(4);
    expect(functionCodes[2].idCode).toBe('gCaDLEeKJST`@');
    expect(functionCodes[3].idCode).toBe('eFHBJFD@');
  });
});

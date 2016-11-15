'use strict';

var OCLE = require('../..');

describe('getFunctionCodes test acetone', function () {
    it('should yield the right table function codes', function () {;
        var molecule=OCLE.Molecule.fromSmiles('CC(=O)C');
        var functionCodes=molecule.getFunctionCodes();
        
        functionCodes.length.should.equal(4);
        functionCodes[2].idCode.should.equal('gCaDLEeKJST`@');
        functionCodes[3].idCode.should.equal('eFHBJD');
    });
});

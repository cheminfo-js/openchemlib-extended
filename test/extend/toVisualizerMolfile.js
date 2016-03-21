'use strict';


var OCLE = require('../..');


describe('toVisualizerMolfile on propane', function () {
    var molecule=OCLE.Molecule.fromSmiles('CCC');
    var molfile=molecule.toVisualizerMolfile();

    it('should yield the right molfile', function () {
        molfile._atoms.should.eql({ 'eMBBYRZA~d`xUP': [ 0, 2 ], 'eMBBYchGzRCaU@': [ 1 ] });
        molfile._highlight.should.eql( [ 'eMBBYRZA~d`xUP', 'eMBBYchGzRCaU@' ])
    });
});

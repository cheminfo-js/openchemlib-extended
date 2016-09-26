'use strict';


var OCLE = require('../..');


describe('toVisualizerMolfile on propane', function () {
    it('should yield the right molfile', function () {
        var molecule=OCLE.Molecule.fromSmiles('CCC');
        var molfile=molecule.toVisualizerMolfile();

        molfile._atoms.should.eql({ 'eMBBYRZA~d`xUP': [ 0, 2 ], 'eMBBYchGzRCaU@': [ 1 ] });
        molfile._highlight.should.eql( [ 'eMBBYRZA~d`xUP', 'eMBBYchGzRCaU@' ])
    });

    
    it('should yield the right molfile with ID on the heavy atom', function () {
        var molecule=OCLE.Molecule.fromSmiles('CCC');
        var molfile=molecule.toVisualizerMolfile({
            heavyAtomHydrogen: true
        });
        molfile._atoms.should.eql({
            'eMBBYRZA~d`xUP': [ 0, 2 ],
            'gC`HALiKT@RHDRj@': [ 0, 2 ],
            'eMBBYchGzRCaU@': [ 1 ],
            'gC`HALiMT@RHDRj@': [ 1 ]
        });
        molfile._highlight.should.eql( [ 
            'eMBBYRZA~d`xUP',
            'gC`HALiKT@RHDRj@',
            'eMBBYchGzRCaU@',
            'gC`HALiMT@RHDRj@'
        ])
    });
});

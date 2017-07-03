'use strict';


var OCLE = require('../..');


describe('toVisualizerMolfile on propane', function () {
    it('should yield the right molfile', function () {
        var molecule=OCLE.Molecule.fromSmiles('CCC');
        var molfile=molecule.toVisualizerMolfile({diastereotopic: true});

        molfile._atoms.should.eql({ 'eM@HzA~ddxUP': [ 0, 2 ], 'eM@HzA~d`xUP': [ 1 ] });
        molfile._highlight.should.eql( ['eM@HzA~ddxUP', 'eM@HzA~d`xUP'  ])
    });

    it('should yield the right molfile with ID on the heavy atom', function () {
        var molecule=OCLE.Molecule.fromSmiles('CCC');
        var molfile=molecule.toVisualizerMolfile({
            heavyAtomHydrogen: true,
            diastereotopic: true
        });
        molfile._atoms.should.eql({
            'eM@HzA~ddxUP': [ 0, 2 ],
            'gC`HALiKT@RHDRj@': [ 0, 2 ],
            'eM@HzA~d`xUP': [ 1 ],
            'gC`HALiMT@RHDRj@': [ 1 ]
        });
        molfile._highlight.should.eql( [
            'eM@HzA~ddxUP',
            'gC`HALiKT@RHDRj@',
            'eM@HzA~d`xUP',
            'gC`HALiMT@RHDRj@'
        ])
    });
});

'use strict';


var OCLE = require('../..');


describe('toVisualizerMolfile on propane', () => {
    test('should yield the right molfile', () => {
        var molecule=OCLE.Molecule.fromSmiles('CCC');
        var molfile=molecule.toVisualizerMolfile({diastereotopic: true});

        molfile._atoms.should.eql({ 'eM@Df`Xb`RP\\Jh': [ 0, 2 ], 'eM@HzAbJC}IApj`': [ 1 ] });
        molfile._highlight.should.eql( [ 'eM@Df`Xb`RP\\Jh', 'eM@HzAbJC}IApj`' ])
    });

    test('should yield the right molfile with ID on the heavy atom', () => {
        var molecule=OCLE.Molecule.fromSmiles('CCC');
        var molfile=molecule.toVisualizerMolfile({
            heavyAtomHydrogen: true,
            diastereotopic: true
        });
        molfile._atoms.should.eql({
            'eM@Df`Xb`RP\\Jh': [ 0, 2 ],
            'gC`HALiKT@RHDRj@': [ 0, 2 ],
            'eM@HzAbJC}IApj`': [ 1 ],
            'gC`HALiMT@RHDRj@': [ 1 ]
        });
        molfile._highlight.should.eql( [
            'eM@Df`Xb`RP\\Jh',
            'gC`HALiKT@RHDRj@',
            'eM@HzAbJC}IApj`',
            'gC`HALiMT@RHDRj@'
        ])
    });
});

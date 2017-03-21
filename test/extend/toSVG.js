'use strict';

var OCLE = require('../..');

describe('toSVG test', function () {
    it('check chlorobenzene', function () {
        let molecule = OCLE.Molecule.fromSmiles('c1ccccc1Cl');
        let svg = molecule.toSVG(200, 200);
        svg.indexOf('stroke-width:1').should.be.above(0);
        svg.indexOf('Cl').should.be.above(0);
        svg.indexOf('font-weight="bold"').should.be.equal(-1);

        svg = molecule.toSVG(200, 200, null, {
            strokeWidth: 2,
            bold: true
        });
        svg.indexOf('stroke-width:2').should.be.above(0);
        svg.indexOf('Cl').should.be.above(0);
        svg.indexOf('font-weight="bold"').should.be.above(0);
    });
});

'use strict';


var OCLE = require('../..');


describe('toSVG test', function () {
    it('check benzene', function () {
        var molecule=OCLE.Molecule.fromSmiles('c1ccccc1Cl');
        var svg=molecule.toSVG(200, 200);
        svg.indexOf('stroke-width:2').should.be.above(0);
        svg.indexOf('Cl').should.be.above(0);
        svg.indexOf('font-weight="bold"').should.be.above(0);
    });

    

});

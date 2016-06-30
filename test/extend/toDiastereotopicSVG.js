'use strict';


var OCLE = require('../..');


describe('toDiastereotopicSVG on propane', function () {
    var molecule=OCLE.Molecule.fromSmiles('CCC');
    var svg=molecule.toDiastereotopicSVG();
    
    it('check that is contains the diastereotopicID', function () {
        svg.indexOf('data-atomid="eMBBYchGzRCaU@"').should.equal(730);
    });
});

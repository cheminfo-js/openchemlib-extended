'use strict';


var OCLE = require('../..');


describe('getCouplings test propane', function () {
    it('should yield the right table without atom filtering', function () {
        var molecule=OCLE.Molecule.fromSmiles('CCC');
        var diaIDs=molecule.getDiastereotopicHoseCodes();
        diaIDs.length.should.equal(3);
        diaIDs[0].oclID.should.equal('eM@HzA~ddxUP' );
        diaIDs[0].hoses.length.should.equal(2);
        var couplings = molecule.getCouplings();
    });
});

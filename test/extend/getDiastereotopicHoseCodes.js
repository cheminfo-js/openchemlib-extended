'use strict';


var OCLE = require('../..');


describe('getDiastereotopicHoseCodes test propane', function () {
    it('should yield the right table without atom filtering', function () {
        var molecule=OCLE.Molecule.fromSmiles('CCC');

        var diaIDs=molecule.getDiastereotopicHoseCodes();
        diaIDs.length.should.equal(3);
        diaIDs[0].oclID.should.equal('eMBBYRZA~d`xUP' );
        diaIDs[0].hoses.length.should.equal(3);
    });

   
});

'use strict';


var OCLE = require('../..');


describe('getCouplings test propane', () => {
    test('should yield the right table without atom filtering', () => {
        var molecule=OCLE.Molecule.fromSmiles('CCC');
        var diaIDs=molecule.getDiastereotopicHoseCodes();
        diaIDs.length.should.equal(3);
        diaIDs[0].oclID.should.equal('eM@Df`Xb`RP\\Jh' );
        diaIDs[0].hoses.length.should.equal(3);
    });
});

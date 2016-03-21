'use strict';


var OCLE = require('../..');


describe('getGroupedHOSECodes test propane', function () {
    var molecule=OCLE.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();
    var diaIDs=molecule.getGroupedHOSECodes();

    it('should yield the right table', function () {
        diaIDs.length.should.equal(4);
        diaIDs[0].counter.should.equal(2);
        diaIDs[0].atom.length.should.equal(2);
        diaIDs[0].oclID.should.equal('eMBBYRZADERP\\Jh' );
        diaIDs[0].hoses.length.should.equal(3);
    });
});

'use strict';


var OCLE = require('../..');


describe('getGroupedHOSECodes test propane', function () {
    it('should yield the right table without atom filtering', function () {
        var molecule=OCLE.Molecule.fromSmiles('CCC');
        molecule.addImplicitHydrogens();
        var diaIDs=molecule.getGroupedHOSECodes();
        diaIDs.length.should.equal(4);
        diaIDs[0].counter.should.equal(2);
        diaIDs[0].atoms.length.should.equal(2);
        diaIDs[0].oclID.should.equal('eM@Df`Xb`RP\\Jh' );
        diaIDs[0].hoses.length.should.equal(3);
    });

    it('should yield the right table only C', function () {
        var molecule=OCLE.Molecule.fromSmiles('CCC');
        molecule.addImplicitHydrogens();
        var diaIDs=molecule.getGroupedHOSECodes({
            atomLabel: 'C'
        });
        diaIDs.length.should.equal(2);
        diaIDs[0].counter.should.equal(2);
        diaIDs[0].atoms.length.should.equal(2);
        diaIDs[0].oclID.should.equal('eM@Df`Xb`RP\\Jh');
        diaIDs[0].hoses.length.should.equal(3);
    });

    it('should yield the right table only H', function () {
        var molecule=OCLE.Molecule.fromSmiles('CCC');
        molecule.addImplicitHydrogens();
        var diaIDs=molecule.getGroupedHOSECodes({
            atomLabel: 'H'
        });
        diaIDs.length.should.equal(2);
        diaIDs[0].counter.should.equal(6);
        diaIDs[0].atoms.length.should.equal(6);
        diaIDs[0].oclID.should.equal('gC`HALiKT@\u007FRHDRj@');
        diaIDs[0].hoses.length.should.equal(4);
    });
});

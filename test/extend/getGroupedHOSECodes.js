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
        diaIDs[0].oclID.should.equal('eMBBYRZA~d`xUP' );
        diaIDs[0].hoses.length.should.equal(3);
    });

    it('should yield the right table only C', function () {
        var molecule=OCLE.Molecule.fromSmiles('CCC');
        molecule.addImplicitHydro
        var diaIDs=molecule.getGroupedHOSECodes({
            atomLable: 'C'
        });
        diaIDs.length.should.equal(2);
        diaIDs[0].counter.should.equal(2);
        diaIDs[0].atoms.length.should.equal(2);
        diaIDs[0].oclID.should.equal('eMBBYRZA~d`xUP');
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
        diaIDs[0].oclID.should.equal('gC`HALiKT@'+String.fromCharCode(127)+'RHDRj@');
        diaIDs[0].hoses.length.should.equal(4);
    });
});

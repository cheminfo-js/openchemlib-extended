'use strict';


var OCLE = require('../..');


describe('getGroupedDiastereotopicIDs test propane', function () {
    it('should yield the right table for all atoms', function () {
        var molecule=OCLE.Molecule.fromSmiles('CCC');
        molecule.addImplicitHydrogens();
        var diaIDs=molecule.getGroupedDiastereotopicAtomIDs();
        diaIDs.length.should.equal(4);
        diaIDs[0].counter.should.equal(2);
        diaIDs[0].atoms.length.should.equal(2);
        diaIDs[0].oclID.should.equal('eM@HzA~ddxUP' );
    });

    it('should yield the right table for carbons', function () {
        var molecule=OCLE.Molecule.fromSmiles('CCC');
        molecule.addImplicitHydrogens();
        var diaIDs=molecule.getGroupedDiastereotopicAtomIDs({
            atomLabel: 'C'
        });
        diaIDs.length.should.equal(2);
        diaIDs[0].counter.should.equal(2);
        diaIDs[0].atoms.length.should.equal(2);
        diaIDs[0].oclID.should.equal('eM@HzA~ddxUP' );
    });

    it('should yield the right table for hydrogens', function () {
        var molecule=OCLE.Molecule.fromSmiles('CCC');
        molecule.addImplicitHydrogens();
        var diaIDs=molecule.getGroupedDiastereotopicAtomIDs({
            atomLabel: 'H'
        });
        diaIDs.length.should.equal(2);
        diaIDs[0].counter.should.equal(6);
        diaIDs[0].atoms.length.should.equal(6);
        diaIDs[0].oclID.should.equal('gC`HALiKT@\u007FRHDRj@');
    });
});

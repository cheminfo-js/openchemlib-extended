'use strict';


var OCLE = require('../..');


describe('getGroupedDiastereotopicIDs test propane', () => {
    test('should yield the right table for all atoms', () => {
        var molecule=OCLE.Molecule.fromSmiles('CCC');
        molecule.addImplicitHydrogens();
        var diaIDs=molecule.getGroupedDiastereotopicAtomIDs();
        diaIDs.length.should.equal(4);
        diaIDs[0].counter.should.equal(2);
        diaIDs[0].atoms.length.should.equal(2);
        diaIDs[0].oclID.should.equal('eM@Df`Xb`RP\\Jh' );
    });

    test('should yield the right table for carbons', () => {
        var molecule=OCLE.Molecule.fromSmiles('CCC');
        molecule.addImplicitHydrogens();
        var diaIDs=molecule.getGroupedDiastereotopicAtomIDs({
            atomLabel: 'C'
        });
        diaIDs.length.should.equal(2);
        diaIDs[0].counter.should.equal(2);
        diaIDs[0].atoms.length.should.equal(2);
        diaIDs[0].oclID.should.equal('eM@Df`Xb`RP\\Jh' );
    });

    test('should yield the right table for hydrogens', () => {
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

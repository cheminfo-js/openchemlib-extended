'use strict';


var OCLE = require('../..');


describe('getGroupedDiastereotopicIDs test toluene', function () {
    var molecule=OCLE.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();
    var diaIDs=molecule.getGroupedDiastereotopicAtomIDs();

    it('should yield the right table', function () {
        diaIDs.length.should.equal(4);
        diaIDs[0].counter.should.equal(2);
        diaIDs[0].atom.length.should.equal(2);
        diaIDs[0].oclID.should.equal('eMBBYRZADERP\\Jh' );
    });
});

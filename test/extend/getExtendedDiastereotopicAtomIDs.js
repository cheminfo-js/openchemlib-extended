'use strict';


var OCLE = require('../..');


describe('getExtendedDiastereotopicIDs test propane', function () {

    it('should yield the right table - propane', function () {
        var molecule=OCLE.Molecule.fromSmiles('CCC');
        var diaIDs=molecule.getExtendedDiastereotopicAtomIDs();
        
        diaIDs.length.should.equal(11);
        diaIDs[0].nbHydrogens.should.equal(3);
        diaIDs[0].hydrogenOCLIDs.length.should.equal(1);
        diaIDs[0].hydrogenOCLIDs[0].should.equal('gC`HALiKT@RHDRj@');
    });
    
});

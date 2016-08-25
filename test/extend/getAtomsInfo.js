'use strict';


var OCLE = require('../..');


describe.only('getAtomsInfo test propane', function () {
    it('should yield the right table', function () {
        var molecule=OCLE.Molecule.fromSmiles('C=CC');
        // molecule.addImplicitHydrogens();
        var atoms=molecule.getAtomsInfo();

        console.log(atoms);
    });

});

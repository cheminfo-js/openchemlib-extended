'use strict';


var OCLE = require('../..');


describe.only('getCouplings test propane', function () {
    it('should yield the right table without atom filtering', function () {
        var molecule=OCLE.Molecule.fromSmiles('CCC');
        var couplings = molecule.getCouplings();
        console.log(couplings);
    });
});

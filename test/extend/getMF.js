'use strict';


var OCLE = require('../..');


describe.only('getMF test', function () {
    it('should yield the right result', function () {
        var molecule=OCLE.Molecule.fromSmiles('OCC(N)CCl.[CH2+][2H');

        var mf=molecule.getMF();

        console.log(mf);

    });
});

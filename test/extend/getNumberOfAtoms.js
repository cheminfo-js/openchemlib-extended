'use strict';


var OCLE = require('../..');


describe('getNumberOfAtoms test 1-chloropropane', function () {

    it('check 1-chloropropane', function () {
        var molecule=OCLE.Molecule.fromSmiles('CCCCl');
        molecule.getNumberOfAtoms('H').should.equal(7);
        molecule.getNumberOfAtoms('Cl').should.equal(1);
        molecule.getNumberOfAtoms('Br').should.equal(0);
    });
});

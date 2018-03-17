'use strict';


var OCLE = require('../..');


describe('getNumberOfAtoms test 1-chloropropane', () => {

    test('check 1-chloropropane', () => {
        var molecule=OCLE.Molecule.fromSmiles('CCCCl');
        molecule.getNumberOfAtoms({atomLabel:'H'}).should.equal(7);
        molecule.getNumberOfAtoms({atomLabel:'Cl'}).should.equal(1);
        molecule.getNumberOfAtoms({atomLabel:'Br'}).should.equal(0);
    });
});

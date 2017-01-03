'use strict';


var OCLE = require('../..');


describe('getMF test', function () {
    it('check benzene', function () {
        var molecule=OCLE.Molecule.fromSmiles('c1ccccc1');
        var result=molecule.getMF();
        result.mf.should.equal('C6H6');
        result.parts.length.should.equal(1);
        result.parts[0].should.equal('C6H6');
    });
    it('check glycine', function () {
        var molecule=OCLE.Molecule.fromSmiles('[NH3+]CC(=O)[O-]');
        var result=molecule.getMF();
        result.mf.should.equal('C2H5NO2');
        result.parts.length.should.equal(1);
        result.parts[0].should.equal('C2H5NO2');

    });
    it('check isotope of pentane', function () {
        var molecule=OCLE.Molecule.fromSmiles('CC[13CH2]CC([2H])([2H])([2H])');
        var result=molecule.getMF();
        result.mf.should.equal('C4H9[13C][2H]3');
        result.parts.length.should.equal(1);
        result.parts[0].should.equal('C4H9[13C][2H]3');

    });
    it('check multipart', function () {
        var molecule=OCLE.Molecule.fromSmiles('OCC(N)CCl.[CH2+][2H]');
        var result=molecule.getMF();
        result.mf.should.equal('C4H10ClNO[2H](+)');
        result.parts.length.should.equal(2);
        result.parts[0].should.equal('C3H8ClNO');
        result.parts[1].should.equal('CH2[2H](+)');

    });
    it('check multihydrate', function () {
        var molecule=OCLE.Molecule.fromSmiles('[ClH].O.O.O.O');

        var result=molecule.getMF();
        result.mf.should.equal('H9ClO4');
        result.parts.length.should.equal(2);
        result.parts[0].should.equal('4H2O');
        result.parts[1].should.equal('HCl');
    });

    it('check Li+ OH-', function () {
        var molecule=OCLE.Molecule.fromIDCode('eDJRpCjP@');
        var result=molecule.getMF();
        result.mf.should.equal('HLiO');
        result.parts.length.should.equal(2);
        result.parts[0].should.equal('HO(-)');
        result.parts[1].should.equal('Li(+)');
    });

    it('check O--', function () {
        var molecule=OCLE.Molecule.fromSmiles('[O--]');
        var result=molecule.getMF();
        result.mf.should.equal('O(-2)');
        result.parts.length.should.equal(1);
        result.parts[0].should.equal('O(-2)');
    });
    

});

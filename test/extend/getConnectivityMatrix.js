'use strict';


var OCLE = require('../..');


describe('getConnectivityMatrix test propane', function () {
    it('propane with expanded hydrogens', function () {
        var molecule=OCLE.Molecule.fromSmiles('CCC');
        molecule.addImplicitHydrogens();
        
        var connectivityMatrix=molecule.getConnectivityMatrix();
        connectivityMatrix.should.be.eql(
            [
                [ 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0 ],
                [ 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0 ],
                [ 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1 ],
                [ 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ],
                [ 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 ],
                [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 ],
                [ 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0 ],
                [ 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0 ],
                [ 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0 ],
                [ 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0 ],
                [ 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1 ]
            ]

        );
    });

    it('benzene', function () {
        var molecule=OCLE.Molecule.fromSmiles('c1ccccc1');
        var connectivityMatrix=molecule.getConnectivityMatrix();
        connectivityMatrix.should.be.eql(
            [
                [ 1, 1, 0, 0, 0, 1 ],
                [ 1, 1, 1, 0, 0, 0 ],
                [ 0, 1, 1, 1, 0, 0 ],
                [ 0, 0, 1, 1, 1, 0 ],
                [ 0, 0, 0, 1, 1, 1 ],
                [ 1, 0, 0, 0, 1, 1 ]
            ]
        );
    });

    it('benzene with single, double, triple', function () {
        var molecule=OCLE.Molecule.fromSmiles('c1ccccc1');
        var connectivityMatrix=molecule.getConnectivityMatrix({
            sdt: true
        });
        connectivityMatrix.should.be.eql(
            [
                [ 1, 2, 0, 0, 0, 1 ],
                [ 2, 1, 1, 0, 0, 0 ],
                [ 0, 1, 1, 2, 0, 0 ],
                [ 0, 0, 2, 1, 1, 0 ],
                [ 0, 0, 0, 1, 1, 2 ],
                [ 1, 0, 0, 0, 2, 1 ]
            ]
        );
    });

    it('benzene with mass diagonal', function () {
        var molecule=OCLE.Molecule.fromSmiles('c1ccccc1');
        var connectivityMatrix=molecule.getConnectivityMatrix({
            mass: true
        });
        connectivityMatrix.should.be.eql(
            [
                [12, 1, 0, 0, 0, 1 ],
                [ 1,12, 1, 0, 0, 0 ],
                [ 0, 1,12, 1, 0, 0 ],
                [ 0, 0, 1,12, 1, 0 ],
                [ 0, 0, 0, 1,12, 1 ],
                [ 1, 0, 0, 0, 1,12 ]
            ]
        );
    });

    it('benzene with atomic number on diagonal', function () {
        var molecule=OCLE.Molecule.fromSmiles('c1ccccc1');
        var connectivityMatrix=molecule.getConnectivityMatrix({
            atomicNo: true
        });
        connectivityMatrix.should.be.eql(
            [
                [ 6, 1, 0, 0, 0, 1 ],
                [ 1, 6, 1, 0, 0, 0 ],
                [ 0, 1, 6, 1, 0, 0 ],
                [ 0, 0, 1, 6, 1, 0 ],
                [ 0, 0, 0, 1, 6, 1 ],
                [ 1, 0, 0, 0, 1, 6 ]
            ]
        );
    });

});

'use strict';


var OCLE = require('../..');


describe('getConnectivityMatrix test propane', () => {
    test('propane with expanded hydrogens', () => {
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

    test('benzene', () => {
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

    test('benzene with single, double, triple', () => {
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

    test('benzene with mass diagonal', () => {
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

    test('benzene with atomic number on diagonal', () => {
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

    test('benzene pathLength matrix', () => {
        var molecule=OCLE.Molecule.fromSmiles('c1ccccc1');
        var connectivityMatrix=molecule.getConnectivityMatrix({pathLength: true});
        connectivityMatrix.should.be.eql(
            [
                [ 0, 1, 2, 3, 2, 1 ],
                [ 1, 0, 1, 2, 3, 2 ],
                [ 2, 1, 0, 1, 2, 3 ],
                [ 3, 2, 1, 0, 1, 2 ],
                [ 2, 3, 2, 1, 0, 1 ],
                [ 1, 2, 3, 2, 1, 0 ]
            ]
        );
    });
});
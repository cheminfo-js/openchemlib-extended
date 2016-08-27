'use strict';


var OCLE = require('../..');


describe('getConnectivityMatrix test propane', function () {
    it('should yield the right result', function () {
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
});

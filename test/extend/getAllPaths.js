'use strict';


var OCLE = require('../..');


describe.only('getAllPaths test propane', function () {
    it('should yield the right result', function () {
        var molecule=OCLE.Molecule.fromSmiles('CCC');
        molecule.addImplicitHydrogens();
        
        var paths=molecule.getAllPaths({
            fromLabel: 'C',
            toLabel: 'H',
            minLength: 1,
            maxLength: 2
        });
        
        console.log(paths);
    });

});

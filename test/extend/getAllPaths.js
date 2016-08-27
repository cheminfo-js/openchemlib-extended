'use strict';


var OCLE = require('../..');


describe.only('getAllPaths test propane', function () {
    it('should yield the right result', function () {
        var molecule=OCLE.Molecule.fromSmiles('CCC');
        var paths=molecule.getAllPaths('H','C',0,2);


        console.log(paths);
    });

});

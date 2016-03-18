'use strict';


var OCLE = require('../..');


describe('getGroupedDiastereotopicIDs test toluene', function () {
    var molecule=OCLE.Molecule.fromSmiles('c1ccccc1C');
    molecule.addImplicitHydrogens();
    var diaIDs=molecule.getGroupedDiastereotopicIDs({});

    console.log(diaIDs);

    it('should yield the right table', function () {

    });

});

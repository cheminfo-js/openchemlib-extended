'use strict';


var OCLE = require('../..');


describe('getAllPaths test propane', function () {
    it('min:1, max:2', function () {
        var molecule=OCLE.Molecule.fromSmiles('CCC');
        molecule.addImplicitHydrogens();
        
        var paths=molecule.getAllPaths({
            fromLabel: 'C',
            toLabel: 'H',
            minLength: 1,
            maxLength: 2
        });
        
        paths.should.eql([ { fromDiaID: 'eMBBYRZA~d`xUP',
            toDiaID: 'gC`HALiKT@RHDRj@',
            fromAtoms: [ 0, 2 ],
            toAtoms: [ 3, 4, 5, 8, 9, 10 ],
            fromLabel: 'C',
            toLabel: 'H',
            pathLength: 1 },
            { fromDiaID: 'eMBBYRZA~d`xUP',
                toDiaID: 'gC`HALiMT@RHDRj@',
                fromAtoms: [ 0, 2 ],
                toAtoms: [ 6, 7 ],
                fromLabel: 'C',
                toLabel: 'H',
                pathLength: 2 },
            { fromDiaID: 'eMBBYchGzRCaU@',
                toDiaID: 'gC`HALiKT@RHDRj@',
                fromAtoms: [ 1 ],
                toAtoms: [ 3, 4, 5, 8, 9, 10 ],
                fromLabel: 'C',
                toLabel: 'H',
                pathLength: 2 },
            { fromDiaID: 'eMBBYchGzRCaU@',
                toDiaID: 'gC`HALiMT@RHDRj@',
                fromAtoms: [ 1 ],
                toAtoms: [ 6, 7 ],
                fromLabel: 'C',
                toLabel: 'H',
                pathLength: 1 } ]
        );
    });
    
    it('min:2, max:2', function () {
        var molecule = OCLE.Molecule.fromSmiles('CCC');
        molecule.addImplicitHydrogens();

        var paths = molecule.getAllPaths({
            fromLabel: 'C',
            toLabel: 'H',
            minLength: 2,
            maxLength: 2
        });
        paths[1].toAtoms.should.eql([3,4,5,8,9,10]);
    });
});

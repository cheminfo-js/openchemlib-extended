'use strict';


var OCLE = require('../..');


describe('getAtomsInfo test propane', function () {
    it('should yield the right table', function () {
        var molecule=OCLE.Molecule.fromSmiles('C=CC');
        // molecule.addImplicitHydrogens();
        var atoms=molecule.getAtomsInfo();

        atoms[2].should.eql({ oclID: 'eMBBYRYA~d`xUP',
            extra:
            { singleBonds: 4,
                doubleBonds: 0,
                tripleBonds: 0,
                aromaticBonds: 0,
                cnoHybridation: 3,
                totalBonds: 4 },
            abnormalValence: -1,
            charge: 0,
            cipParity: 0,
            color: 0,
            customLabel: null,
            atomicNo: 6,
            label: 'C',
            mass: 0,
            radical: 0,
            ringBondCount: 0,
            ringSize: 0,
            x: 0,
            y: 0.5,
            z: 0,
            allHydrogens: 3,
            connAtoms: 1,
            allConnAtoms: 1,
            isAromatic: false,
            isAllylic: true,
            isStereoCenter: false,
            isRing: false,
            isSmallRing: false,
            isStabilized: false } 
        );
        
        // console.log(atoms);
    });

});

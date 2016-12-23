'use strict';

/**
 * Calculate the molecular formula in 'chemcalc' notation taking into account fragments, isotopes and charges
 * @returns {String}
 */

module.exports = function getMF() {
    var entries=this.getFragments();
    var result={};
    var parts=[];
    var allAtoms=[];
    entries.forEach( function(entry) {
        var mf=getFragmentMF(entry);
        parts.push(mf);
    });
    // need to join the entries if they have the same molecular formula
    parts.sort();
    
    result.parts=parts;
    result.mf=getMF(allAtoms);
    return result;

    function getFragmentMF(molecule) {
        var atoms=[];
        for (var i=0; i<molecule.getAllAtoms(); i++) {
            var atom={};
            atom.charge=molecule.getAtomCharge(i);
            atom.label=molecule.getAtomLabel(i);
            atom.mass=molecule.getAtomMass(i);
            atom.implicitHydrogens=molecule.getImplicitHydrogens(i);
            atoms.push(atom);
            allAtoms.push(atom);
        }
        return getMF(atoms);
    }


    function getMF(atoms) {
        var charge=0;
        var mfs={};
        for (var atom of atoms) {
            var label=atom.label;
            charge+=atom.charge;
            if (atom.mass) {
                label='['+atom.mass+label+']';
            }
            var mfAtom=mfs[label];
            if (!mfAtom) {
                mfs[label]=0;
            }
            mfs[label]+=1;
            if (atom.implicitHydrogens) {
                if (! mfs.H) mfs.H=0;
                mfs.H+=atom.implicitHydrogens;
            }
        }


        var mf="";
        var keys=Object.keys(mfs).sort(function(a,b) {
            if (a==="C") return -1;
            if (a==="H" && b!=="C") return -1;
            if (a<b) return -1;
            return 1;
        });
        for (var key of keys) {
            mf+=key;
            if (mfs[key]>1) mf+=mfs[key];
        }

        if (charge>0) {
            mf+='(+'+charge+')';
        } else if (charge<0) {
            mf+='('+charge+')';
        }
        return mf;
    }

};
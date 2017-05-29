'use strict';

// class CouplingPredictor {

function CouplingPredictor(molecule, dia3h, matchFragments, fragmentsId) {
    this.molecule = molecule;
    this.dia3h = dia3h;
    this.matchFragments = matchFragments;
    this.fragmentsId = fragmentsId;
}

module.exports = function getAllCouplings(OCL) {
    var molecule = this.getCompactCopy();
    var diaIDs = molecule.getDiastereotopicAtomIDs();
    var matchFragments = molecule.getFragments();
    var couplings = [];
    for (let i = 0; i < molecule.getAllAtoms(); i++) {
        if (molecule.getAtomLabel(i) === 'H') {
            for (let j = i + 1; j < molecule.getAllAtoms(); j++) {
                if (molecule.getAtomLabel(j) === 'H') {
                    if (!isAttachedToHeteroAtom(i) && !isAttachedToHeteroAtom(j)) {
                        if (!(diaIDs[i].toLowerCase() === diaIDs[j].toLowerCase())) {
                            var atoms = [];
                            var xyz = []; //TODO
                            getPath(i, i, j, 0, atoms, xyz);

                            if (atoms.length !== 0) {
                                var fragmentId = -1;
                                var couple = new Coupling();
                                couple.setAtoms(atoms);
                                couple.setXYZ(xyz);
                                couple.setFromDiaID(diaIDs[j]);
                                couple.setToDiaID(diaIDs[i]);
                                if (matchFragments !== null) {
                                    fragmentId = couplingBelongToFragment(atoms, matchFragments);
                                    couple.setFragmentId(fragmentId);
                                }

                                if (calculatedCoupling(couple)) {
                                    couplings.add(couple);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return couplings;
};

function getPath(molecule, parent, idInit, idEnd, pathLength, atoms, xyz) {
    if (pathLength > 3) {
        return;
    }
    var nbConnectedAtoms = molecule.getAllConnAtoms(idInit);
    for (let i = 0; i < nbConnectedAtoms; i++) {
        if (molecule.getConnAtom(idInit, i) === idEnd) {
            var coordinates = new Array(3);
            coordinates[0] = molecule.getAtomX(idEnd);
            coordinates[1] = molecule.getAtomY(idEnd);
            coordinates[2] = molecule.getAtomZ(idEnd);
            atoms.push(idEnd);
            xyz.push(coordinates);

            coordinates = new Array(3);
            coordinates[0] = molecule.getAtomX(idInit);
            coordinates[1] = molecule.getAtomY(idInit);
            coordinates[2] = molecule.getAtomZ(idInit);
            atoms.push(idInit);
            xyz.push(coordinates);
            pathLength++;
            return;
        }
    }

    pathLength++;

    for (let i = 0; i < nbConnectedAtoms; i++) {
        var connectivityAtom = molecule.getConnAtom(idInit, i);
        if (connectivityAtom !== parent) {
            getPath(idInit, connectivityAtom, idEnd, pathLength, atoms, xyz);
            if (atoms.length !== 0) {
                coordinates = new Array(3);
                coordinates[0] = molecule.getAtomX(idInit);
                coordinates[1] = molecule.getAtomY(idInit);
                coordinates[2] = molecule.getAtomZ(idInit);
                atoms.push(idInit);
                xyz.push(coordinates);
                break;
            }
        }
    }
};

function couplingBelongToFragment(atoms, matchFragments) {
    var match;
    var index = atoms.length - 1;
    for (let i = 0; i < matchFragments.length; i++) {
        match = 0;
        for (let j = 0; j < matchFragments.get(i).length; j++) {
            for (let k = 1; k < index; k++) {
                if (matchFragments.get(i)[j] === (atoms.get(k))) {
                    match++;
                }
            }
        }

        if (match === atoms.length - 2) {
            return i;
        }
    }
    return -1;
}

function calculatedCoupling(couple) {
    var bondLength = couple.getAtoms().length - 1;

    if (couple.getFragmentId() !== -1) {

        couple.setType(0);
        // int index;
        var C1 = -1;
        var C2 = -1;
        var couplings = Fragments.fragments3.optJSObject(fragmentsId.get(couple.getFragmentId()), null); //TODO
        // index =
        // Fragments.allFragments.indexOf(fragmentsId.get(couple.getFragmentId()));

        for (var i = 0; i < matchFragments.get(couple.getFragmentId()).length; i++) {

            if (couple.getAtoms().get(1) === matchFragments.get(couple.getFragmentId())[i]) {
                C1 = i;
            }
            if (couple.getAtoms()
                    .get(couple.getAtoms().size() - 2) === matchFragments.get(couple.getFragmentId())[i]) {
                C2 = i;
            }
        }
        if (C1 > C2) {
            C1 = C1 + C2;
            C2 = C1 - C2;
            C1 = C1 - C2;
        }
        if (couplings !== null) {
            couple.setCoupling(couplings.optDouble(C1 + '-' + C2, -1));
        }

        return true;
    }

    switch (bondLength) {
        case 2:
            if (molecule.getAllConnAtoms(couple.getAtoms().get(1)) < 4) {
                couple.setType(1); // geminal coupling of alkene
                couple.setCoupling(geminalCoupling());
            } else {
                couple.setCoupling(16); // generic coupling between geminal
                                        // hydrogens
            }
            break;
        case 3: {

            if (isDoubleBond(couple.getAtoms().get(1), couple.getAtoms().get(2))) { // coupling
                // through
                // double
                // bond
                // It have to be plain
                couple.setType(2);
                var angle;
                var coords = new Matrix(4, 3);
                for (let i = 0; i < couple.getXYZ().length; i++) {
                    for (let j = 0; j < 3; j++) {
                        coords[i][j] = couple.getXYZ().get(i)[j];
                    }
                }

                angle = getDihedralAngle(coords);
                // System.out.println(angle+" "+(couple.getAtoms().get(0)+1)+"
                // "+(couple.getAtoms().get(3)+1));
                if (angle > 60) {
                    couple.setType(22);
                    couple.setCoupling(doubleBondCoupling(2, couple.getAtoms()));
                } else {
                    couple.setType(21);
                    couple.setCoupling(doubleBondCoupling(1, couple.getAtoms()));
                }
            } else {
                var angle = 0.0;
                var coords = new Matrix(couple.getXYZ().size(), 3);
                var sumZ = 0;
                for (let i = 0; i < couple.getXYZ().size(); i++) {
                    for (let j = 0; j < 3; j++) {
                        coords[i][j] = couple.getXYZ().get(i)[j];
                    }
                    sumZ += Math.abs(coords[i][2]);
                }
                if (sumZ === 0 && !isDoubleOrTripleBond(couple.getAtoms().get(1), couple.getAtoms().get(2))) {// If
                    // it
                    // is
                    // single
                    // and
                    // no
                    // Z
                    // coordinate
                    angle = 60;
                } else {
                    angle = getDihedralAngle(coords);
                }
                // System.out.println(angle+" "+(couple.getAtoms().get(0)+1)+"
                // "+(couple.getAtoms().get(3)+1));
                // vynilcoupling
                if (true === checkVynilicCoupling(couple.getAtoms())) {
                    couple.setType(3);
                    couple.setCoupling(vinylCoupling(angle));
                } else {
                    couple.setType(4);
                    // vicinal coupling
                    couple.setCoupling(jCouplingVicinal(angle, 1, couple.getAtoms()));
                }
            }
            break;
        }
        case 4: {// allylic Coupling
            couple.setType(5);
            //double[][] coords = new double[couple.getXYZ().size() - 1][3];

            // System.out.println(couple.getAtoms().get(0)+"
            // "+couple.getAtoms().get(4));
            // System.out.println("Allylic"+isDoubleOrTripleBond(couple.getAtoms().get(1),
            // couple.getAtoms().get(2)));
            if (isDoubleOrTripleBond(couple.getAtoms().get(1), couple.getAtoms().get(2))
                && isNotAromatic(couple.getAtoms().get(1), couple.getAtoms().get(2))) {
                couple.setCoupling(2);
                /*
                 * for(int k=1; k<couple.getXYZ().size(); k++) for(int j=0; j<3;
                 * j++){ coords[k-1][j] = couple.getXYZ().get(k-1)[j]; } double
                 * angle = getDihedralAngle(coords);
                 * //System.out.println(angle+" "+(couple.getAtoms().get(0)+1)
                 * +" "+(couple.getAtoms().get(3)+1));
                 * //System.out.println("coupling "+allylicCoupling(angle));
                 * couple.setCoupling(allylicCoupling(angle)); if(DEBUG)
                 * System.out.println("angle "+" - "+angle+" - "+couple.getAtoms
                 * ().get(1)+" - "+couple.getAtoms().get(2)+" - "+couple.
                 * getAtoms().get(3)+" - "+couple.getAtoms().get(4)); if(DEBUG)
                 * System.out.println("coupling "+allylicCoupling(angle));
                 */
            } else if (isDoubleOrTripleBond(couple.getAtoms().get(2), couple.getAtoms().get(3))
                && isNotAromatic(couple.getAtoms().get(2), couple.getAtoms().get(3))) {
                couple.setCoupling(2);
                /*
                 * for(int k=0; k<couple.getXYZ().size()-1; k++) for(int j=0;
                 * j<3; j++) coords[k][j] = couple.getXYZ().get(k)[j]; double
                 * angle = getDihedralAngle(coords);
                 * //System.out.println(angle+" "+(couple.getAtoms().get(0)+1)
                 * +" "+(couple.getAtoms().get(3)+1));
                 * //System.out.println("angle "+angle);
                 * //System.out.println("coupling "+vynilCoupling(angle));
                 * couple.setCoupling(allylicCoupling(angle)); if(DEBUG)
                 * System.out.println("angle "+" - "+angle+" - "+couple.getAtoms
                 * ().get(0)+" - "+couple.getAtoms().get(1)+" - "+couple.
                 * getAtoms().get(2)+" - "+couple.getAtoms().get(3)); if(DEBUG)
                 * System.out.println("coupling "+allylicCoupling(angle));
                 */
            } else if (isAromatic(couple.getAtoms().get(1), couple.getAtoms().get(2))
                && isAromatic(couple.getAtoms().get(2), couple.getAtoms().get(3))) {
                couple.setCoupling(2);
                /*
                 * for(int k=0; k<couple.getXYZ().size()-1; k++) for(int j=0;
                 * j<3; j++) coords[k][j] = couple.getXYZ().get(k)[j]; double
                 * angle = getDihedralAngle(coords);
                 *
                 * //System.out.println(angle+" "+(couple.getAtoms().get(0)+1)
                 * +" "+(couple.getAtoms().get(3)+1));
                 * //System.out.println("coupling "+vynilCoupling(angle));
                 * couple.setCoupling(allylicCoupling(angle)); if(DEBUG)
                 * System.out.println("angle "+" - "+angle+" - "+couple.getAtoms
                 * ().get(0)+" - "+couple.getAtoms().get(1)+" - "+couple.
                 * getAtoms().get(2)+" - "+couple.getAtoms().get(3)); if(DEBUG)
                 * System.out.println("coupling "+allylicCoupling(angle));
                 */
            } else {
                if ((isAromatic(couple.getAtoms().get(1), couple.getAtoms().get(2))
                    && !isAromatic(couple.getAtoms().get(2), couple.getAtoms().get(3)))) {
                    if (isOnlyAttachedToHC(couple.getAtoms().get(3))) {
                        couple.setCoupling(1.5);
                        return true;
                    }
                } else {
                    if (!isAromatic(couple.getAtoms().get(1), couple.getAtoms().get(2))
                        && isAromatic(couple.getAtoms().get(2), couple.getAtoms().get(3))) {
                        if (isOnlyAttachedToHC(couple.getAtoms().get(1))) {
                            couple.setCoupling(1.5);
                            return true;
                        }
                    }
                }
                couple.setCoupling(0);
                return false;
            }
            break;
        }
        default:
            couple.setCoupling(7); // check default value
            break;
    }

    return true;

}

function getAngle(xyz) {
    // double sum=0;
    // Check if we have the Z coordinate
    // for (int i=0;i<xyz.length;i++)
    // sum+=Math.abs(xyz[i][2]);
    // if(sum==0)
    // return 60;
    var dotProduct = 0;
    var magnitudes = new Array(xyz.length);
    var mult;

    for (let i = 0; i < xyz[0].length; i++) {
        mult = 1;

        for (let j = 0; j < xyz.length; j++) {
            mult *= xyz[j][i];
            magnitudes[j] += xyz[j][i] * xyz[j][i];

        }
        dotProduct += mult;
    }
    // return Math.acos(dotProduct/(magnitudes[0]*magnitudes[1]));
    return Math.acos(dotProduct / (magnitudes[0] * magnitudes[1])) * 180 / Math.PI;
}

function getDihedralAngle(xyz) {
    /*
     * double sum=0; //Check if we have the Z coordinate for (int
     * i=0;i<xyz.length;i++) sum+=Math.abs(xyz[i][2]); if(sum==0) return 60;
     */
    var cosAng, P, Q;
    var distances = new Array(6);
    var Sdistances = new Array(6);
    var k = 0;

    for (let i = 0; i < xyz.length; i++) {
        for (let j = i + 1; j < xyz.length; j++) {
            Sdistances[k] = (xyz[i][0] - xyz[j][0]) * (xyz[i][0] - xyz[j][0])
                + (xyz[i][1] - xyz[j][1]) * (xyz[i][1] - xyz[j][1])
                + (xyz[i][2] - xyz[j][2]) * (xyz[i][2] - xyz[j][2]);
            distances[k] = Math.sqrt(Sdistances[k]);
            k++;
        }
    }


    P = Sdistances[0] * (Sdistances[3] + Sdistances[5] - Sdistances[4])
        + Sdistances[3] * (-Sdistances[3] + Sdistances[5] + Sdistances[4])
        + Sdistances[1] * (Sdistances[3] - Sdistances[5] + Sdistances[4]) - 2 * Sdistances[3] * Sdistances[2];

    Q = (distances[0] + distances[3] + distances[1]) * (distances[0] + distances[3] - distances[1])
        * (distances[0] - distances[3] + distances[1]) * (-distances[0] + distances[3] + distances[1])
        * (distances[3] + distances[5] + distances[4]) * (distances[3] + distances[5] - distances[4])
        * (distances[3] - distances[5] + distances[4]) * (-distances[3] + distances[5] + distances[4]);

    cosAng = P / Math.sqrt(Q);

    if (cosAng > 1 || cosAng < -1) {
        cosAng = 1;
    }

    return Math.acos(cosAng) * 180 / Math.PI;
}

function CouplingVicinal(dihedralAngle, model, atoms) {
    var J = 0.0;
    var delta;
    var nbConnectedAtoms;
    var electH = electronegativities['H'];
    var direction = new Array(4);
    [direction[0], direction[2]] = [1, 1];
    [direction[1], direction[3]] = [-1, -1];
    // String type;
    switch (model) {
        case 1: {
            // type = "karplus";

            let A = 7.76;
            let B = -1.10;
            let C = 1.40;
            J = A * Math.cos(dihedralAngle) * Math.cos(dihedralAngle) + B * Math.cos(dihedralAngle) + C;
            break;
        }

        case 2: {

            // type = "Karplus-altona";

            // double P1=13.88, P2=-0.81, P3=0;
            // double P4=0.56, P5=-2.32, P6=17.9;
            var P1 = 13.7, P2 = -0.73, P3 = 0;
            var P4 = 0.56, P5 = -2.47, P6 = 16.9;
            for (let j = 1; j < atoms.size() - 1; j++) {
                nbConnectedAtoms = molecule.getAllConnAtoms(j);
                for (let i = 0; i < nbConnectedAtoms; i++) {
                    delta = electronegativities[molecule.getAtomLabel(molecule.getConnAtom(j, i))]
                        - electH;
                    J += delta * (P4 + P5 * Math.cos(direction[j] * dihedralAngle + P6 * Math.abs(delta))
                        * Math.cos(direction[j] * dihedralAngle + P6 * Math.abs(delta)));
                }
            }
            // 3J = p1 cos2(f) + p2 cos(f) + p3 + S li (p4 + p5 cos2(ei f + p6
            // |li|))
            // li = (Ca -CH) + p7 S ( Cb -CH)
            J += P1 * Math.cos(dihedralAngle) * Math.cos(dihedralAngle) + P2 * Math.cos(dihedralAngle) + P3;
            break;

        }

        case 3: {
            // type = "Karplus-altona beta effect";
            var P1 = 13.7, P2 = -0.73, P3 = 0;
            var P4 = 0.56, P5 = -2.47, P6 = 16.9, P7 = -0.14;

            var I;
            var atom2;
            var nbConnectedAtoms2;

            for (let j = 1; j < atoms.size() - 1; j++) {
                nbConnectedAtoms = molecule.getAllConnAtoms(j);
                I = 0;
                for (let i = 0; i < nbConnectedAtoms; i++) {
                    atom2 = molecule.getConnAtom(j, i);
                    delta = electronegativities[molecule.getAtomLabel(atom2)] - electH;
                    atom2 = molecule.getConnAtom(j, i);
                    nbConnectedAtoms2 = molecule.getAllConnAtoms(atom2);
                    for (let k = 0; k < nbConnectedAtoms2; k++) {
                        // i = (Ca -CH) + p7 S ( Cb -CH)
                        I += electronegativities[molecule.getAtomLabel(molecule.getConnAtom(atom2, k))]
                            - electH;
                    }
                    I = delta + P7 * I;
                }

                // 3J = p1 cos2(f) + p2 cos(f) + p3 + S i (p4 + p5 cos2(ei f +
                // p6 |i|))
                J += I * (P4 + P5 * (Math.cos(direction[j] * dihedralAngle + P6 * Math.abs(I))
                    * Math.cos(direction[j] * dihedralAngle + P6 * Math.abs(I))));
            }
            J += P1 * Math.cos(dihedralAngle) * Math.cos(dihedralAngle) + P2 * Math.cos(dihedralAngle) + P3;
            break;
        }

    }
    return J;
}

function fourBondCoupling() {
    return 0;
}

function vinylCoupling(phi) {
    var J = 0.0;
    if (phi <= 90) {
        J = 6.6 * Math.cos(phi) * Math.cos(phi) + 2.6 * Math.sin(phi) * Math.sin(phi);
    } else {
        J = 11.6 * Math.cos(phi) * Math.cos(phi) + 2.6 * Math.sin(phi) * Math.sin(phi);
    }
    return J;
}

function allylicCoupling(phi) {
    var J = 0.0;
    if (phi <= 90) {
        J = 1.3 * Math.cos(phi) * Math.cos(phi) - 2.6 * Math.sin(phi) * Math.sin(phi);
    } else {
        J = -2.6 * Math.sin(phi) * Math.sin(phi);
    }
    return J;
}

function geminalCoupling() {
    return 1.6; // average over a sample of experimental spectra
}

function doubleBondCoupling(type, atoms) {
    var x = 0;
    var nbConnectedAtoms;
    for (let j = 1; j < atoms.size() - 1; j++) {
        nbConnectedAtoms = molecule.getAllConnAtoms(j);
        for (let i = 0; i < nbConnectedAtoms; i++) {
            x += (electronegativities[molecule.getAtomLabel(molecule.getConnAtom(j, i))]
            - electronegativities['H']);
        }
    }

    var result;
    switch (type) {
        case 1: // cis, empirical formula from a sample of experimental spectra
            result = -4.724 * x + 13.949;
            break;
        case 2: // trans, empirical formula from a sample of experimental
            // spectra
            result = -3.063 * x + 17.519;
            break;
        default:
            result = 0;
    }

    return result;
}

function checkVynilicCoupling(atoms) {
    var nbConnectedAtoms;
    var result = false;
    for (var j = 1, l = atoms.length - 1; j < l; j++) {
        nbConnectedAtoms = molecule.getAllConnAtoms(atoms.get(j));
        if (nbConnectedAtoms < 4) {
            result = true;
            j = l;
        }
    }
    return result;
}

function isDoubleBond(atom1, atom2) {
    var bond = molecule.getBond(atom1, atom2);
    var bondType = molecule.getBondType(bond);
    return (bondType === 2);
}

function isDoubleOrTripleBond(atom1, atom2) {
    var bond = molecule.getBond(atom1, atom2);
    var bondType = molecule.getBondType(bond);
    return (bondType === 2 || bondType === 4);
}

function isNotAromatic(atom1, atom2) {
    var bond = molecule.getBond(atom1, atom2);
    return !molecule.isAromaticBond(bond);
}

function isAromatic(atom1, atom2) {
    var bond = molecule.getBond(atom1, atom2);
    return molecule.isAromaticBond(bond);
}

function isAttachedToHeteroAtom(atom) {
    var result = false;
    var nbConnectedAtoms = molecule.getAllConnAtoms(atom);
    for (var j = 0; j < nbConnectedAtoms; j++) {
        var connAtom = molecule.getConnAtom(atom, j);
        if (!(molecule.getAtomLabel(connAtom) === 'C')) {
            result = true;
            j = nbConnectedAtoms;
        }
    }
    return result;
}

function isOnlyAttachedToHC(atom) {
    var nbConnectedAtoms = molecule.getAllConnAtoms(atom);
    for (var j = 0; j < nbConnectedAtoms; j++) {
        var connAtom = molecule.getConnAtom(atom, j);
        if (!(molecule.getAtomLabel(connAtom) === 'C' || molecule.getAtomLabel(connAtom) === 'H')) {
            return false;
        }
    }
    return true;
}

const electronegativities = {
    'H': 2.20,
    'Li': 0.98,
    'Be': 1.57,
    'B': 2.04,
    'C': 2.55,
    'N': 3.04,
    'O': 3.44,
    'F': 3.98,
    'Na': 0.93,
    'Mg': 1.31,
    'Al': 1.61,
    'Si': 1.90,
    'P': 2.19,
    'S': 2.58,
    'Cl': 3.16,
    'K': 0.82,
    'Ca': 1.00,
    'Sc': 1.36,
    'Ti': 1.54,
    'V': 1.63,
    'Cr': 1.66,
    'Mn': 1.55,
    'Fe': 1.83,
    'Co': 1.88,
    'Ni': 1.91,
    'Cu': 1.90,
    'Zn': 1.65,
    'Ga': 1.81,
    'Ge': 2.01,
    'As': 2.18,
    'Se': 2.55,
    'Br': 2.96,
    'Kr': 3.00,
    'Rb': 0.82,
    'Sr': 0.95,
    'Y': 1.22,
    'Zr': 1.33,
    'Nb': 1.6,
    'Mo': 2.16,
    'Tc': 1.9,
    'Ru': 2.2,
    'Rh': 2.28,
    'Pd': 2.20,
    'Ag': 1.93,
    'Cd': 1.69,
    'In': 1.78,
    'Sn': 1.96,
    'Sb': 2.05,
    'Te': 2.1,
    'I': 2.66,
    'Xe': 2.6,
    'Cs': 0.79,
    'Ba': 0.89,
    'La': 1.10,
    'Ce': 1.12,
    'Pr': 1.13,
    'Nd': 1.14,
    'Sm': 1.17,
    'Gd': 1.20,
    'Dy': 1.22,
    'Ho': 1.23,
    'Er': 1.24,
    'Tm': 1.25,
    'Lu': 1.27,
    'Hf': 1.3,
    'Ta': 1.5,
    'W': 2.36,
    'Re': 1.9,
    'Os': 2.2,
    'Ir': 2.20,
    'Pt': 2.28,
    'Au': 2.54,
    'Hg': 2.00,
    'Tl': 1.62,
    'Pb': 2.33,
    'Bi': 2.02,
    'Po': 2.0,
    'At': 2.2,
    'Fr': 0.7,
    'Ra': 0.9,
    'Ac': 1.1,
    'Th': 1.3,
    'Pa': 1.5,
    'U': 1.38,
    'Np': 1.36,
    'Pu': 1.28,
    'Am': 1.3,
    'Cm': 1.3,
    'Bk': 1.3,
    'Cf': 1.3,
    'Es': 1.3,
    'Fm': 1.3,
    'Md': 1.3,
    'No': 1.3
};


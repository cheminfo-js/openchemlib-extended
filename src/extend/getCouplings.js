'use strict';

const Coupling = require('./Coupling');
const Matrix = require('ml-matrix');

module.exports = function () {
    return function getAllCouplings() {
        var molecule = this.getCompactCopy();
        var diaIDs = molecule.getDiastereotopicAtomIDs();
        var matchFragments = molecule.getFragments();
        var fragmentsId = {}; //TODO
        var couplings = [];
        for (let i = 0; i < molecule.getAllAtoms(); i++) {
            if (molecule.getAtomLabel(i) === 'H') {
                for (let j = i + 1; j < molecule.getAllAtoms(); j++) {
                    if (molecule.getAtomLabel(j) === 'H') {
                        if (!isAttachedToHeteroAtom(molecule, i) && !isAttachedToHeteroAtom(molecule, j)) {
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

                                    if (calculatedCoupling(molecule, couple, fragmentsId, matchFragments)) {
                                        couplings.push(couple);
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
}

function couplingBelongToFragment(atoms, matchFragments) {
    var match;
    var result = -1;
    var index = atoms.length - 1;
    for (let i = 0; i < matchFragments.length; i++) {
        match = 0;
        for (let j = 0; j < matchFragments[i].length; j++) {
            for (let k = 1; k < index; k++) {
                if (matchFragments[i][j] === atoms[k]) {
                    match++;
                }
            }
        }

        if (match === atoms.length - 2) {
            result = i;
            i = matchFragments.length;
        }
    }
    return result;
}

function calculatedCoupling(molecule, couple, fragmentsId, matchFragments) {
    var atoms = couple.getAtoms();
    var bondLength = atoms.length - 1;
    var fragmentId = couple.getFragmentId();
    if (fragmentId !== -1) {
        couple.setType(0);
        var C1 = -1;
        var C2 = -1;
        var couplings = fragments[fragmentsId[fragmentId]];

        for (var i = 0; i < matchFragments[couple.getFragmentId()].length; i++) {
            if (atoms[1] === matchFragments[fragmentId][i]) {
                C1 = i;
            }
            if (atoms[atoms.length - 2] === matchFragments[fragmentId][i]) {
                C2 = i;
            }
        }

        if (C1 > C2) {
            [C1, C2] = [C2, C1];
        }

        if (couplings !== null) {
            C1 = C1 + '';
            C2 = C2 + '';
            couple.setCoupling(couplings[C1 + '-' + C2]);
        }

        return true;
    }

    switch (bondLength) {
        case 2:
            if (molecule.getAllConnAtoms(atoms[1]) < 4) {
                couple.setType(1); // geminal coupling of alkene
                couple.setCoupling(geminalCoupling());
            } else {
                couple.setCoupling(16); // generic coupling between geminal hydrogens
            }
            break;
        case 3: {
            var angle, xyz, coords;
            if (isDoubleBond(molecule, atoms[1], atoms[2])) {
                // coupling
                // through
                // double
                // bond
                // It have to be plain
                couple.setType(2);

                coords = new Matrix(4, 3);
                xyz = couple.getXYZ();
                for (let i = 0; i < xyz.length; i++) {
                    for (let j = 0; j < 3; j++) {
                        coords[i][j] = xyz[i][j];
                    }
                }

                angle = getDihedralAngle(coords);

                if (angle > 60) {
                    couple.setType(22);
                    couple.setCoupling(doubleBondCoupling(molecule, 2, atoms));
                } else {
                    couple.setType(21);
                    couple.setCoupling(doubleBondCoupling(molecule, 1, atoms));
                }
            } else {
                var sumZ = 0;
                angle = 0.0;
                xyz = couple.getXYZ();
                coords = new Matrix(xyz.length, 3);

                for (let i = 0; i < xyz.length; i++) {
                    for (let j = 0; j < 3; j++) {
                        coords[i][j] = xyz[i][j];
                    }
                    sumZ += Math.abs(coords[i][2]);
                }
                if (sumZ === 0 && !isDoubleOrTripleBond(molecule, atoms[1], atoms[2])) {// If
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
                // vynilcoupling
                if (true === checkVynilicCoupling(molecule, atoms)) {
                    couple.setType(3);
                    couple.setCoupling(vinylCoupling(angle));
                } else {
                    couple.setType(4);
                    // vicinal coupling
                    couple.setCoupling(jCouplingVicinal(molecule, angle, 1, atoms));
                }
            }
            break;
        }
        case 4: {// allylic Coupling
            couple.setType(5);
            if (isDoubleOrTripleBond(molecule, atoms[1], atoms[2])
                && isNotAromatic(molecule, atoms[1], atoms[2])) {
                couple.setCoupling(2);
            } else if (isDoubleOrTripleBond(molecule, atoms[2], atoms[3])
                && isNotAromatic(molecule, atoms[2], atoms[3])) {
                couple.setCoupling(2);
            } else if (isAromatic(molecule, atoms[1], atoms[2])
                && isAromatic(molecule, atoms[2], atoms[3])) {
                couple.setCoupling(2);
            } else {
                if ((isAromatic(molecule, atoms[1], atoms[1])
                    && !isAromatic(molecule, atoms[2], atoms[3]))) {
                    if (isOnlyAttachedToHC(molecule, atoms[3])) {
                        couple.setCoupling(1.5);
                        return true;
                    }
                } else {
                    if (!isAromatic(molecule, atoms[1], atoms[1])
                        && isAromatic(molecule, atoms[2], atoms[3])) {
                        if (isOnlyAttachedToHC(molecule, atoms[1])) {
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

function jCouplingVicinal(molecule, dihedralAngle, model, atoms) {
    var J = 0.0;
    var delta;
    var nbConnectedAtoms;
    var electH = electronegativities.H;
    var direction = [1, -1, 1, -1];
    var p = [];

    switch (model) {
        case 1:
            // type = "karplus";

            p = [7.76, -1.10, 1.40];
            J = p[0] * Math.cos(dihedralAngle) * Math.cos(dihedralAngle) + p[1] * Math.cos(dihedralAngle) + p[2];
            break;

        case 2:

            // type = "Karplus-altona";

            // p = [13.88, -0.81, 0, 0.56, -2.32, 17.9];
            p = [13.7, -0.73, 0, 0.56, -2.47, 16.9];
            for (let j = 1; j < atoms.size() - 1; j++) {
                nbConnectedAtoms = molecule.getAllConnAtoms(j);
                for (let i = 0; i < nbConnectedAtoms; i++) {
                    delta = electronegativities[molecule.getAtomLabel(molecule.getConnAtom(j, i))]
                        - electH;
                    J += delta * (p[3] + p[4] * Math.cos(direction[j] * dihedralAngle + p[5] * Math.abs(delta))
                        * Math.cos(direction[j] * dihedralAngle + p[5] * Math.abs(delta)));
                }
            }
            J += p[0] * Math.cos(dihedralAngle) * Math.cos(dihedralAngle) + p[1] * Math.cos(dihedralAngle) + p[2];
            break;

        case 3:

            // type = "Karplus-altona beta effect";
            p = [13.7, -0.73, 0, 0.56, -2.47, 16.9, -0.14];
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
                    I = delta + p[6] * I;
                }

                J += I * (p[3] + p[4] * (Math.cos(direction[j] * dihedralAngle + p[5] * Math.abs(I))
                    * Math.cos(direction[j] * dihedralAngle + p[5] * Math.abs(I))));
            }
            J += p[0] * Math.cos(dihedralAngle) * Math.cos(dihedralAngle) + p[1] * Math.cos(dihedralAngle) + p[2];
            break;

        default:
            J = 0.0;
    }
    return J;
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

function geminalCoupling() {
    return 1.6; // average over a sample of experimental spectra
}

function doubleBondCoupling(molecule, type, atoms) {
    var x = 0;
    var nbConnectedAtoms;
    for (let j = 1; j < atoms.size() - 1; j++) {
        nbConnectedAtoms = molecule.getAllConnAtoms(j);
        for (let i = 0; i < nbConnectedAtoms; i++) {
            x += (electronegativities[molecule.getAtomLabel(molecule.getConnAtom(j, i))]
            - electronegativities.H);
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

function checkVynilicCoupling(molecule, atoms) {
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

function isDoubleBond(molecule, atom1, atom2) {
    var bond = molecule.getBond(atom1, atom2);
    var bondType = molecule.getBondType(bond);
    return (bondType === 2);
}

function isDoubleOrTripleBond(molecule, atom1, atom2) {
    var bond = molecule.getBond(atom1, atom2);
    var bondType = molecule.getBondType(bond);
    return (bondType === 2 || bondType === 4);
}

function isNotAromatic(molecule, atom1, atom2) {
    var bond = molecule.getBond(atom1, atom2);
    return !molecule.isAromaticBond(bond);
}

function isAromatic(molecule, atom1, atom2) {
    var bond = molecule.getBond(atom1, atom2);
    return molecule.isAromaticBond(bond);
}

function isAttachedToHeteroAtom(molecule, atom) {
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

function isOnlyAttachedToHC(molecule, atom) {
    var nbConnectedAtoms = molecule.getAllConnAtoms(atom);
    for (var j = 0; j < nbConnectedAtoms; j++) {
        var connAtom = molecule.getConnAtom(atom, j);
        if (!(molecule.getAtomLabel(connAtom) === 'C' || molecule.getAtomLabel(connAtom) === 'H')) {
            return false;
        }
    }
    return true;
}
// function getAngle(xyz) {
//     // double sum=0;
//     // Check if we have the Z coordinate
//     // for (int i=0;i<xyz.length;i++)
//     // sum+=Math.abs(xyz[i][2]);
//     // if(sum==0)
//     // return 60;
//     var dotProduct = 0;
//     var magnitudes = new Array(xyz.length);
//     var mult;
//
//     for (let i = 0; i < xyz[0].length; i++) {
//         mult = 1;
//         for (let j = 0; j < xyz.length; j++) {
//             mult *= xyz[j][i];
//             magnitudes[j] += xyz[j][i] * xyz[j][i];
//         }
//         dotProduct += mult;
//     }
//     return Math.acos(dotProduct / (magnitudes[0] * magnitudes[1])) * 180 / Math.PI;
// }

// function fourBondCoupling() {
//     return 0;
// }

// function allylicCoupling(phi) {
//     var J;
//     if (phi <= 90) {
//         J = 1.3 * Math.cos(phi) * Math.cos(phi) - 2.6 * Math.sin(phi) * Math.sin(phi);
//     } else {
//         J = -2.6 * Math.sin(phi) * Math.sin(phi);
//     }
//     return J;
// }
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

const fragments = {
    'gFp@DiTt@@B !Bg~wK_}mvw@`': {'0-1': 8, '0-2': 8, '1-3': 8, '3-5': 8, '4-5': 8, '2-4': 8, '0-3': 2.5, '0-4': 2.5, '3-4': 2.5, '1-2': 2.5, '1-5': 2.5, '2-5': 2.5, '2-3': 1, '1-4': 1, '0-5': 1},
    'gKQ@@eKcRpD !BcLbLypAe@Bh': {'1-3': 1.8, '2-4': 1.8, '1-4': 0.5, '2-3': 0.5, '1-2': 1.55, '3-4': 3.5},
    'gKX@@eKcRpD !BcLbLipBe@Lh': {'1-3': 2.2, '2-4': 2.2, '1-4': 1.25, '2-3': 1.25, '1-2': 2.05, '3-4': 3.4},
    'gKPH@DIRxtlA@ !BcLbLqp@e@Dh': {'1-3': 5.2, '2-4': 5.2, '1-4': 1.25, '2-3': 1.25, '1-2': 2.7, '3-4': 3.6},
    'gFx@@eJf`@@P !BbOsWGx@_`CW@': {'1-3': 5.3, '2-4': 5.3, '1-4': 0.9, '2-3': 0.9, '1-2': 0.35, '3-4': 1.65, '1-5': 1.8, '2-5': 1.8, '3-5': 7.85, '4-5': 7.85},
    'gKT@Adi\\Vf@` !Bo`@oIR}jXq`': {'2-4': 1.5, '1-4': 1.5, '1-2': 0.75},
    'gKT@ADi\\Yi@` !BKrk~_qLgKtT': {'2-4': 1.5, '3-4': 2.5, '2-3': 0.75},
    'gKY@LDi\\ZV@` !BXNTSIwysA\\\\': {'1-2': 0.5, '2-4': 0.8},
    'gKXHL@aJWFe`H !BXNTSIwysA\\\\': {'1-2': 1.9, '2-4': 3.2},
    'gKXHL@aJWFe`H !BHFTSI{ycA\\\\': {'2-4': 4.7, '3-4': 1.7},
    'gFxA@IReSP@@H !BlCvwO[yog~wOP': {'1-3': 6, '2-4': 6, '2-5': 1.5, '1-5': 2.5, '2-3': 0.8, '1-4': 0.8, '1-2': 1, '3-5': 8, '4-5': 8, '3-4': 1.4},
    'gFt@ADiTt@@B !Bmsr~_{_}mv~_p': {'2-4': 4.9, '3-5': 4.9, '2-5': 2, '3-4': 2, '2-3': 3.5, '4-5': 8.4},
    'gFt@AdiTt@@B !Bo`BWoY_|epJWoP': {'4-5': 5, '2-5': 2.5, '1-5': 1.5, '1-4': 0},
    'gFt@ATiTt@@B !Br@KgCx@O`Cg@': {'1-3': 1.8, '2-4': 1.8, '1-4': 1.8, '2-3': 1.8, '1-2': 0.5, '3-4': 0.5}
};

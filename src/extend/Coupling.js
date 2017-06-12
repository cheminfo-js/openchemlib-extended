'use strict';

class Coupling {

    constructor() {
        this.atoms = [];
        this.type = -1;
        this.xyz = null;
        this.fragmentId = -1;
        this.coupling = -1;
    }

    setAtoms(atoms) {
        this.atoms = atoms;
    }

    setType(type) {
        this.type = type;
    }

    setCoupling(coupling) {
        this.coupling = coupling;
    }

    setXYZ(xyz) {
        this.xyz = xyz;
    }

    setFragmentId(fragmentId) {
        this.fragmentId = fragmentId;
    }

    getAtoms() {
        return this.atoms;
    }

    getXYZ() {
        return this.xyz;
    }

    getType() {
        return this.type;
    }

    getCoupling() {
        return this.coupling;
    }

    getFragmentId() {
        return this.fragmentId;
    }

    toString() {
        return this.toJSON().toString();
    }

    toJSON() {
        let atoms = this.atoms;
        var path = {
            fromAtom: atoms[0],
            toAtom: atoms[atoms.length - 1],
            length: atoms.length - 1,
            coupling: this.coupling,
            fromDiaID: this.fromDiaID,
            toDiaID: this.toDiaID,
            multiplicity: this.multiplicity
        };
        return path;
    }

    getFromAtom() {
        return this.atoms[0];
    }

    getToAtom() {
        return this.atoms[this.atoms.length - 1];
    }

    equals(obj) {
        var result = false;

        if (this === obj) {
            result = true;
        } else if (this.atoms.length === obj.atoms.length) {
            if (this.getFromAtom() === obj.atoms[0]
                && this.getToAtom() === obj.atoms[obj.atoms.length - 1]) {
                result = true;
            } else if (this.getFromAtom() === obj.atoms[obj.atoms.length - 1]
                && this.getToAtom() === obj.atoms[0]) {
                result = true;
            }
        }

        return result;
    }

    getFromDiaID() {
        return this.fromDiaID;
    }

    setFromDiaID(diaID1) {
        this.fromDiaID = diaID1;
    }

    getToDiaID() {
        return this.toDiaID;
    }

    setToDiaID(diaID2) {
        this.toDiaID = diaID2;
    }

    getMultiplicity() {
        return this.multiplicity;
    }

    setMultiplicity(multiplicity) {
        this.multiplicity = multiplicity;
    }
}

module.exports = Coupling;

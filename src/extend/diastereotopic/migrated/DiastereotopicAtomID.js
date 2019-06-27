'use strict';

const OCLE = require('../../../..');

const changeAtom = require('./changeAtom');
const makeRacemic = require('./makeRacemic');

const Molecule = OCLE.Molecule;

const xAtomicNumber = OCLE.Molecule.getAtomicNoFromLabel('X');

function getAtomIDs(molecule) {
  addMissingChirality(molecule);

  let numberAtoms = molecule.getAllAtoms();
  let ids = [];
  for (let iAtom = 0; iAtom < numberAtoms; iAtom++) {
    let tempMolecule = molecule.getCompactCopy();
    changeAtom(tempMolecule, iAtom);
    makeRacemic(tempMolecule);
    // We need to ensure the helper array in order to get correctly the result of racemisation
    ids[iAtom] = tempMolecule.getCanonizedIDCode(
      OCLE.Molecule.CANONIZER_ENCODE_ATOM_CUSTOM_LABELS
    );
  }
  return ids;
}

/**
 * The problem is that sometimes we need to add chiral bond that was not planned because it is the same group
 * This is the case for example for the valine where the 2 C of the methyl groups are diastereotopic
 * @param molecule
 */
function addMissingChirality(molecule, esrType = Molecule.cESRTypeAnd) {
  for (let iAtom = 0; iAtom < molecule.getAllAtoms(); iAtom++) {
    let tempMolecule = molecule.getCompactCopy();
    changeAtomForStereo(tempMolecule, iAtom);
    // After copy, helpers must be recalculated
    tempMolecule.ensureHelperArrays(Molecule.cHelperParities);
    // We need to have >0 and not >1 because there could be unspecified chirality in racemate
    for (let i = 0; i < tempMolecule.getAtoms(); i++) {
      // changed from from handling below; TLS 9.Nov.2015
      if (
        tempMolecule.isAtomStereoCenter(i) &&
        tempMolecule.getStereoBond(i) === -1
      ) {
        let stereoBond = tempMolecule.getAtomPreferredStereoBond(i);
        if (stereoBond !== -1) {
          molecule.setBondType(stereoBond, Molecule.cBondTypeUp);
          if (molecule.getBondAtom(1, stereoBond) === i) {
            let connAtom = molecule.getBondAtom(0, stereoBond);
            molecule.setBondAtom(0, stereoBond, i);
            molecule.setBondAtom(1, stereoBond, connAtom);
          }
          // To me it seems that we have to add all stereo centers into AND group 0. TLS 9.Nov.2015
          molecule.setAtomESR(i, esrType, 0);
        }
      }
    }
  }
}

function changeAtomForStereo(molecule, iAtom) {
  // need to force the change to an excotic atom to check if it is really chiral
  molecule.setAtomicNo(iAtom, xAtomicNumber);
}

/**
 * In order to debug we could number the group of diastereotopic atoms
 *
 * @param molecule
 */
function markDiastereotopicAtoms(molecule) {
  // changed from markDiastereo(); TLS 9.Nov.2015
  let ids = getAtomIDs(molecule);
  let analyzed = {};
  let group = 0;
  for (let id of ids) {
    // console.log(`${id} - ${group}`);
    if (!analyzed.contains(id)) {
      analyzed[id] = true;
      for (let iAtom = 0; iAtom < ids.length; iAtom++) {
        if (id.equals(ids[iAtom])) {
          molecule.setAtomCustomLabel(iAtom, group);
        }
      }
      group++;
    }
  }
}

module.exports = {
  getAtomIDs,
  markDiastereotopicAtoms
};

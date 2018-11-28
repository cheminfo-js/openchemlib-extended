'use strict';

/**
 * Add an netry in the database
 * @param {object} moleculeInfo - a molecule as a JSON that may contain the following properties: molfile, smiles, idCode, value (=idCode), mf, index
 * @param {object} [data={}]
 * @param {object} [moleculeInfo={}] may contain precalculated index and mw
 */

function pushMoleculeInfo(moleculeInfo, data = {}) {
  if (typeof moleculeInfo !== 'object') {
    throw new Error('pushMoleculeInfo requires an object as first parameter');
  }
  let Molecule = this.OCL.Molecule;
  let molecule;
  if (moleculeInfo.molfile) {
    molecule = Molecule.fromMolfile(moleculeInfo.molfile);
  }
  if (moleculeInfo.smiles) molecule = Molecule.fromSmiles(moleculeInfo.smiles);
  if (moleculeInfo.value) molecule = Molecule.fromIDCode(moleculeInfo.value);
  if (moleculeInfo.idCode) {
    molecule = Molecule.fromIDCode(moleculeInfo.idCode);
  }
  if (moleculeInfo.oclCode) {
    molecule = Molecule.fromIDCode(moleculeInfo.oclCode);
  }
  if (molecule) this.moleculeDB.pushEntry(molecule, data, moleculeInfo);
}

module.exports = pushMoleculeInfo;

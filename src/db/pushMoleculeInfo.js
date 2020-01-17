'use strict';

/**
 * Add an netry in the database
 * @param {object} moleculeInfo - a molecule as a JSON that may contain the following properties: molfile, smiles, idCode, mf, index
 * @param {object} [data={}]
 * @param {object} [moleculeInfo={}] may contain precalculated index and mw
 */

function pushMoleculeInfo(moleculeInfo, data = {}) {
  if (typeof moleculeInfo !== 'object') {
    throw new Error('pushMoleculeInfo requires an object as first parameter');
  }
  const Molecule = this.OCL.Molecule;
  let molecule;
  if (moleculeInfo.molfile) {
    molecule = Molecule.fromMolfile(moleculeInfo.molfile);
  }
  if (moleculeInfo.smiles) molecule = Molecule.fromSmiles(moleculeInfo.smiles);
  if (moleculeInfo.idCode) {
    if (this.moleculeDB.db[moleculeInfo.idCode]) {
      molecule = this.moleculeDB.db[moleculeInfo.idCode].molecule;
    } else {
      molecule = Molecule.fromIDCode(
        moleculeInfo.idCode,
        moleculeInfo.coordinates || false,
      );
    }
  }

  if (molecule) {
    this.moleculeDB.pushEntry(molecule, data, moleculeInfo);
  }
}

module.exports = pushMoleculeInfo;

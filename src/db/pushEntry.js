'use strict';

/**
 * Add an netry in the database
 * @param {OCL.Molecule} molecule
 * @param {object} [data={}]
 * @param {object} [moleculeInfo={}] may contain precalculated index and mw
 */

function pushEntry(molecule, data = {}, moleculeInfo = {}) {
  let moleculeIDCode = molecule.getIDCode();
  let entry = this.db[moleculeIDCode];
  if (!entry) {
    // a new molecule
    entry = { molecule, properties: {} };
    this.db[moleculeIDCode] = this.db[moleculeIDCode];

    // ensure helper arrays needed for substructure search
    molecule.ensureHelperArrays(this.OCL.Molecule.cHelperRings);
    if (!moleculeInfo.index) {
      entry.index = molecule.getIndex();
    }

    let molecularFormula;
    if (!moleculeInfo.mw) {
      molecularFormula = molecule.getMolecularFormula();
      molecule.properties.mw = molecularFormula.relativeWeight;
    }
    if (this.computeProperties) {
      if (!molecularFormula) {
        molecularFormula = molecule.getMolecularFormula();
      }
      const properties = new this.OCL.MoleculeProperties(molecule);
      entry.properties.em = molecularFormula.absoluteWeight;
      entry.properties.mf = molecularFormula.formula;
      entry.properties.acceptorCount = properties.acceptorCount;
      entry.properties.donorCount = properties.donorCount;
      entry.properties.logP = properties.logP;
      entry.properties.logS = properties.logS;
      entry.properties.polarSurfaceArea = properties.polarSurfaceArea;
      entry.properties.rotatableBondCount = properties.rotatableBondCount;
      entry.properties.stereoCenterCount = properties.stereoCenterCount;
    }
  }
  entry.data.push(data);
}

module.exports = pushEntry;

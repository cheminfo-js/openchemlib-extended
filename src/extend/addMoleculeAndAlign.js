'use strict';

/**
 * Add a molecule and align it horizontally
 * @returns {molecule}
 */

module.exports = function() {
  return function addMoleculeAndAlign(molecule, options = {}) {
    const { space = 2 } = options;
    let boundary = this.getBoundary();
    let addBoundary = molecule.getBoundary();

    let y =
      (boundary.minY + boundary.maxY) / 2 -
      (addBoundary.minY + addBoundary.maxY) / 2;

    molecule.translateCoords(boundary.maxX - addBoundary.minX + space, y);
    this.addMolecule(molecule);
    return this;
  };
};

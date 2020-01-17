'use strict';

/**
 * @returns {object} : minX, maxX, minY, maxY, minZ, maxZ, width, height, depth
 */

module.exports = function() {
  return function getBoundary() {
    let minX = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    let minZ = Number.POSITIVE_INFINITY;
    let maxZ = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < this.getAllAtoms(); i++) {
      let x = this.getAtomX(i);
      let y = this.getAtomY(i);
      let z = this.getAtomZ(i);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      minZ = Math.min(minY, z);
      maxZ = Math.max(maxY, z);
    }

    return {
      minX,
      maxX,
      maxY,
      minY,
      maxZ,
      minZ,
      width: maxX - minX,
      height: maxY - minY,
      depth: maxZ - minZ,
    };
  };
};

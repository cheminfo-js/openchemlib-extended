'use strict';


module.exports = function (OCL) {
    const originalToSVG = OCL.Molecule.prototype.toSVG;
    return function (width, height, options={}) {

        const svg = originalToSVG.call(this, width, height);

        return svg.replace(/font-family=" Helvetica" /g, 'font-family=" Helvetica" font-weight="bold" ')
        .replace(/stroke-width:1/g, 'stroke-width:2');
    };
};

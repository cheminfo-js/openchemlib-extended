'use strict';


module.exports = function (OCL) {
    const originalToSVG = OCL.Molecule.prototype.toSVG;
    return function (width, height, id, options) {
        options = options || {};
        let svg = originalToSVG.call(this, width, height, id, options);

        if (options.bold) {
            svg = svg.replace(/font-family=" Helvetica" /g, 'font-family=" Helvetica" font-weight="bold" ');
        }
        if (options.strokeWidth) {
            svg = svg.replace(/stroke-width:1/g, `stroke-width:${options.strokeWidth}`);
        }
        return svg;
    };
};

'use strict';

module.exports = function toDiastereotopicSVG(options = {}) {
    var {
        width = 300,
        height = 200,
        prefix = 'ocl'

    } = options;
    var svg = options.svg;
    var diaIDs = this.getDiastereotopicAtomIDs();
    if (!svg) svg = this.toSVG(width, height, prefix);

    svg = svg.replace(/Atom:[0-9]+\"/g, function (value) {
        var atom = value.replace(/[^0-9]/g, '');
        return value + ' data-atomid="' + diaIDs[atom] + '"';
    });

    return svg;
};

'use strict';

module.exports = function getNumberOfAtoms(label) {
    var mf = this.getMolecularFormula().formula;
    var parts = mf.split(/(?=[A-Z])/);
    for (var part of parts) {
        var atom=part.replace(/[0-9]/g,'');
        if (atom==label) {
            return part.replace(/[^0-9]/g,'') * 1 || 1;
        }
    }
    
    return 0;
}

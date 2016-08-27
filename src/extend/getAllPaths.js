'use strict';

module.exports = function getAllPaths(fromLabel, toLabel, minLength, maxLength) {

    // we need to find all the atoms 'fromLabel' and 'toLabel'

    this.addImplicitHydrogens();

    var results=[];
    var diaIDs=this.getDiastereotopicAtomIDs();
    for (var from=0; from<this.getAllAtoms(); from++) {
        for (var to=0; to<this.getAllAtoms(); to++) {
            if (! fromLabel || this.getAtomLabel(from)===fromLabel) {
                if (! toLabel || this.getAtomLabel(to)===toLabel) {
                    var pathLength=this.getPathLength(from, to);
                    if (pathLength>=minLength && pathLength<=maxLength) {
                        results.push({
                            from:diaIDs[from],
                            to:diaIDs[to],
                            fromLabel: this.getAtomLabel(from),
                            toLabel: this.getAtomLabel(to),
                            pathLength: pathLength
                        });
                    }
                }
            }
        }
    }
    return results;
}

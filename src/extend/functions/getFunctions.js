'use strict';

let functionIndex = require('./functions');

module.exports = function getFunctions() {
  let currentFunctionCodes = this.getFunctionCodes();
  let currentFunctions = [];
  for (let fragment of currentFunctionCodes) {
    if (functionIndex[fragment.idCode]) {
      let currentFunction = JSON.parse(
        JSON.stringify(functionIndex[fragment.idCode]),
      );
      currentFunction.atomMap = fragment.atomMap;
      currentFunctions.push(currentFunction);
    }
  }
  return currentFunctions;
};

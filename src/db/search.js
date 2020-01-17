'use strict';

/**
 * Search in a MoleculeDB
 * Inside the database all the same molecules are group together
 * @memberof DB
 * @instance
 * @param {string|OCL.Molecule} [query] smiles, molfile, oclCode or instance of Molecule to look for
 * @param {object} [options={}]
 * @param {string} [options.format='idCode'] - query is in the format 'smiles', 'oclid' or 'molfile'
 * @param {string} [options.mode='substructure'] - search by 'substructure', 'exact' or 'similarity'
 * @param {boolean} [options.flattenResult=true] - The database group the data for the same product. This allows to flatten the result
 * @param {boolean} [options.keepMolecule=false] - keep the OCL.Molecule object in the result
 * @param {number} [options.limit=Number.MAX_SAFE_INTEGER] - maximal number of result
 * @return {Array} array of object of the type {(molecule), idCode, data, properties}
 */
function search(query, options = {}) {
  const {
    format = 'idCode',
    mode = 'substructure',
    flattenResult = true,
    keepMolecule = false,
    limit = Number.MAX_SAFE_INTEGER,
  } = options;

  if (typeof query === 'string') {
    const getMoleculeCreators = require('./moleculeCreators');
    const moleculeCreators = getMoleculeCreators(this.OCL.Molecule);
    query = moleculeCreators.get(format.toLowerCase())(query);
  } else if (!(query instanceof this.OCL.Molecule)) {
    throw new TypeError('toSearch must be a Molecule or string');
  }

  let result;
  switch (mode.toLowerCase()) {
    case 'exact':
      result = exactSearch(this.moleculeDB.db, query, limit);
      break;
    case 'substructure':
      result = subStructureSearch(this.moleculeDB, query, limit);
      break;
    case 'similarity':
      result = similaritySearch(this.moleculeDB, this.OCL, query, limit);
      break;
    default:
      throw new Error(`unknown search mode: ${options.mode}`);
  }
  return processResult(result, { flattenResult, keepMolecule, limit });
}

function exactSearch(db, query) {
  const queryIDCode = query.getIDCode();
  let searchResult = db[queryIDCode] ? [db[queryIDCode]] : [];
  return searchResult;
}

function subStructureSearch(moleculeDB, query) {
  let resetFragment = false;
  if (!query.isFragment()) {
    resetFragment = true;
    query.setFragment(true);
  }

  const queryMW = getMW(query);
  const searchResult = [];
  if (query.getAllAtoms() === 0) {
    for (let idCode in moleculeDB.db) {
      searchResult.push(moleculeDB.db[idCode]);
    }
  } else {
    const queryIndex = query.getIndex();
    const searcher = moleculeDB.searcher;

    searcher.setFragment(query, queryIndex);
    for (let idCode in moleculeDB.db) {
      let entry = moleculeDB.db[idCode];
      searcher.setMolecule(entry.molecule, entry.index);
      if (searcher.isFragmentInMolecule()) {
        searchResult.push(entry);
      }
    }
  }

  searchResult.sort(function(a, b) {
    return (
      Math.abs(queryMW - a.properties.mw) - Math.abs(queryMW - b.properties.mw)
    );
  });

  if (resetFragment) {
    query.setFragment(false);
  }

  return searchResult;
}

function similaritySearch(moleculeDB, OCL, query) {
  const queryIndex = query.getIndex();
  const queryMW = getMW(query);
  const queryIdCode = query.getIDCode();

  const searchResult = [];
  let similarity;
  for (let idCode in moleculeDB.db) {
    let entry = moleculeDB.db[idCode];
    if (entry.idCode === queryIdCode) {
      similarity = Number.MAX_SAFE_INTEGER;
    } else {
      similarity =
        OCL.SSSearcherWithIndex.getSimilarityTanimoto(queryIndex, entry.index) *
          1000000 -
        Math.abs(queryMW - entry.properties.mw) / 10000;
    }
    searchResult.push({ similarity, entry });
  }
  searchResult.sort(function(a, b) {
    return b.similarity - a.similarity;
  });
  return searchResult.map((entry) => entry.entry);
}

function getMW(query) {
  let copy = query.getCompactCopy();
  copy.setFragment(false);
  return copy.getMolecularFormula().relativeWeight;
}

function processResult(entries, options = {}) {
  const {
    flattenResult = true,
    keepMolecule = false,
    limit = Number.MAX_SAFE_INTEGER,
  } = options;
  let results = [];

  if (flattenResult) {
    for (let entry of entries) {
      for (let data of entry.data) {
        results.push({
          data,
          idCode: entry.idCode,
          properties: entry.properties,
          molecule: keepMolecule ? entry.molecule : undefined,
        });
      }
    }
  } else {
    for (let entry of entries) {
      results.push({
        data: entry.data,
        idCode: entry.idCode,
        properties: entry.properties,
        molecule: keepMolecule ? entry.molecule : undefined,
      });
    }
  }
  if (limit < results.length) results.length = limit;
  return results;
}

module.exports = search;

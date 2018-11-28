'use strict';

const moleculeCreators = getMoleculeCreators(Molecule);


search(query, options = {}) {
  options = Object.assign({}, defaultSearchOptions, options);

  if (typeof query === 'string') {
    query = moleculeCreators.get(options.format.toLowerCase())(query);
  } else if (!(query instanceof Molecule)) {
    throw new TypeError('toSearch must be a Molecule or string');
  }

  let result;
  switch (options.mode.toLowerCase()) {
    case 'exact':
      result = this.exactSearch(query, options.limit);
      break;
    case 'substructure':
      result = this.subStructureSearch(query, options.limit);
      break;
    case 'similarity':
      result = this.similaritySearch(query, options.limit);
      break;
    default:
      throw new Error(`unknown search mode: ${options.mode}`);
  }
  return result;
}

exactSearch(query, limit) {
  const queryIdcode = query.getIDCode();
  const result = new MoleculeDB();
  limit = limit || Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < this.length; i++) {
    if (this.molecules[i].idcode === queryIdcode) {
      result.push(this.molecules[i], this.data[i]);
      if (result.length >= limit) break;
    }
  }
  return result;
}

subStructureSearch(query, limit) {
  let needReset = false;

  if (!query.isFragment()) {
    needReset = true;
    query.setFragment(true);
  }

  const queryMW = getMW(query);

  const queryIndex = query.getIndex();
  const searcher = this.getSearcher();

  searcher.setFragment(query, queryIndex);
  const searchResult = [];
  for (let i = 0; i < this.length; i++) {
    searcher.setMolecule(this.molecules[i], this.molecules[i].index);
    if (searcher.isFragmentInMolecule()) {
      searchResult.push([this.molecules[i], i]);
    }
  }
  searchResult.sort(function(a, b) {
    return Math.abs(queryMW - a[0].mw) - Math.abs(queryMW - b[0].mw);
  });

  const length = Math.min(limit || searchResult.length, searchResult.length);
  const result = new MoleculeDB({length: length});
  for (let i = 0; i < length; i++) {
    result.push(
        this.molecules[searchResult[i][1]], this.data[searchResult[i][1]]);
  }

  if (needReset) {
    query.setFragment(false);
  }
  return result;
}

similaritySearch(query, limit) {
  const queryIndex = query.getIndex();

  const queryMW = getMW(query);
  const queryIDCode = query.getIDCode();

  const searchResult = new Array(this.length);
  let similarity;
  for (let i = 0; i < this.length; i++) {
    if (this.molecules[i].idcode === queryIDCode) {
      similarity = 1e10;
    } else {
      similarity = OCL.SSSearcherWithIndex.getSimilarityTanimoto(
                       queryIndex, this.molecules[i].index) *
              100000 -
          Math.abs(queryMW - this.molecules[i].mw) / 1000;
    }
    searchResult[i] = [similarity, i];
  }
  searchResult.sort(function(a, b) {
    return b[0] - a[0];
  });

  const length = Math.min(limit || searchResult.length, searchResult.length);
  const result = new MoleculeDB({length: length});
  for (let i = 0; i < length; i++) {
    result.push(
        this.molecules[searchResult[i][1]], this.data[searchResult[i][1]]);
  }
  return result;
}

getSearcher() {
  return this.searcher || (this.searcher = new OCL.SSSearcherWithIndex());
}

module.exports = search;
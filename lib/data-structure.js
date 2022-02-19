/**
 * Provides data structure classes and related functions.
 *
 * @file data-structure.js
 * @module lib/data-structure.js
 * @author Eric Lavault {@link https://github.com/lvlte}
 * @license MIT
 */

/**
 * Disjoint-set Data Structure (Union-Find algorithm).
 *
 * Uses both Union-by-Rank and Path Compression heuristics, which makes the
 * amortized running time of each operation asymptotically optimal.
 *
 * @see https://www.topcoder.com/thrive/articles/Disjoint-set%20Data%20Structures
 */
class DisjointSet {

  /**
   * Creates a DisjointSet forest made of n disjoint sets, each one being made
   * of a single element x for each integer x in range [0, n-1].
   *
   * If n is undefined, returns an instance with an empty forest (ie. for cases
   * where the caller makeSet() by itself, @see DisjointSet.fromPartition() for
   * example).
   *
   * @param {(number|undefined)} n If defined, must be a positive integer.
   * @returns {DisjointSet} The DisjointSet instance.
   */
  constructor(n) {
    // Maps a node x to its parent P[x], each node has a rank as well.
    this.P = new Map();
    this.rank = new Map();

    if (n === undefined)
      return this;

    if (!Number.isInteger(n) || n < 1)
        throw TypeError('n must be a positive integer');

    // Create n disjoint subsets.
    for (let i=0; i<n; i++) {
      this.makeSet(i);
    }

    return this;
  }

  /**
   * Static factory method.
   *
   * Creates a new DisjointSet instance based on the passsed-in partition, which
   * must be represented as an array consisting of disjoint subsets.
   *
   * Each subset can be represented either as an array, a Set(), or a string.
   *
   * @param {(Array[]|Set[]|string[])} partition Must be a valid partition.
   * @returns {DisjointSet} The DisjointSet instance
   */
  static fromPartition(partition) {
    // Check if the partition is a set of non-empty disjoint subsets.
    const items = partition.map(s => [...s]).flat(1);
    if (items.length != new Set(items).size)
      throw new Error('Invalid partition - Arguments must be disjoint subsets.');

    const subsets = partition.map(s => new Set(s));
    if (subsets.some(s => s.size === 0))
      throw new Error('Invalid partition - One of the subsets is empty.');

    // Create the instance and makeSet() for each subset.
    const instance = new DisjointSet();
    subsets.forEach(s => instance.makeSet(...s));

    return instance;
  }

  /**
   * Creates a new set consisting of the passed-in elements.
   *
   * @param {...*} X
   * @throws If any node is already contained in the forest.
   * @returns {DisjointSet} This instance.
   */
  makeSet(...X) {
    if (X.some(function(x){ x === undefined || this.P.has(x) }, this))
      throw new Error('Cannot makeSet() with already existing or undefined node(s).');

    // Let the first item be the representative of the set.
    const r = X[0];

    for (let i=0; i<X.length; i++) {
      this.P.set(X[i], r);
      this.rank.set(X[i], 0);
    }

    return this;
  }

  /**
   * Returns the representative of the set that contains x.
   *
   * @param {*} x
   * @returns {*}
   */
  find(x) {
    const px = this.P.get(x);
    if (px !== x && px !== undefined) {
      // If x is not the representative of its set, we recursively call find()
      // on its parent and take the opportunity to set x as a direct child of
      // the root (path compression).
      this.P.set(x, this.find(px));
      return this.P.get(x);
    }
    return px;
  }

  /**
   * Merge the set that contains x and the set that contains y into one single
   * set whose parent is the higher-ranked representative of the two sets.
   *
   * @param {*} x
   * @param {*} y
   * @returns {DisjointSet} This instance.
   */
  union(x, y) {
    // Find the representatives of both x and y.
    const xr = this.find(x);
    const yr = this.find(y);

    // No-op if x and y are already in the same set.
    if (xr === yr)
      return;

    // We need the rank of the sets to properly choose which one will go under
    // the other.
    const xrank = this.rank.get(xr);
    const yrank = this.rank.get(yr);

    // If the ranks are different, we put the set with smaller rank under the
    // other one so that the higher rank remains unchanged and the tree doesn't
    // expand vertically.
    if (xrank < yrank)
      this.P.set(xr, yr);
    else {
      this.P.set(yr, xr);
      // If ranks are equal, doesn't matter which one goes where but the parent
      // has its rank incremented.
      if (xrank === yrank)
        this.rank.set(xr, xrank + 1);
    }
    return this;
  }
}


module.exports = {
  DisjointSet
}

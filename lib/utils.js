/**
 * Provides js utils and helpers.
 * Extends Array|Object prototypes.
 *
 * @file utils.js
 * @module lib/utils.js
 * @author Eric Lavault {@link https://github.com/lvlte}
 * @license MIT
 */

/**
 * Defines assignRange() prototype.
 *
 * Assigns a range of numbers to an array|object, with each resulting number n
 * being assigned to its corresponding nth index, thus combining keys & values :
 * [start, start + step, start + 2 * step, ...].
 *
 * @param Number start
 *  Starting number of the sequence.
 *
 * @param Number stop
 *  Generate numbers up to, but not including this number.
 *
 * @param Number step
 *  Difference between each number in the sequence.
 *
 * @return {Array|Object}
 */
const _assignRangeProto = {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function(start, stop, step=1) {
    start = start || 0;
    if (arguments.length == 1) {
      stop = start;
      start = 0;
    }
    if (start >= stop)
      return this;
    let j = start;
    do this[j] = j;
    while ((j+=step) < stop);
    return this;
  }
};

Object.defineProperty(Array.prototype, 'assignRange', _assignRangeProto);
Object.defineProperty(Object.prototype, 'assignRange', _assignRangeProto);


let Utils;
module.exports = Utils = {

  /**
   * Returns the product of the given factors array.
   * @param {Array} factors
   * @returns {Number}
   */
  product(factors) {
    let p = 1;
    for (let i=0; i<factors.length; i++)
      p *= factors[i];
    return p;
  },

  /**
   * Returns the total sum of the given summands.
   *
   * @param {Array} summands Array of numbers to be summed, accept strings.
   * @returns {Number}
   */
  sum(summands) {
    let i = 0, s = typeof summands[0] === 'bigint' ? 0n : 0;
    while (i<summands.length)
      s += +summands[i++];
    return s;
  },

  /**
   * Tests whether or not the remainder of (n mod d) equals zero.
   *
   * @param {Number} n numerator
   * @param {Number} d denominator
   * @returns {Boolean}
   */
  remZero(n, d, q) {
    // `(q=n/d) == Math.floor(q)` is much faster as than `n%d == 0` on V8 engine.
    return (q = n/d) == Math.floor(q);
  },

  /**
   * Returns the proper divisors of n (including 1, excluding n).
   *
   * @param {Number} n The given number
   * @returns {Array}
   */
  divisors(n) {
    if (n < 0)
      return Utils.divisors(-n);

    if (n <= 2)
      return [1];

    // Use an object for natural lexicographic indexing so that we can get the
    // divisors sorted in ascending order.
    let div = {1:1};

    const limit = Math.sqrt(n);
    let i = 1;

    while (i < limit) {
      if (Utils.remZero(n, ++i)) {
        div[i] = i;
        div[n/i] = n/i;
      }
    }

    return Object.values(div);
  },

  /**
   * Returns the product of all positive integers less than or equal to n.
   *
   * @param {Number|BigInt} n
   * @returns {Number|BigInt}
   */
  factorial(n) {
    const f = typeof n === 'bigint' || n > 18 ? Utils.bigFact : n => n<2 ? 1: n*f(n-1);
    return f(n);
  },

  /**
   * Returns the product of all positive integers less than or equal to n as a
   * BigInt.
   *
   * @param {Number|BigInt} n
   * @returns {BigInt}
   */
  bigFact(n) {
    const bigN = BigInt(n);
    const f = n => n<2n ? 1n: n*f(n-1n);
    return f(bigN);
  },

  /**
   * Returns the Binomial Coefficient, that is the coefficient of the x^k term
   * in the polynomial expansion of the binomial power (1 + x)^n, given n and k.
   *
   * It also represents the number of ways to choose an (unordered) subset of k
   * elements (or k-combinations) from a fixed set of n elements.
   *
   * The number of k-combinations from a given set S of n elements is often
   * denoted in elementary combinatorics texts by C(n,k).
   *
   * The same number however occurs in many other mathematical contexts, where
   * it is denoted "n choose k".
   *
   * @param {Number} n
   * @param {Number} k
   * @returns {Number|BigInt}
   */
  nChooseK(n, k) {
    if (typeof n != 'bigint' && n > 18 || typeof k != 'bigint' && k > 18) {
      n = BigInt(n);
      k = BigInt(k);
    }
    return Utils.factorial(n) / (Utils.factorial(k)*Utils.factorial(n-k));
  },

  /**
   * @see nChooseK
   * @borrows nChooseK as binomialCoef
   */
  binomialCoef(n, k) {
    return Utils.nChooseK(n, k);
  },

  /**
   * Returns the nth central binomial coefficient given n, that is the particular
   * binomial coefficient of (2n <choose> n).
   *
   * Central binomial coefficients show up exactly in the middle of the even-
   * -numbered rows in Pascal's triangle, that's why there called so.
   *
   * The first few central binomial coefficients starting at n = 0 are:
   *  1, 2, 6, 20, 70, 252, 924, 3432, 12870, 48620, ...;
   *
   * @param {Number} n
   * @returns {Number|BigInt}
   * @see binomialCoeff
   */
  binomialCoefCentral(n) {
    return Utils.nChooseK(2*n, n);
  },

  /**
   * Loads and return the content of a file from the resource dir given its
   * filename.
   *
   * @param {String} filename
   * @returns {String}
   */
  load(filename) {
    const { readFileSync } = require('fs');
    const { resolve } = require('path');
    const fpath = resolve(__dirname, '../res/' + filename);
    return readFileSync(fpath, {encoding:'utf8', flag:'r'});
  },

}

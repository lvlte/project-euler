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


module.exports = {

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
      return this.divisors(-n);

    if (n < 2)
      return [1];

    // Use an object for natural lexicographic indexing so that we can get the
    // divisors sorted in ascending order.
    let div = {1:1};

    const limit = Math.sqrt(n);
    let i = 1;

    while (i < limit) {
      if (this.remZero(n, ++i)) {
        div[i] = i;
        div[n/i] = n/i;
      }
    }

    return Object.values(div);
  }
}

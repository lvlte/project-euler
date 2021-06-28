/**
 * Provides functions related to sequences/series.
 *
 * @file sequence.js
 * @module lib/sequence.js
 * @author Eric Lavault {@link https://github.com/lvlte}
 * @license MIT
 */

let Sequence;
module.exports = Sequence = {

  /**
   * A Collatz sequence is defined for the set of positive integers, given n :
   *  n → n/2     if n is even
   *  n → 3n + 1  if n is odd
   *
   * @param {Number} n
   * @returns {Array}
   */
  collatz(n) {
    let c = [n];
    while (n !== 1) {
      c.push(n = n % 2 ? 3*n+1 : n/2);
    }
    return c;
  }

}

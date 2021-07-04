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
   *
   *  n → n/2     if n is even
   *  n → 3n + 1  if n is odd
   *
   * The conjecture of Collatz states that no matter the value of n the sequence
   * will always reach 1.
   *
   * @param {number} n
   * @returns {array} An array containing the collatz sequence from n to 1.
   */
  collatz(n) {
    let c = [n];
    while (n !== 1) {
      c.push(n = n % 2 ? 3*n+1 : n/2);
    }
    return c;
  },

  /**
   * Generates a Fibonacci sequence given a and b (both default to 1).
   *
   * @param {(number|bigint)} [a=1]
   * @param {(number|bigint)} [b=1]
   * @yields {(number|bigint)}
   */
  * fibonnaci(a=1, b=1) {
    yield a;
    yield b;
    if (typeof b === 'bigint') {
      while (true) {
        [a, b] = [b, a+b];
        yield b;
      }
    }
    else {
      let c;
      while ((c=a+b) < Number.MAX_SAFE_INTEGER) {
        [a, b] = [b, c];
        yield b;
      }
    }
  }
}

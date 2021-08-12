/**
 * Provides functions related to sequences/series.
 *
 * @file sequence.js
 * @module lib/sequence.js
 * @author Eric Lavault {@link https://github.com/lvlte}
 * @license MIT
 */

const { remZero } = require('./math');
const { totatives } = require('./prime');

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
  },

  /**
   * Generates the Farey sequence of order n (including 0 and 1), that is the
   * sequence of completely reduced fractions a/b between 0 and 1 which when in
   * lowest terms have their denominators less than or equal to n, arranged in
   * increasing order.
   *
   * Fractions are stored as [a,b] referring to a/b, with 0 <= a <= b <= n.
   *
   * @param {number} order
   * @returns {array} An array of 2-elements arrays [ [a,b], ...]
   */
  farey (order) {
    const F1 = [[0,1], [1,1]];
    const F2 = [[0,1], [1,2], [1,1]];
    const F3 = [[0,1], [1,3], [1,2], [2,3], [1,1]];
    let F = [F1, F2, F3];

    if (order <= F.length || !order)
      return F[order-1];  // ↳ throw error if order is undefined

    // We can relate the lengths of Fn and Fn−1 using Euler's totient function,
    // that is : |Fn| = |Fn-1| + φ(n).

    // Fn contains all of the members of Fn−1 and also contains an additional
    // fraction for each number that is less than n and coprime to n.

    let Fn = [...F[F.length-1]];
    for (let i=F.length; i<order; i++) {
      const n = i + 1;
      Fn.push(...totatives(n).map(t => [t, n]));
    }

    return Fn.sort((a, b) => a[0]/a[1] - b[0]/b[1]);
  },

  /**
   * Returns the right neighbour of a/b in the Farey sequence of the given order
   * as an array [c, d] referring to c/d.
   *
   * @param {number} a
   * @param {number} b
   * @param {number} order
   * @returns {array}
   */
  fareyRight (a, b, order) {
    // If a/b and c/d are neighbours in a Farey sequence, with a/b < c/d, then
    // their difference c/d - a/b = 1/bd.
    // If bc - ad = 1 with a < b and c < d, then a/b and c/d will be neighbours
    // in the Farey sequence of order max(b,d).
    // bc - ad = 1
    //       c = (1 + ad)/b
    let c;
    let d = order+1;
    do c = (1 + a*--d)/b;
    while (!remZero(c, 1)); // c % 1 != 0
    return [c, d];
  },

  /**
   * Returns the left neighbour of c/d in the Farey sequence of the given order
   * as an array [a, b] referring to a/b.
   *
   * @param {number} c
   * @param {number} d
   * @param {number} order
   * @returns {array}
   */
  fareyLeft (c, d, order) {
    let a;
    let b = order+1;
    do a = (--b*c - 1)/d;
    while (!remZero(a, 1));
    return [a, b];
  }
}

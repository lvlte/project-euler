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
   * Generates Fibonacci-like integer sequences, given starting numbers a and b.
   *
   *  F(n) = F(n-1) + F(n-2) with F(0) = a and F(1) = b.
   *
   * @param {(number|bigint)} a
   * @param {(number|bigint)} b
   * @param {(number|bigint)} [limit=Infinity]
   * @yields {(number|bigint)}
   */
  * fibonnaciLike(a, b, limit=Infinity) {
    if ([typeof a, typeof b].some(type => type != 'number' && type != 'bigint'))
      throw TypeError('Function expects 2 arguments of type (number|bigint).');
    yield a;
    yield b;
    if (typeof a === 'number') {
      const limit1 = Math.min(limit, Number.MAX_SAFE_INTEGER);
      let next;
      while ((next=a+b) < limit1) {
        yield next;
        [a, b] = [b, next];
      }
    }
    [a, b] = [BigInt(b), BigInt(a) + BigInt(b)];
    while (b < limit) {
      yield b;
      [a, b] = [b, a+b];
    }
  },

  /**
   * Generates Fibonacci numbers.
   *
   *  F(n) = F(n-1) + F(n-2) with F(0) = 0 and F(1) = 1.
   *
   * @yields {(number|bigint)}
   */
  * fibonnaci() {
    yield* Sequence.fibonnaciLike(0, 1);
  },

  /**
   * Generates Lucas numbers,
   *
   *  L(n) = L(n-1) + L(n-2) with L(0) = 2 and L(1) = 1.
   *
   * @yields {(number|bigint)}
   */
  * lucas() {
    yield* Sequence.fibonnaciLike(2, 1);
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

    if (order <= 100) {
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
        // @todo implement min-priority queue to sort terms on the fly
        Fn.push(...totatives(n).map(t => [t, n]));
      }

      return Fn.sort((a, b) => a[0]/a[1] - b[0]/b[1]);
    }

    // The following is more efficient for big sequences

    let [a, b] = [0, 1];
    let [c, d] = [1, order];
    let Fn = [[a,b], [c,d]];
    do {
      Fn.push(Sequence.fareyNext(a, b, c, d, order));
      [a, b] = [c, d];
      [c, d] = Fn.last();
    }
    while (d !== 1);

    return Fn;
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
    while (!remZero(c, 1));
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
  },

  /**
   * Given the Farey pair a/b, c/d in the Farey sequence of order N, returns the
   * next fraction e/f in that sequence, represented as [e, f].
   */
  fareyNext(a, b, c, d, N) {
    // c/d is the mediant fraction between terms a/b and e/f.
    // Let k >= 1 such that k*c = a+e and k*d = b+f, with d+f > N.
    // Then, b+f <= b+N < b+f+d, which translates to :
    //  k*d <= b+N < k*d + d
    //  k <= (b+N)/d < k+1
    // Therefore, k = ⌊(b+N)/d⌋
    if (d <= 1)
      return false;
    const k = Math.floor((b+N)/d);
    return [k*c - a, k*d - b];
  },

  /**
   * Given the Farey pair c/d, e/f in the Farey sequence of order n, returns the
   * previous fraction a/b in that sequence, represented as [a, b].
   */
  fareyPrev(c, d, e, f, N) {
    // c/d is the mediant fraction between terms a/b and e/f.
    // Let k >= 1 such that k*c = a+e and k*d = b+f, with b+d > N.
    // Then, b+f <= f+N < b+f+d, which translates to :
    //  k*d <= f+N < k*d + d
    //  k <= (f+N)/d < k+1
    // Therefore, k = ⌊(f+N)/d⌋
    if (c < 1)
      return false;
    const k = Math.floor((f+N)/d);
    return [k*c - e, k*d - f];
  }

}

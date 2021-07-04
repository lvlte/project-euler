/**
 * Provides math functions related to combinatorics.
 *
 * @file combinatorics.js
 * @module lib/combinatorics.js
 * @author Eric Lavault {@link https://github.com/lvlte}
 * @license MIT
 */

const { factorial } = require('./math.js');

let Comb;

module.exports = Comb = {

  /**
   * The number of k-combinations that can be made from a given set S of n
   * elements.
   *
   * In other words, the number of ways to choose an (unordered) subset of k
   * elements (or k-combinations) from a fixed set of n elements.
   *
   * Also known as the Binomial Coefficient, which is the coefficient of the x^k
   * term in the polynomial expansion of the binomial power (1 + x)^n.
   *
   * @param {number} n
   * @param {number} k
   * @returns {(number|bigint)}
   */
  nChooseK(n, k) {
    if (typeof n != 'bigint' && n > 18 || typeof k != 'bigint' && k > 18) {
      n = BigInt(n);
      k = BigInt(k);
    }
    return factorial(n) / (factorial(k)*factorial(n-k));
  },

  /**
   * Generates every permutations of the given set elements.
   * This function uses Heap's algorithm to generate permutations recursively.
   *
   * Basically, in order to produce every possible permutation of the elements
   * exactly once, we perform the following repeatedly from i=[0 to n] (n being
   * the length of the set) :
   *
   * - Recursively generate the (n−1)! permutations of the first n−1 elements,
   *   adjoining the last element to each of these, generating all permutations
   *   that end with the last element.
   *
   * - Then if n is  odd, we switch the first element and the last one,
   *        if n is even, we switch the  i-th element and the last one.
   *
   * @param {array} set
   * @returns {array}
   */
  permute(set) {
    let perm = [];
    let n = set.length;
    const _permute = function (n, set, perm) {
      if (n === 1)
        return perm.push([...set]);
      for (let i=0; i<n; i++) {
        _permute(n - 1, set, perm);
        n % 2 && set.swap(0, n-1) || set.swap(i, n-1);
      }
    }
    _permute(n, set, perm);
    return perm;
  },

  /**
   * Lehmer code purpose is to encode each possible permutation of a sequence
   * of n numbers. It is useful in combinatorics as it provides a scheme for
   * indexing permutations lexicographically by creating and counting inversions
   * (ie. the inversion of a permutation measure how much a sequence is out of
   * its natural order).
   *
   * Returns the lehmer code as an array which also corresponds the right
   * inversion count of the given sequence.
   *
   * @see {@link https://en.wikipedia.org/wiki/Lehmer_code}
   * @param {array} seq
   * @return {array}
   */
  lehmerCode(seq) {
    let code = [...seq];
    for (let i=0; i<code.length; i++) {
      const x = code[i];
      for (let j=i+1; j<code.length; j++) {
        code[j] > x && code[j]--;
      }
    }
    return code;
  }

}

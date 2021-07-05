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
  },

  /**
   * Stirling number of the second kind / Stirling partition number.
   *
   * Counts the number of ways to partition a set of n objects into exactly k
   * non-empty subsets.
   *
   * @param {number} n
   * @param {number} k
   * @returns {number}
   */
  stirling2(n, k) {
    if (k === 1 || n === k)
      return 1;
    if (k === 0)
      return 0;
    return Comb.stirling2(n-1, k-1) + k*Comb.stirling2(n-1, k);
  },

  /**
   * Bell number
   *
   * The Bell number Bn counts the number of different ways to partition a set
   * of n objects, which is also the number of equivalence relations on it.
   *
   * @param {number} n
   * @returns {number}
   */
  bell(n) {
    let Bn = 0;
    for (let k=0; k<=n; k++)
      Bn += Comb.stirling2(n, k);
    return Bn;
  },

  /**
   * Recursive function that generates restrited growth strings in lexicographic
   * order. Used for creating set partitions.
   *
   * Nb. They are called "strings" but each string is represented as an array.
   *
   * @see {@link : The Art Of Computer Programming - pre-fascicle 3b.pdf}
   *
   * @param {number} n
   * @returns {array}
   */
  growthStr(n) {
    // Based on "Algorithm H" (The Art Of Computer Programming pdf, page 26).
    if (n < 0)
      throw new RangeError('n must be a positive integer');
    if (n === 1)
      return [[0]];
    let output = [];
    let A = Comb.growthStr(n-1);
    // Foreach string from inner iteration, compute m, then for each integer j
    // in [0, m] append j to the string and append the string to the output.
    for (let i=0; i<A.length; i++) {
      let a = A[i];
      let m = 1 + Math.max(...a.slice(0, n-1));
      for (let j=0; j<=m; j++)
        output.push([...a, j]);
    }
    return output;
  },

  /**
   * Returns the partitions of the given set, that is the grouping of its
   * elements into non-empty disjoint subsets (in such a way that every element
   * is included in exactly one subset).
   *
   * If k is set, returns only partitions with k non-empty subsets.
   *
   * @see {@link : The Art Of Computer Programming - pre-fascicle 3b.pdf}
   *
   * @param {array} set
   * @param {boolean|number} k
   * @returns {array}
   */
  setPartitions (set, k=false) {
    // @see The Art Of Computer Programming - pre-fascicle 3b.pdf
    // -> `7.2.1.5. Generating all set partitions`

    const n = set.length;
    if (!n) {
      return [];
    }

    // The restricted growth string for a set of n elements is the n-characters
    // string which defines the partition of a set, where each i-th character
    // defines the set block i-th element of a set belongs to.
    let strings = Comb.growthStr(n);

    if (k !== false) {
      if (!Number.isInteger(k) || k > n || k < 0) {
        throw new RangeError('k must be in range [0, n] where `n = set.length`');
      }
      // Keep only partitions with k subsets, that is from the restricted growth
      // strings list generated, keep only those where each digit satisfies the
      // inequality `aᵢ < k` and where at least one digit statisfies `a = k-1`.
      strings = strings.filter(s => s.indexOf(k) === -1 && s.indexOf(k-1) !== -1);
    }

    // Translate each string into the corresponding partition for the given set.
    const partitions = strings.map(str => {
      const len = k || Math.max(...str) + 1;
      let P = Array.from(Array(len), () => []);
      for (let i=0; i<set.length; i++)
        P[str[i]].push(set[i]);
      return P;
    });

    return partitions;
  }

}

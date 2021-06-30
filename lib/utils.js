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
 * @param {number} start
 *  Starting number of the sequence.
 *
 * @param {number} [stop]
 *  Generate numbers up to, but not including this number.
 *
 * @param {number} [step=1]
 *  Difference between each number in the sequence.
 *
 * @return {(array|Object)}
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

/**
 * Defines swap() prototype.
 *
 * Swaps elements x and y in the given array|object.
 *
 * @param {number} x
 * @param {number} y
 * @return {(array|Object)}
 */
const _swapProto = {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function(x, y) {
    [this[x], this[y]] = [this[y], this[x]];
    return this;
  }
};

Object.defineProperty(Array.prototype, 'swap', _swapProto);
Object.defineProperty(Object.prototype, 'swap', _swapProto);

/**
 * Defines Object.head() prototype.
 *
 * Returns an object containing the n first elements of this object, iterating
 * over its keys.
 *
 * @param {number} n
 * @return {Object}
 */
const _headObjectProto = {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function (n=10) {
    let o = {};
    let i = 0;
    if (n < 0)
      return this.tail(n);
    for (let p in this) {
      o[p] = this[p];
      if (++i === n)
        break;
    }
    return o;
  }
}

/**
 * Defines Object.tail() prototype.
 *
 * Returns an object containing the n last elements of this object, iterating
 * over its keys.
 *
 * @param {number} n
 * @return {Object}
 */
const _tailObjectProto = {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function (n=10) {
    let o = {};
    const keys = Object.keys(this).slice(-Math.abs(n));
    for (let k=0; k<keys.length; k++) {
      o[keys[k]] = this[keys[k]];
    }
    return o;
  }
}

// head & tail are reserved.
Object.defineProperty(Object.prototype, '_head', _headObjectProto);
Object.defineProperty(Object.prototype, '_tail', _tailObjectProto);


let Utils;
module.exports = Utils = {

  /**
   * Returns a sequence of numbers starting from start (included, 0 by default),
   * and up to (excluding) stop, incrementing by the given step (1 by default).
   *
   * If stop and step are omitted, then the first argument is assumed to be stop
   * and start is assumed to be zero.
   *
   * @param {(number|bigint)} start
   * @param {(number|bigint)} stop
   * @param {(number|bigint)} step
   * @returns {array}
   */
  range(start, stop=start, step=1) {
    if (arguments.length === 1)
      start = typeof stop === 'bigint' ? 0n : 0;
    step = typeof start === 'bigint' ? BigInt(step) : step;
    let arr = [], j = start-step;
    while ((j+=step) < stop)
      arr.push(j);
    return arr;
  },

  /**
   * Returns the product of the given factors array.
   * @param {array} factors
   * @returns {number}
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
   * @param {array} summands Array of numbers to be summed, accept strings.
   * @returns {number}
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
   * @param {number} n numerator
   * @param {number} d denominator
   * @returns {boolean}
   */
  remZero(n, d, q) {
    // `(q=n/d) == Math.floor(q)` is much faster as than `n%d == 0` on V8 engine.
    return (q = n/d) == Math.floor(q);
  },

  /**
   * Returns the proper divisors of n (including 1, excluding n).
   *
   * @param {number} n The given number
   * @returns {array}
   */
  divisors(n) {
    if (n < 0)
      return Utils.divisors(-n);

    if (n <= 2)
      return [1];

    const limit = Math.sqrt(n);
    let div = [1];
    let i = 1;

    while (i < limit) {
      if (Utils.remZero(n, ++i)) {
        div.push(i, n/i)
      }
    }

    return div;
  },

  /**
   * Returns the product of all positive integers less than or equal to n.
   *
   * @param {(number|bigint)} n
   * @returns {(number|bigint)}
   */
  factorial(n) {
    const f = typeof n === 'bigint' || n > 18 ? Utils.bigFact : n => n<2 ? 1: n*f(n-1);
    return f(n);
  },

  /**
   * Returns the product of all positive integers less than or equal to n as a
   * BigInt.
   *
   * @param {(number|bigint)} n
   * @returns {bigint}
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
   * @param {number} n
   * @param {number} k
   * @returns {(number|bigint)}
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
   * @param {number} n
   * @returns {(number|bigint)}
   * @see binomialCoeff
   */
  binomialCoefCentral(n) {
    return Utils.nChooseK(2*n, n);
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
   * Loads and return the content of a file from the resource dir given its
   * filename.
   *
   * @param {string} filename
   * @returns {string}
   */
  load(filename) {
    const { readFileSync } = require('fs');
    const { resolve } = require('path');
    const fpath = resolve(__dirname, '../res/' + filename);
    return readFileSync(fpath, {encoding:'utf8', flag:'r'});
  },

}

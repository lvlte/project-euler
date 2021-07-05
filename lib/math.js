/**
 * Provides math functions.
 *
 * @file math.js
 * @module lib/math.js
 * @author Eric Lavault {@link https://github.com/lvlte}
 * @license MIT
 */

let _Math; // `Math` is reserved.

module.exports = _Math = {

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
   * Returns the reciprocal of the given number (undefined if n is zero).
   *
   * @param {number} n
   * @returns {(number|undefined)}
   */
  recip(n) {
    if (n === 0 || typeof n !== 'number')
      return undefined;
    return 1/n;
  },

  /**
   * Tests whether or not the remainder of the integer division n/d equals zero.
   *
   * @param {number} n numerator
   * @param {number} d denominator
   * @returns {boolean}
   */
  remZero(n, d, q) {
    // Nb. This is much faster than `n%d == 0` on V8 engine.
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
      return _Math.divisors(-n);

    if (n <= 2)
      return [1];

    const limit = Math.sqrt(n);
    let div = [1];
    let i = 1;

    while (i < limit) {
      if (_Math.remZero(n, ++i)) {
        div.push(i, n/i)
      }
    }

    return div;
  },

  /**
   * Greatest Common Divisor. The largest positive integer that divides both a
   * and b.
   *
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  gcd(a, b) {
    const f = (x, y) => y === 0 ? x : f(y, x % y);
    return f(Math.abs(a), Math.abs(b));
  },

  /**
   * Least Common Multiple. The smallest positive integer that is divisible by
   * both a and b.
   *
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  lcm(a, b) {
    return Math.abs(a)/_Math.gcd(a,b) * Math.abs(b);
  },

  /**
   * Represents the decimal (or binary, octal, any base) expansion of a/b using
   * euclidean division.
   *
   * Because this function is recursive, it may throw an error when reaching the
   * maximum call stack size.
   *
   * Returns an array containing : [
   *  0: integer part of the division
   *  1: array of decimals, if any, or undefined
   *  2: indexOf 1st cycle digit in decimals array if a/b is periodic, or undef.
   * ]
   *
   * @param {number} a
   * @param {number} b
   * @param {number} [base=10]
   * @returns {array}
   */
  decExp(a, b, base=10, exp=[], d={}, dlen=0) {
    if (a === 0)
      return [0,,];

    if (a === b)
      return [1,,];

    // d contains the dividends used so far and the corresponding index of its
    // euclidean division by b in the expansion array.
    d[a] = dlen++;

    if (a < b) {
      exp.push(0);
      return _Math.decExp(a*base, b, base, exp, d, dlen);
    }

    // Euclid's division lemma : a = bq + r
    const r = a % b;
    const q = (a - r) / b;

    // Decimal expansion (1st element is the integer part)
    exp.push(q);

    if (r === 0) // got a regular number (division terminates)
      return [exp[0], exp.slice(1),];

    // For the next iteration
    a = r*base;

    // Check if `a` has already been used as a dividend, in which case it means
    // the expansion is periodic.
    if (a in d)
      return [exp[0], exp.slice(1), d[a]-1];

    return _Math.decExp(a, b, base, exp, d, dlen);
  },

  /**
   * Returns the product of all positive integers less than or equal to n.
   *
   * @param {(number|bigint)} n
   * @returns {(number|bigint)}
   */
  factorial(n) {
    const f = typeof n === 'bigint' || n > 18 ? _Math.bigFact : n => n<2 ? 1: n*f(n-1);
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
  binomialCoef(n, k) {
    if (typeof n != 'bigint' && n > 18 || typeof k != 'bigint' && k > 18) {
      n = BigInt(n);
      k = BigInt(k);
    }
    return _Math.factorial(n) / (_Math.factorial(k)*_Math.factorial(n-k));
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
    return _Math.binomialCoef(2*n, n);
  }

}

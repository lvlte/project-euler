/**
 * Provides math functions.
 *
 * @file math.js
 * @module lib/math.js
 * @author Eric Lavault {@link https://github.com/lvlte}
 * @license MIT
 */

const { memoize } = require('./utils');
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
   * Memoized version of factorial(). Returns the product of all positive
   * integers less than or equal to n.
   *
   * @param {(number|bigint)} n
   * @returns {(number|bigint)}
   */
  mfact: memoize(function(n) {
    const f = typeof n === 'bigint' || n > 18 ? _Math.bigFact : n => n<2 ? 1: n*f(n-1);
    return f(n);
  }),

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
    return _Math.mfact(n) / (_Math.mfact(k)*_Math.mfact(n-k));
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
  },

  /**
   * Cantor's pairing function.
   *
   * Uniquely encode a given pair of natural numbers into a single natural
   * number.
   *
   * @see https://oeis.org/A277557
   *
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  cantorPairing(x, y) {
    return (x+y)*(x+y+1)/2 + y;
  },

  /**
   * Some polygonal numbers
   *
   * A polygonal number is a number represented as dots or pebbles arranged in
   * the shape of a regular polygon. The dots are thought of as alphas (units).
   * These are one type of 2-dimensional figurate numbers.
   *
   * Use quadratic formula for each polygonal to define the reverse functions :
   *  ax² + bx + c = 0 ⟹ x = (−b ± sqrt(b² − 4ac)) / 2a
   *
   * @see {045-Triangular_pentagonal_and_hexagonal.js}
   * @see {061-Cyclical_figurate_numbers.js}
   */

  triangular(n) {
    return n*(n+1)/2;
  },

  pentagonal(n) {
    return n*(3*n-1)/2;
  },

  hexagonal(n) {
    return n*(2*n-1);
  },

  heptagonal(n) {
    return n*(5*n-3)/2;
  },

  octagonal(n) {
    return n*(3*n-2);
  },

  triangRev(n) {
    return (-1 + Math.sqrt(1+8*n)) / 2;
  },

  pentaRev(n) {
    return (1 + Math.sqrt(1+24*n)) / 6;
  },

  hexaRev(n) {
    return (1 + Math.sqrt(1+8*n)) / 4;
  },

  heptaRev(n) {
    return (3 + Math.sqrt(9+40*n)) / 10;
  },

  octaRev(n) {
    return (2 + Math.sqrt(4+12*n)) / 6;
  },

  /**
   * Returns the continued fraction representation of the square root of n as
   * an array [a0, [...period]].
   *
   * eg. periodicSquareRoot(2) = [1, [2]]
   *     periodicSquareRoot(3) = [1, [1, 2]]
   *
   * @param {number} n
   * @returns {array}
   */
  periodicSquareRoot (n) {
    let expansions = {};
    let period = [];

    // The 1st term in the continued fraction representation of √n.
    const a0 = Math.floor(Math.sqrt(n));

    // To represent the first expansion, let consider inputs x and y :
    //  1: a0 + x/(√n-y) with x=1 and y=a0
    let [a, x, y] = [a0, 1, a0];

    // From there, we need to return the next terms an, xn, and yn :
    //  a[n-1] + x/(√n-y)  ⟹  an + (√n+yn)/xn

    // So given x, y, here is how we got the next terms :
    //  x/(√n-y) = x(√n+y)/((√n-y)(√n+y))
    //           = x(√n+y)/(√n²-y²)                 remarkable identity
    //           = (√n+y)/((n-y²)/x)                divide by x
    //           = (√n+y)/xn                        got xn = (n-y²)/x

    // From `xn` we can compute `an` which is the integer part of (√n+y)/xn, and
    // `yn` which can be expressed in terms of y, an, and xn :
    //   an = ⌊(√n+y)/xn⌋
    //   yn = -(y-an*xn)

    // Takes x,y and computes an, xn and yn as described above.
    const expand = (x, y) => {
      const xn = (n - y**2)/x;
      const an = Math.floor( (Math.sqrt(n) + y) / xn );
      const yn = -(y - an*xn);
      return [an, xn, yn];
    };

    // Store the continued fraction identites in a hashMap so that we can break
    // the expansion when encountering the same hash, which means the period is
    // about to cycle.
    expansions[[a, x, y].join('|')] = [a, x, y];

    while (true) {
      [a, x, y] = expand(x, y);
      const hash = [a, x, y].join('|');
      if (hash in expansions)
        break;
      expansions[hash] = [a, x, y];
      period.push(a);
    }

    return [a0, period];
  }

}

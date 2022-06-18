/**
 * Provides math functions.
 *
 * @file math.js
 * @module lib/math.js
 * @author Eric Lavault {@link https://github.com/lvlte}
 * @license MIT
 */

const { range, type, count } = require('./utils');
let math; // `Math` is reserved.

// Define some well-known constants
const φ = (1 + Math.sqrt(5)) / 2;
const ψ = (1 - Math.sqrt(5)) / 2;
const δₛ = 1 + Math.SQRT2;

module.exports = math = {

  /**
   * Golden ratio (φ)
   *
   *  φ = (a + b) / a = a / b
   */
  PHI: φ, φ,

  /**
   * Golden ratio conjugate (ψ)
   *
   *  ψ = 1 - φ = -1 / φ
   */
  PSI: ψ, ψ,

  /**
   * Silver ratio (δₛ)
   *
   *  δₛ = (2a + b) / a = a / b
   */
  DELTA_S: δₛ, δₛ,

  /**
   * Returns the n-th Fibonacci number, given n.
   *
   * @param {number} n
   * @returns {(number|BigInt)}
   */
  fib(n) {
    // First few Fibonacci numbers.
    const first = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];
    if (n < first.length)
      return first[n];

    // Create or reuse internal cache. We decide whether or not to use BigInt
    // based on the value of n, knowing that f(79) > Number.MAX_SAFE_INTEGER.
    const T = n < 79 ? Number : BigInt;
    const cacheInit = (Fn, n) => [n, T(Fn)];
    math.fib.cache = math.fib.cache ?? {};
    math.fib.cache[T.name] = math.fib.cache[T.name]?? first.mapToObj(cacheInit);

    // F[n] maps n to f(n).
    const F = math.fib.cache[T.name];
    const TWO = T(2);

    /**
     * Computes Fibonacci numbers recursively (with memoization).
     *
     * This method relies on identities derived from the following closed-form
     * expression for the Fibonacci numbers (matrix representation) :
     *
     *    [ 1  1 ]ⁿ       [ Fₙ₊₁   Fₙ  ]
     *    [ 1  0 ]    ⁼   [  Fₙ   Fₙ₋₁ ]
     *
     * which allows to compute f(n) in O(log(n)) arithmetic operations and in
     * time O(M(n)log(n)), where M(n) is the time for the multiplication of two
     * numbers of n digits.
     *
     * https://en.wikipedia.org/wiki/Fibonacci_number#Matrix_form
     */
    function f(n) {
      if (!(n in F)) {
        const k = Math.ceil(n/2);
        if ((n & 1) === 0)
          F[n] = (TWO*f(k-1) + f(k)) * f(k);
        else
          F[n] = f(k)*f(k) + f(k-1)*f(k-1);
      }
      return F[n];
    }

    return f(n);

    // Nb. the following works only for n <= 70 (above that value we would need
    // bigint to represent Fₙ without loosing precision, but we precisely can't
    // represent φⁿ and √5 with bigint..), and is not faster than the method
    // used above :
    //  Fₙ = (φⁿ - ψⁿ) / √5, and ψⁿ/√5 < 1/2 for any n >= 0
    //  Fₙ = ⌊ φⁿ/√5 ⌉           (rounded)
    //  Fₙ = ⌊ φⁿ/√5 + 1/2 ⌋     (floored)
  },

  /**
   * Returns the product of the given factors array.
   *
   * Nb. An empty product (ie. with no factors) is by convention equal to the
   * multiplicative identity, which is 1.
   *
   * @param {array} factors
   * @returns {number}
   */
  product(factors) {
    let p = typeof factors[0] === 'bigint' ? 1n : 1;
    for (let i=0; i<factors.length; i++)
      p *= factors[i];
    return p;
  },

  /**
   * Returns the total sum of the given summands.
   *
   * @param {Iterable<(number|string)>} summands
   * @returns {number}
   */
  sum(summands) {
    let s = 0;
    for (const n of summands)
      s += +n;
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
   * Returns the quotient and remainder from the Euclidean division n/d.
   *
   * @param {number} n
   * @param {number} d
   * @returns {array} [quotient, remainder]
   */
  divRem(n, d) {
    const r = n%d;
    return [(n-r)/d, r];
  },

  /**
   * Returns the divisors of n.
   *
   * Since the number 0 has an infinity of divisors, returns an empty array if
   * n equals zero.
   *
   * @param {number} n Must be an integer.
   * @param {boolean} [proper=false] If true, return only the proper divisors.
   * @returns {array}
   */
  divisors(n, proper=false) {
    if (n < 0)
      return math.divisors(-n, proper);

    if (n == 0)
      return [];

    const div = new Set([1, n]);

    if (n > 3) {
      const limit = Math.sqrt(n);
      let k = 2, d = 1;

      if (math.remZero(n, 2)) {
        k = 1;
        d = 2;
        div.add(2);
        div.add(n/2);
      }

      while ((d += k) <= limit) {
        if (math.remZero(n, d)) {
          div.add(d);
          div.add(n/d);
        }
      }
    }

    if (proper)
      div.delete(n);

    return [...div];
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
    return Math.abs(a)/math.gcd(a,b) * Math.abs(b);
  },

  /**
   * Returns the Least Common Multiple of the first n natural numbers.
   *
   * @param {number} n
   * @returns {number}
   */
  lcm1n(n) {
    const { iterPrimes } = require('./prime');
    let lm = 1;
    for (const prime of iterPrimes(n+1)) {
      let p = prime;
      let m;
      while (p <= n) {
        m = p;
        p *= prime;
      }
      lm *= m
    }
    return lm;
  },

  /**
   * Represents the decimal (or binary, octal, any base from 2 to 10) expansion
   * of a/b using euclidean division.
   *
   * Because this function is recursive, it may throw an error when reaching the
   * maximum call stack size.
   *
   * Returns an array containing : [
   *  0: integer part of the division
   *  1: array of decimals (if any, or an empty array)
   *  2: indexOf 1st cycle digit in decimals array if a/b is periodic, or undef.
   * ]
   *
   * @param {number} a
   * @param {number} b
   * @param {number} [base=10]
   * @returns {array}
   */
  decExp(a, b, base=10, exp=[], d={}, dlen=0) {
    if (base < 2 || base > 10)
      throw new RangeError('Unsupported base. Must be in range [2, 10]');

    if (a === 0)
      return [0, [],];

    if (a === b && dlen === 0)
      return [1, [],];

    // d contains the dividends used so far and the corresponding index of its
    // euclidean division by b in the expansion array.
    d[a] = dlen++;

    if (a < b) {
      exp.push(0);
      return math.decExp(a * base, b, base, exp, d, dlen);
    }

    // Euclid's division lemma : a = bq + r
    const r = a % b;
    const q = (a - r) / b;

    // Decimal expansion (1st element is the integer part)
    exp.push(+q.toString(base));

    if (r === 0) {
      // got a regular number (division terminates)
      return [exp[0], exp.slice(1),];
    }

    // For the next iteration
    a = r * base;

    // Check if `a` has already been used as a dividend, in which case it means
    // the expansion is periodic.
    if (a in d)
      return [exp[0], exp.slice(1), d[a] - 1];

    return math.decExp(a, b, base, exp, d, dlen)
  },

  /**
   * Returns the factorial of a non-negative integer n, that is, the product of
   * all positive integers less than or equal to n.
   *
   * @param {(number|bigint)} n
   * @returns {(number|bigint)}
   */
  factorial(n) {
    // Return precomputed value if any.
    const mf = math.mfact(n);
    if (mf !== false)
      return mf;

    if (n < 0)
      return undefined;

    if (n > math.mfact.maxB) {
      // Computes n! starting with f=k! for k=maxB.
      let k = math.mfact.maxB;
      let f = math.mfact(k);

      while (++k <= n)
        f *= k;

      return f;
    }

    // Reaching this point means n is not a positive integer.
    return NaN;
  },

  /**
   * Subfactorial, or rencontres numbers, or derangements count : the number of
   * permutations of n elements with no fixed points.
   *
   * @param {(number|bigint)} n
   * @returns {(number|bigint)}
   * @see {@link https://oeis.org/A000166}
   */
  subFactorial(n) {
    // Euler proved the following recurrence relations :
    //  !n = (n-1)*(!(n-1) + !(n-2))
    //  !n = n*!(n-1) + (-1)^n

    // This allows to solve the problem in O(n) time using dynamic programming,
    // ie. from bottom up instead of recursively, keeping track of the preceding
    // terms !(n-x) as n is incremented.

    // Here we use the recurrence which has only one preceding term because it
    // means one single variable to track.

    // Determining which type (Number|BigInt) should be used.
    const T = globalThis[n > 18 ? 'BigInt' : type(n)];
    const ONE = T(1);

    if (n < 1) {
      return n == 0 ? ONE : undefined;
    }

    // Starting with s=!(n-1) for n=1, or !0 which equals to 1.
    let s = ONE;
    let k = ONE;

    do s = k*s + (-ONE)**k;
    while (++k <= n);

    return s;
  },

  /**
   * Returns the precomputed value of n! for any positive integer n less than or
   * equal to 5000, false otherwise.
   *
   * @param {(number|bigint)} n
   * @returns {(number|bigint|boolean)}
   */
  mfact: (function() {
    const cache = new Map([ [0, 1], [0n, 1n] ]);
    const maxN = 18; // 19! > Number.MAX_SAFE_INTEGER
    const maxB = 5000n;

    // Computes n! and cache intermediate values starting from f=k!
    const f = (n, k, f) => {
      while (++k <= n)
        cache.set(k, f *= k);
    };

    f(maxN, 0, 1);
    f(maxB, 0n, 1n);

    const cacheFn = n => {
      n = globalThis[n > 18 ? 'BigInt' : type(n)](n);
      return cache.has(n) && cache.get(n);
    };

    cacheFn.maxN = maxN;
    cacheFn.maxB = maxB;

    return cacheFn;
  }()),

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
   * @param {(number|bigint)} n
   * @param {(number|bigint)} k
   * @returns {(number|bigint)}
   */
  binomialCoef(n, k) {
    const T = globalThis[type(n)];
    if (n < 0 || k < 0 || k > n)
      return T(0);
    if (k == 0 || k == n)
      return T(1);
    if (T === Number && n > 18) {
      n = BigInt(n);
      k = BigInt(k);
    }
    return math.factorial(n) / (math.factorial(k)*math.factorial(n-k));
  },

  /**
   * Returns the nth central binomial coefficient, that is, the particular
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
    return math.binomialCoef(2*n, n);
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
   * Solves a quadratic equation of the form ax² + bx + c = 0 for x ∈ ℝ, given
   * a, b, and c.
   *
   * Returns the two solutions as [x1, x2], which may or may not be distinct.
   *
   * @param {number} a
   * @param {number} b
   * @param {number} c
   * @returns {array}
   */
  quadraticRoots(a, b, c) {
    const Δ = b*b - 4*a*c;
    if (Δ < 0)
      return [undefined, undefined];
    const r = Math.sqrt(Δ);
    const aa = 2*a;
    return [(-b-r)/aa, (-b+r)/aa];
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
  periodicSquareRoot(n) {
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
  },

  /**
   * Returns the first `maxExp` expansions of the square root of n as an array
   * of the continued fraction, ie. with p/q as [p, q].
   *
   * `maxExp` defaults to the period length of the fraction representation.
   *
   * @param {number} n
   * @param {number} [maxExp]
   * @returns {Array.<[BigInt, BigInt]>}
   */
  sqrtExpansions(n, maxExp) {
    if (Number.isNaN(n) || n<0)
      throw 'n must be a positive integer or reciprocal';

    if (!Number.isInteger(n)) {
      const r = math.recip(n);
      if (Number.isInteger(r))
        return math.sqrtExpansions(r, maxExp).map(([p,q]) => [q,p]);
      throw 'n must be a positive integer or reciprocal';
    }

    if (math.isSquare(n))
      return [[Math.sqrt(n), 1]];

    let [a, period] = math.periodicSquareRoot(n);
    period = period.map(BigInt);
    maxExp = maxExp || period.length;

    const a0 = BigInt(a);
    const a1 = period[0];
    const a2 = period.length > 1 ? period[1] : period[0];

    // s0: a0
    // s1: a0 + 1/a1
    // s2: a0 + 1/(a1+1/a2)
    let S = [[a0, 1n], [a0*a1+1n, a1], [a0*(a1*a2+1n)+a2, a1*a2+1n]];

    if (maxExp < 4)
      return S.slice(0, maxExp);

    // Expand
    let i = 2;
    while (++i < maxExp) {
      const [j1, j2] = [i-1, i-2];
      const k = period[j1 % period.length];
      S[i] = [
        k*S[j1][0] + S[j2][0], // numerator
        k*S[j1][1] + S[j2][1]  // denominator
      ];
    }

    return S;
  },

  /**
   * Returns the square root of n, floored (the greatest integer less than or
   * equal to the square root of n).
   *
   * @param {bigint} n
   * @returns {bigint}
   */
  sqrtBig(n) {
    if (n < Number.MAX_SAFE_INTEGER)
      return BigInt(Math.floor(Math.sqrt(Number(n))));

    let x;
    let y = ((BigInt(Number.MAX_SAFE_INTEGER) >> 2n) << 1n) - 2n;

    while ((x !== y && x !== (y - 1n))) {
      x = y;
      y = ((n / x) + x) >> 1n;
    }

    return x;
  },

  /**
   * Squares hash map
   */
  squaresHTmax: 10**5,
  squaresHT: range(10**5).mapToObj(n => [n*n, n]),

  /**
   * Returns whether or not n is a square.
   *
   * @param {(number|bigint)} n
   * @returns {boolean}
   */
  isSquare(n) {
    if (Number.isNaN(n) || !Number.isInteger(n) && typeof n != 'bigint')
      return false;
    if (n < math.squaresHTmax)
      return n in math.squaresHT;
    if (n < Number.MAX_SAFE_INTEGER)
      return Number.isInteger(Math.sqrt(Number(n)));
    n = BigInt(n);
    return math.sqrtBig(n)**2n === n;
  },

  /**
   * Pell's equation, also called the Pell–Fermat equation, is any Diophantine
   * equation of the form x² - ny² = 1, where n is a given positive nonsquare
   * integer, and where integer solutions are sought for x and y.
   *
   * Computing the continued fraction expansion of the square root of n, each
   * successive convergent is tested until a solution is found.
   *
   * The `maxExp` parameter can be adjusted to find solutions if none is found,
   * it defaults to 80, which is sufficient to yield all fundamental solutions
   * for n <= 1000.
   *
   * @param {number)} n
   * @param {array} [maxExp=20]
   * @returns {Array.<[BigInt, BigInt]>}
   */
  Pell(n, maxExp=80) {
    if (!(n > 1) || math.isSquare(n))
      return undefined;
    let x, y;
    const S = math.sqrtExpansions(n, maxExp);
    n = BigInt(n);
    for (let i=0; i<S.length; i++) {
      [x, y] = S[i];
      if (x**2n - n*y**2n === 1n)
        return [x, y]
    }
  },

  /**
   * The divisor function σₖ(n) or σ(k,n) for n an integer is defined as the sum
   * of the kth powers of the (positive integer) divisors of n, , including 1
   * and n.
   *
   * @param {number} k
   * @param {number} n
   * @returns {number}
   */
  sigmaDiv(k, n) {
    switch (k) {
      case 0:
        return math.sigma0(n);
      case 1:
        return math.sigma1(n);
      default:
        return math.sum(math.divisors(n).map(n => n**k));
    }
  },

  /**
   * Returns the number of divisors of n.
   */
  sigma0(n) {
    if (n == 1) return 1;
    const { primeFactors } = require('./prime');
    const exp = Object.values(count(primeFactors(n)));
    return exp.length ? exp.reduce((p, a) => p*(a+1), 1) : undefined;
  },

  /**
   * Returns the sum of the divisors of n.
   */
  sigma1(n) {
    return math.sum(math.divisors(n));
  },

  /**
   * Returns the reduced fraction of n/d as an array [n', d'].
   *
   * @param {number} n
   * @param {number} d
   * @returns {array}
   */
  fraction(n, d) {
    if (n == 0)
      return [0, 1];
    let div;
    while ((div = math.gcd(n, d)) > 1) {
      n /= div;
      d /= div;
    }
    return [n, d];
  },

  /**
   * Helper for adding two fractions. The resulting fraction is reduced (written
   * in lowest terms).
   *
   * @param {array} fraction1 a/b as [a, b]
   * @param {array} fraction2 c/d as [c, d]
   * @returns {array} p/q as [p, q]
   */
  addF([a, b], [c, d]) {
    return b == d ? math.fraction(a+c, b) : math.fraction(a*d+c*b, b*d);
  },

  /**
   * Solves a system of linear equations, represented by the given matrix M, by
   * performing Gaussian elimination algorithm, also known as row reduction.
   *
   * @param {array} M an augmented matrix
   * @returns {array} an array containing the set of solutions
   */
  rowReduct (M) {
    const m = M.length;
    const n = M[0].length;

    // Find the kth pivot (or leading coefficient) with largest absolute value
    // and returns the corresponding row index, starting at row h.
    function findPivot(h, k) {
      let p = h;
      let max = Math.abs(M[h][k]);
      for (let i=h+1; i<m; ++i)
        if (Math.abs(M[i][k]) > max)
          max = Math.abs(M[p=i][k]);
      return p;
    }

    let h = 0; // pivot row
    let k = 0; // pivot column

    // 1. Convert the matrix into an upper triangular matrix (row echelon form).

    while (h < m && k < n) {
      let hPivot = findPivot(h, k);
      if (M[hPivot][k] == 0) {
        k++;
        continue;
      }
      M.swap(h, hPivot);
      for (let i=h+1; i<m; ++i) {
        const c = M[i][k] / M[h][k];
        M[i][k] = 0;
        for (let j=k+1; j<n; ++j) {
          M[i][j] = M[i][j] - c*M[h][j];
          if (M[i][j] != 0 && Math.abs(M[i][j]) < 1e-15)
            M[i][j] = 0; // assume this is a roundoff error
        }
      }
      h++;
      k++;
    }

    // 2. Solve the system by back substitution so that all leading coefficients
    // are 1, and for every column containing a leading coefficient, all other
    // entries are zero (reduced row echelon form).

    for (let i=m-1, k=n-1; i>=0; --i) {
      if (M[i][i] == 0)
        continue;
      const c = M[i][k] / M[i][i];
      for (let j=i-1; j>=0; --j) {
        M[j][k] = M[j][k] - c*M[j][i];
        M[j][i] = 0;
      }
      M[i][k] = c;
      M[i][i] = 1;
    }

    return M.map(r => r[n-1]);
  },

  /**
   * Precalculates 1 / Math.log(b) for base 3 to 9.
   * Used in Math.logb().
   */
  baseLogRecip: [3,4,5,6,7,8,9].mapToObj(base => [base, 1/Math.log(base)] ),

  /**
   * Returns the base b logarithm of x.
   *
   * @param {number} x
   * @param {number} b
   * @returns {number}
   */
  logb(x, b, check=true) {
    let y = Math.log(x) * (math.baseLogRecip[b] || 1/Math.log(b));
    if (check && b**y !== x) {
      const Y = Math.round(y);
      if (b**Y === x)
        y = Y;
    }
    return y;
  },

  /**
   * Returns the nth root of x.
   *
   * @param {number} x
   * @param {number} n
   * @returns {number}
   */
  nthRoot(x, n) {
    if (x < 0) {
      x = Math.abs(x);
      return n%2 ? -math.nthRoot(x, n) : math.nthRoot(x, n);
    }
    const root = Math.pow(x, 1/n);
    if (root**n !== x) {
      const rnd = Math.round(root);
      if (rnd**n === x) {
        return rnd;
      }
    }
    return root;
  },

  /**
   * Modular exponentiation (exponentiation over a modulus).
   *
   * Returns the remainder of `base` raised to the power `exp`, and divided by
   * `mod` (the modulus); that is, r = base^exp % m.
   *
   * @param {number} base An integer
   * @param {number} exp The exponent (positive integer)
   * @param {number} m The modulus (positive integer)
   * @returns
   */
  modPow(base, exp, m) {
    const n = base % m;
    if (n === 0)
      return 0;
    let r = 1;
    for (let i=1; i<=exp; i++)
      r = r*n % m;      // <- (X)%m each time so that r stays "small"
    return r;           // <- or we could have a (too) large r to mod here
  },

  /**
   * Returns the reduction of x modulo y, which will have the same sign as y and
   * magnitude less than abs(y).
   *
   * ie. in contrast with the remainder `%` operator, which always takes the
   * sign of the dividend : -1 % 10 = -1, while mod(-1, 10) = 9.
   *
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  mod(x, y) {
    return ((x % y) + y) % y;
  },

  signum(x) {
    if (x == 0)
      return 0;
    return x > 0 ? 1 : -1;
  }

}

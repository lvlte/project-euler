
/**
 * Provides functions related to prime numbers.
 *
 * @file primes.js
 * @module lib/prime.js
 * @author Eric Lavault {@link https://github.com/lvlte}
 * @license MIT
 */

require('./utils.js');

module.exports = {

  /**
   * Tests whether or not the given number n is a prime number.
   *
   * @param {Number} n
   * @returns {Boolean}
   */
  isPrime(n) {
    return n === this.leastFactor(n) && n != null;
  },

  /**
   * Prime factorization of n.
   *
   * @param {Number} n
   * @returns {Array} an array containing the prime factors of n.
   */
  primeFactors(n) {
    if (isNaN(n) || n > Number.MAX_SAFE_INTEGER || n % 1 || n*n < 2)
      return [];

    if (n < 0)
      return this.primeFactors(-n).map(n => -n);

    const minFactor = this.leastFactor(n, false);

    if (n === minFactor)
      return [n];

    return [minFactor, ...this.primeFactors(n / minFactor)];
  },

  /**
   * Least prime factor of n.
   *
   * @returns {Number|null} the smallest prime that divides n, n if n is prime, or
   * or null if n is not factorizable.
   */
  leastFactor(n, check=true) {
    if (check && (isNaN(n) || n > Number.MAX_SAFE_INTEGER || n % 1 || n*n < 2))
      return null;

    if (this.remZero(n, 2)) return 2;
    if (this.remZero(n, 3)) return 3;
    if (this.remZero(n, 5)) return 5;
    if (this.remZero(n, 7)) return 7;

    let i = 7;
    const limit = Math.sqrt(n);
    const incr = [4, 2, 4, 2, 4, 6, 2, 6];

    while (i<=limit) {
      for (let j=0; j<incr.length; j++) {
        if (this.remZero(n, i+=incr[j])) {
          return i;
        }
      }
    }

    return n;
  },

  /**
   * Tests whether or not the remainder of (n mod d) equals zero.
   *
   * @param {Number} n numerator
   * @param {Number} d denominator
   * @returns {Boolean}
   */
  remZero(n, d, q) {
    // `(q=n/d) == Math.floor(q)` is much faster as than `n%d == 0` on V8 engine.
    return (q = n/d) == Math.floor(q);
  },

  /**
   * Sieve of Eratosthenes algorithm.
   */
  sieve(n, multiples, primes, limit) {
    multiples[n] || (primes.push(n) && multiples.assignRange(n, limit, n));
  },

  /**
   * Returns an ordered set of prime numbers which values are below the given
   * limit.
   *
   * (max input supported: limit ~= 110 000 000)
   *
   * @param {Number} limit
   * @returns {Array}
   */
  getPrimes(limit) {
    let multiples = {1: 1};
    let primes = [];
    let n = 1;

    while (n < limit)
      this.sieve(++n, multiples, primes, limit);

    return primes;
  },

  /**
   * Returns the first N prime numbers.
   *
   * @param {Number} N The length of the sequence.
   * @returns {Array}
   */
  getNPrimes(N) {
    let multiples = {1: 1};
    let primes = [];

    // Approximative bounds for multiples
    const limit = N * Math.log(N) + 2 * N;

    let n = 1;
    while (primes.length < N)
      this.sieve(++n, multiples, primes, limit);

    return primes;
  }

}

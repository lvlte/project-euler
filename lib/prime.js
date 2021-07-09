
/**
 * Provides functions related to prime numbers.
 *
 * @file prime.js
 * @module lib/prime.js
 * @author Eric Lavault {@link https://github.com/lvlte}
 * @license MIT
 */

require('./utils.js');
const { remZero, gcd } = require('./math.js');

let Prime;
module.exports = Prime = {

  /**
   * Tests whether or not the given number n is a prime number.
   *
   * @param {number} n
   * @returns {boolean}
   */
  isPrime(n) {
    if (isNaN(n) || n % 1 || n < 2)
      return false;
    return n === Prime.leastFactor(n);
  },

  /**
   * Prime factorization of n.
   *
   * @param {number} n
   * @returns {array} an array containing the prime factors of n.
   */
  primeFactors(n) {
    if (isNaN(n) || n > Number.MAX_SAFE_INTEGER || n % 1 || n*n < 2)
      return [];

    if (n < 0)
      return Prime.primeFactors(-n).map(n => -n);

    const minFactor = Prime.leastFactor(n, false);

    if (n === minFactor)
      return [n];

    return [minFactor, ...Prime.primeFactors(n / minFactor)];
  },

  /**
   * Least prime factor of n.
   *
   * @returns {number} the smallest prime that divides n, n if n is prime, or
   * NaN if n is not factorizable.
   */
  leastFactor(n, check=true) {
    if (check && (isNaN(n) || n > Number.MAX_SAFE_INTEGER || n % 1 || n*n < 2))
      return NaN;

    if (remZero(n, 2)) return 2;
    if (remZero(n, 3)) return 3;
    if (remZero(n, 5)) return 5;
    if (remZero(n, 7)) return 7;

    let i = 7;
    const limit = Math.sqrt(n);
    const incr = [4, 2, 4, 2, 4, 6, 2, 6];

    while (i<=limit) {
      for (let j=0; j<incr.length; j++) {
        if (remZero(n, i+=incr[j])) {
          return i;
        }
      }
    }

    return n;
  },

  /**
   * Sieve of Eratosthenes algorithm.
   */
  sieve(n, multiples, primes, limit, step=n) {
    if (n in multiples)
      return false;
    primes.push(n) && multiples.assignRange(n**2, limit, step);
    return true;
  },
  sieve2(n, multiples, primes, limit, step=n) {
    if (n in multiples)
      return false;
    primes[n] = n;
    multiples.assignRange(n**2, limit, step);
    return true;
  },

  /**
   * Returns an ordered set of prime numbers for which all values are in the
   * given range, including range start and excluding range end. If `range` is
   * a number, returns all prime numbers up to but not including that limit.
   *
   * Returns an array by default (keyed=false), or an object with keys mapped
   * to values if `keyed` is true.
   *
   * (max input supported: range ~= 110 000 000)
   *
   * @param {(number|array)} [range=100] Range or limit for the prime numbers.
   * @param {boolean} [keyed=false] Determines the type of the output.
   * @returns {(array|Object)}
   */
  getPrimes(range=100, keyed=false) {
    const [start, end] = Array.isArray(range) ? range : [0, range];
    if (end <= 2 || start >= end)
      return keyed ? {} : [];

    let multiples = {}; // .assignRange(2, end, 2); n += 2 , odd
    let primes = keyed ? {2:2} : [2];
    let n = 1;

    if (start > 2) {
      primes = keyed ? {} : [];
      while ((n+=2) < start)
        Prime.sieve(n, multiples, [], end, 2*n);
      n -= 2;
    }

    const func = keyed ? Prime.sieve2 : Prime.sieve;

    while ((n+=2) < end)
      func(n, multiples, primes, end, 2*n);

    return primes;
  },

  /**
   * Returns the first N prime numbers.
   *
   * It returns an array by default (keyed=false), or an object with keys mapped
   * to values if `keyed` is true.
   *
   * @param {number} N The length of the sequence.
   * @param {boolean} [keyed=false] Determines the type of the output.
   * @returns {(array|Object)}
   */
  getNPrimes(N, keyed=false) {
    if (!N || N < 1)
      return keyed && {} || [];

    // Approximative bounds for multiples
    const limit = N * Math.log(N) + 2 * N;
    const func = keyed && Prime.sieve2 || Prime.sieve;

    let multiples = {};
    let primes = keyed && {2:2} || [2];

    let n = 1, p = 1;
    while (p < N)
      func(n+=2, multiples, primes, limit) && p++;

    return primes;
  },

  /**
   * Generates prime numbers in ascending order.
   *
   * @param {number} [limit=Number.MAX_SAFE_INTEGER]
   * @yields {number}
   */
  * iterPrimes(limit=Number.MAX_SAFE_INTEGER) {
    if (limit <= 2)
      return [];

    // Sieve algorithm limit (filling multiples takes time and has its limit).
    const sieveMax = Math.min(limit, 1_000_000);
    let multiples = {};
    yield 2;

    let n = 1;
    while ((n+=2) < sieveMax) {
      if (n in multiples)
        continue;
      multiples.assignRange(n**2, sieveMax, 2*n);
      yield n;
    }

    while (n < limit) {
      n = Prime.nextPrime(n);
      yield n;
    }
  },

  /**
   * Returns the smallest prime which is greater than n, or NaN if such number
   * is not representable.
   *
   * @param {number} n
   * @returns {number}
   */
  nextPrime(n) {
    if (isNaN(n) || !isFinite(n))
      return NaN;
    if (n < 2)
      return 2;
    n = Math.floor(n);
    for (let next=n+1+n%2; next<=Number.MAX_SAFE_INTEGER; next+=2) {
      if (Prime.isPrime(next))
        return next;
    }
    return NaN;
  },

  /**
   * Returns whether or not a and b are coprime (if the only positive integer
   * that evenly divides both of them is 1).
   *
   * One says also a is prime to b or a is coprime with b. Consequently, any
   * prime number that divides one of a or b does not divide the other.
   *
   * @param {number} a
   * @param {number} b
   * @returns {boolean}
   */
  coprime(a, b) {
    return gcd(a, b) === 1;
  }

}

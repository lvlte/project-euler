
/**
 * Provides functions related to prime numbers.
 *
 * @file prime.js
 * @module lib/prime.js
 * @author Eric Lavault {@link https://github.com/lvlte}
 * @license MIT
 */

require('./utils.js');
const { remZero, gcd, product, sum } = require('./math.js');
const { range } = require('./utils.js');

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
  sieve(n, multiples, primes, limit, step=n, add='push') {
    if (multiples[n])
      return false;
    primes[add](n);
    multiples.assignRange(n**2, limit, step);
    return true;
  },
  sieve2(n, multiples, primes, limit, step=n) {
    if (multiples[n])
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
   * (max input supported: range ~= 110 000 000)
   *
   * @param {(number|array)} [range=100] Range or limit for the prime numbers.
   * @param {boolean} [reversed=false] If true, the order of primes is reversed.
   * @returns {array}
   */
  getPrimes(range=100, reversed=false) {
    const [start, end] = Array.isArray(range) ? range : [0, range];
    if (end <= 2 || start >= end)
      return [];

    let multiples = [];
    let primes = [2];
    let n = 3;

    if (start > 2) {
      primes = [];
      while (n < start) {
        Prime.sieve(n, multiples, [], end, 2*n);
        n += 2;
      }
    }

    const stop = Math.ceil(Math.sqrt(end));
    const add = reversed ? 'unshift' : 'push';

    while (n < stop) {
      Prime.sieve(n, multiples, primes, end, 2*n, add);
      n += 2;
    }

    while (n < end) {
      if (!multiples[n])
        primes[add](n);
      n += 2;
    }

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
    let primes = keyed ? {2:2} : [2];

    let n = 3, p = 1;

    const stop = Math.ceil(Math.sqrt(limit));
    while (n < stop) {
      func(n, multiples, primes, limit, 2*n) && p++;
      n += 2;
    }

    const func2 = keyed ? n => primes[n] = n : n => primes.push(n);

    while (p < N) {
      if (!multiples[n])
        func2(n) && p++;
      n += 2;
    }

    return primes;
  },

  /**
   * Returns primes below the given limit as an hash array (keys map to values).
   *
   * @param {number} limit
   * @returns {array}
   */
  primesHashMap(limit) {
    let primes = Array(limit);
    let multiples = [];
    primes[2] = 2;

    let n = 3;
    const stop = Math.ceil(Math.sqrt(limit));

    while (n < stop) {
      Prime.sieve2(n, multiples, primes, limit, 2*n);
      n += 2;
    }

    while (n < limit) {
      multiples[n] || (primes[n] = n);
      n += 2;
    }

    return primes;
  },

  /**
   * Generates prime numbers in ascending order.
   *
   * @param {number} [limit=Number.MAX_SAFE_INTEGER]
   * @param {number} [sieveMax=Math.min(limit, 10**6)]
   * @yields {number}
   */
  * iterPrimes(limit=Number.MAX_SAFE_INTEGER, sieveMax=Math.min(limit, 10**8)) {
    if (limit <= 2)
      return;

    let multiples = [];
    yield 2;

    let n = 3;
    const step1 = Math.ceil(Math.sqrt(sieveMax));

    while (n < step1) {
      if (!multiples[n]) {
        multiples.assignRange(n**2, sieveMax, 2*n);
        yield n;
      }
      n += 2;
    }

    while (n < sieveMax) {
      if (!multiples[n])
        yield n;
      n += 2;
    }

    while (n < limit) {
      if (Prime.isPrime(n))
        yield n;
      n += 2;
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
  },

  /**
   * Prime-counting static helper
   */
  π: {
    10: 4,
    100: 25,
    1000: 168,
    10000: 1229,
    100000: 9592,
    1000000: 78498,
    10000000: 664579,
    100000000: 5761455,
    1000000000: 50847534,
    10000000000: 455052511,
    100000000000: 4118054813,
    1000000000000: 4118054813,
    10000000000000: 37607912018,
    100000000000000: 346065536839,
    1000000000000000: 3204941750802,
    10000000000000000: 29844570422669,
    100000000000000000: 279238341033925,
    1000000000000000000: 2623557157654233,
    10000000000000000000: 24739954287740860n,
    100000000000000000000: 234057667276344607n,
    1000000000000000000000: 2220819602560918840n,
    10000000000000000000000: 21127269486018731928n,
    100000000000000000000000: 201467286689315906290n,
    1000000000000000000000000: 1925320391606803968923n,
    10000000000000000000000000: 18435599767349200867866n,
    100000000000000000000000000: 176846309399143769411680n
  },

  /**
   * Returns the number of primes less than or equal to x.
   *
   * x must be a power of ten in the range [10^1, 10^25], otherwise the function
   * returns `undefined`.
   *
   * @see {@link https://primes.utm.edu/howmany.html|How Many Primes are There?}
   * @param {(number|bigint|string)} x
   * @returns {(number|bigint|undefined)}
   */
  primeCount(x) {
    return Prime.π[x];
  },

  /**
   * Euler's Totient function (φ read "phi").
   *
   * Counts the number of totatives of n, that is the number of numbers less
   * than n which are relatively prime to n.
   *
   * It is a multiplicative function, meaning that if two numbers m and n are
   * relatively prime, then φ(mn) = φ(m)*φ(n).
   *
   * @param {number} n
   * @returns {number}
   */
  totient(n) {
    if (n == 0)
      return 1;
    if (Prime.isPrime(n))
      return n - 1;
    // Using Euler's product formula φ(n) = n*∏[p|n](1-1/p)
    const terms = [...new Set(Prime.primeFactors(n))].map(p => (p-1)/p);
    return product([n, ...terms]);
  },

  /**
   * Returns the totatives of n, that is the number of numbers less than n which
   * are relatively prime to n.
   *
   * @param {number} n
   * @returns {array}
   */
  totatives(n) {
    if (Prime.isPrime(n))
      return range(1, n);
    let t = [];
    for (let i=1; i<n; i++)
      if (Prime.coprime(n, i))
        t.push(i);
    return t;
  },

  /**
   * Returns the summatory totient of n : Σ(m=1,n)φ(m)
   *
   * @param {number} n
   * @returns {number}
   */
  summatoryTotient(n) {
    let sumT = 0;
    let m = 0;

    let func = Prime.totient;

    if (n >= 10**7) {
      const primes = Prime.primesHashMap(n);
      func = (n) => {
        if (primes[n])
          return n-1;
        const terms = [...new Set(Prime.primeFactors(n))].map(p => (p-1)/p);
        return product([n, ...terms]);
      };
    }

    while (++m <= n)
      sumT += func(m);

    return sumT;
  },

  /**
   * Sum of the distinct primes dividing n.
   *
   * @param {number} n
   * @returns {number}
   */
  sopf(n) {
    if (Prime.isPrime(n))
      return n;
    return sum([...new Set(Prime.primeFactors(n))]);
  },

  /**
   * The radical of n, rad(n), is the product of distinct prime factors of n.
   *
   * @param {number} n
   * @returns {number} the product of distinct prime factors of n.
   */
  rad(n) {
    return product([...new Set(Prime.primeFactors(n))]);
  }


}

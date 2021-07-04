/**
 * Problem 27 - Quadratic primes
 *
 * @see {@link https://projecteuler.net/problem=27}
 *
 * Euler discovered the remarkable quadratic formula :
 *
 *                             n² + n + 41
 *
 * It turns out that the formula will produce 40 primes for the consecutive
 * integer values 0 ≤ n ≤ 39.
 *
 * However, when n = 40, 40² + 40 + 41 = 40(40+1) + 41 is divisible by 41, and
 * certainly when n = 41, 41² + 41 + 41 is clearly divisible by 41.
 *
 * The incredible formula n² -79n + 1601 was discovered, which produces 80
 * primes for the consecutive values 0 ≤ n ≤ 79.
 * The product of the coefficients, −79 and 1601, is −126479.
 *
 * Considering quadratics of the form :
 *
 *              n² + an + b, where |a| < 1000 and |b| ≤ 1000
 *
 * where |n| is the modulus/absolute value of n (e.g. |11| = 11 and |−4| = 4)
 *
 * Find the product of the coefficients, a and b, for the quadratic expression
 * that produces the maximum number of primes for consecutive values of n,
 * starting with n = 0.
 */

const { getPrimes, isPrime } = require('../../lib/prime');

this.solve = function () {
  // The first thing is that n² + an + b must produce a prime starting with n=0,
  // so b must be a prime.

  // Considering n² + an + b where |a| < 1000 and |b| ≤ 1000, we can already
  // collect prime candidates for b.
  const limit = 1000;
  const primes = getPrimes(limit+1);

  // Apply the formula
  const quadratic = (n, a, b) => n*n + a*n + b;

  // Store the expression that produces the maximum number of primes for
  // consecutive values of n.
  let maxExpr = { a:null, b:null, count:0 };

  // Loop for |a| < 1000 and combine with the possible values for b (primes).
  for (let a=-limit+1; a<limit; a++) {
    primes.forEach(b => {
      let n = 1; // we already know it yields a prime for n=0
      while (isPrime(quadratic(n, a, b)))
        n++;
      if (n > maxExpr.count)
        maxExpr = { a, b, count:n };
    });
  }

  return maxExpr.a * maxExpr.b;
}

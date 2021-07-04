/**
 * Problem 10 - Summation of primes
 *
 * @see {@link https://projecteuler.net/problem=10}
 *
 * The sum of the primes below 10 is 2 + 3 + 5 + 7 = 17.
 *
 * Find the sum of all the primes below two million.
 */

const { iterPrimes } = require('../../lib/prime.js');

this.solve = function () {
  const limit = 2_000_000;
  let sum = 0;

  for (const prime of iterPrimes(limit))
    sum += prime;

  return sum;
}

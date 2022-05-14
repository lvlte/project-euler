/**
 * Problem 3 - Largest prime factor
 * @see {@link https://projecteuler.net/problem=3}
 *
 * The prime factors of 13195 are 5, 7, 13 and 29.
 *
 * What is the largest prime factor of the number 600851475143 ?
 */

const { primeFactors } = require('../../lib/prime.js');

this.solve = function () {
  const n = 600851475143;
  const primes = primeFactors(n);
  return primes.last();
}

/**
 * Problem 3 - Largest prime factor
 * @see {@link https://projecteuler.net/problem=3}
 *
 * The prime factors of 13195 are 5, 7, 13 and 29.
 *
 * What is the largest prime factor of the number 600851475143 ?
 */
this.solve = function (n=600851475143) {
  const P = require('../lib/prime.js');
  const primes = P.primeFactors(n);
  return primes[primes.length-1];
}

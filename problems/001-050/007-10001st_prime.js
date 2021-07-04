/**
 * Problem 7 - 10001st prime
 *
 * @see {@link https://projecteuler.net/problem=7}
 *
 * By listing the first six prime numbers: 2, 3, 5, 7, 11, and 13, we can see
 * that the 6th prime is 13.
 *
 * What is the 10 001st prime number ?
 */
this.solve = function () {
  const P = require('../../lib/prime.js');

  const len = 10001;
  const primes = P.getNPrimes(len);

  return primes[len-1];
}

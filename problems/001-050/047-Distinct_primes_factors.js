/**
 * Problem 47 - Distinct primes factors
 *
 * @see {@link https://projecteuler.net/problem=47}
 *
 * The first two consecutive numbers to have two distinct prime factors are:
 *      14 = 2 × 7
 *      15 = 3 × 5
 *
 * The first three consecutive numbers to have three distinct prime factors are:
 *      644 = 2² × 7 × 23
 *      645 = 3 × 5 × 43
 *      646 = 2 × 17 × 19
 *
 * Find the first four consecutive integers to have four distinct prime factors
 * each. What is the first of these numbers ?
 */

const { product } = require('../../lib/math');
const { getNPrimes, primeFactors } = require('../../lib/prime');

this.solve = function () {
  // Find D consecutive integers to have D distinct prime factors (brute force)

  const D = 4;
  const min = product(getNPrimes(D));

  let n = min-2;
  let matches = [];

  while (matches.length != D) {
    matches = [];
    for (let i=0; i<D; n++ && i++) {
      const distF = new Set(primeFactors(n)); // distinct prime factors
      if (distF.size === D)
        matches.push(n);
      else {
        n++;
        break;
      }
    }
  }

  return matches[0];
}

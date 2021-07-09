/**
 * Problem 41 - Pandigital prime
 *
 * @see {@link https://projecteuler.net/problem=41}
 *
 * We shall say that an n-digit number is pandigital if it makes use of all the
 * digits 1 to n exactly once. For example, 2143 is a 4-digit pandigital and is
 * also prime.
 *
 * What is the largest n-digit pandigital prime that exists ?
 */

const { range } = require('../../lib/utils');
const { permute } = require('../../lib/combinatorics');
const { isPrime } = require('../../lib/prime');

this.solve = function () {
  // We can easily create n-digit pandigital numbers by generating unique
  // permutations of the set [1 to n], and then just check if the given number
  // is a prime.

  const maxN = 9;
  let primes = [];

  for (let n=2; n<maxN; n++) {
    const digits = range(1, n+1);
    const p = permute(digits);
    for (let i=0; i<p.length; i++) {
      const pandigital = +p[i].join('');
      if (isPrime(pandigital))
        primes.push(pandigital);
    }
  }

  return Math.max(...primes);
}

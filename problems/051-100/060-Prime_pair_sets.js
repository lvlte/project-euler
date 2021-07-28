/**
 * Problem 60 - Prime pair sets
 *
 * @see {@link https://projecteuler.net/problem=60}
 *
 * The primes 3, 7, 109, and 673, are quite remarkable. By taking any two primes
 * and concatenating them in any order the result will always be prime. For
 * example, taking 7 and 109, both 7109 and 1097 are prime. The sum of these
 * four primes, 792, represents the lowest sum for a set of four primes with
 * this property.
 *
 * Find the lowest sum for a set of five primes for which any two primes
 * concatenate to produce another prime.
 */

const { nkCombinations } = require('../../lib/combinatorics');
const { sum } = require('../../lib/math');
const { getPrimes, isPrime } = require('../../lib/prime');

this.solve = function () {
  // We need to generate prime pairs [a, b] and check whether or not it produces
  // another prime when concatenated.

  // Since we are asked to find a lowest sum for a set primes, we will generate
  // prime combinations in given (small) range, and increase it as necessary
  // until we find one or more set of five primes.

  // This is kind of brute force so it's probably not the best option for larger
  // prime sets.

  const setLen = 6;

  // Checks whether or not the given primes concatenate to produce another one.
  const primeConcat = (a, b) => isPrime(+(''+a+b)) && isPrime(+(''+b+a));

  // Checks whether or not p can be paired with every elements of the given set.
  const pairable = (set, p) => {
    for (let i=0; i<set.length; i++)
      if (!primeConcat(p, set[i]))
        return false;
    return true;
  }

  // Finding the lowest sum
  let i = 0; // range index
  let lowestSum = Infinity;
  const range = [1_000, 10_000, 50_000, 100_000]; // 0 to n

  while (lowestSum == Infinity) {
    const limit = range[i++];
    if (!limit)
      break; // need to increase max range

    const primes = getPrimes(limit);
    let pairs = {};

    // Create prime pairs
    nkCombinations(primes, 2).forEach(([a, b]) => {
      if (primeConcat(a, b)) {
        // Pair b with a. If a already has pair c, b must also be paired with c.
        if (a in pairs) {
          if (pairable(pairs[a], b))
            pairs[a].push(b);
        }
        else pairs[a] = [b];
        // Same conversely
        if (b in pairs) {
          if (pairable(pairs[b], a))
            pairs[b].push(a);
        }
        else pairs[b] = [a];
      }
    });

    // Now check for prime sets matching the required length.
    for (const p in pairs) {
      if (pairs[p].length != setLen-1)
        continue;
      const s = sum([+p, ...pairs[p]]);
      if (s < lowestSum) {
        // console.log([+p, ...pairs[p]], lowestSum);
        lowestSum = s;
      }
    }
  }

  return lowestSum;
}

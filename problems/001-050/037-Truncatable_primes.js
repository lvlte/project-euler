/**
 * Problem 37 - Truncatable primes
 *
 * @see {@link https://projecteuler.net/problem=37}
 *
 *
 * The number 3797 has an interesting property. Being prime itself, it is
 * possible to continuously remove digits from left to right, and remain prime
 * at each stage: 3797, 797, 97, and 7.
 *
 * Similarly we can work from right to left: 3797, 379, 37, and 3.
 *
 * Find the sum of the only eleven primes that are both truncatable from left to
 * right and right to left.
 *
 * NOTE: 2, 3, 5, and 7 are not considered to be truncatable primes.
 */

const { iterPrimes } = require('../../lib/prime');

this.solve = function () {
  const goal = 11;

  // Helpers, expects an array or string of digits
  const truncateLeft = digits => digits.slice(1);
  const truncateRight = digits => digits.slice(0, digits.length-1);

  // Keeping track of the primes we meet
  const primesHT = {};

  // Whether or not the given prime number is a "truncatable prime".
  const isTruncatable = n => {
    if (n < 10)
      return false;
    let l = String(n); // left to right string
    let r = l;         // right to left string
    while (l.length > 1) {
      l = truncateLeft(l);
      if (l in primesHT) {
        r = truncateRight(r);
        if (r in primesHT)
          continue;
      }
      return false
    }
    return true;
  };

  let sum = 0;
  let count = 0;

  for (const prime of iterPrimes()) {
    primesHT[prime] = prime;
    if (isTruncatable(prime)) {
      sum += prime;
      if (++count === goal)
        break;
    }
  }

  return sum;
}

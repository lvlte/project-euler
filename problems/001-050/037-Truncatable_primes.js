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

const { iterPrimes, isPrime } = require('../../lib/prime');
const { digits } = require('../../lib/utils');

this.solve = function () {
  const goal = 11;

  // Helpers, take an array of digits
  const truncateLeft = dig => dig.slice(1);
  const truncateRight = dig => dig.slice(0, dig.length-1);

  // Keeping track of the primes we meet
  let primesHT = {};

  // Whether or not n is a truncable prime
  const isTruncatable = n => {
    if (n < 10)
      return false;
    let l = digits(n, false); // left
    let r = l;                // right
    while (l.length > 1) {
      l = truncateLeft(l);
      if (l.join('') in primesHT) {
        r = truncateRight(r);
        if (r.join('') in primesHT)
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

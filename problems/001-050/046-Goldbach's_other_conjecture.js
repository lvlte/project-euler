/**
 * Problem 46 - Goldbach's other conjecture
 *
 * @see {@link https://projecteuler.net/problem=46}
 *
 * It was proposed by Christian Goldbach that every odd composite number can be
 * written as the sum of a prime and twice a square.
 *
 *       9 =  7 + 2×1²
 *      15 =  7 + 2×2²
 *      21 =  3 + 2×3²
 *      25 =  7 + 2×3²
 *      27 = 19 + 2×2²
 *      33 = 31 + 2×1²
 *
 * It turns out that the conjecture was false.
 *
 * What is the smallest odd composite that cannot be written as the sum of a
 * prime and twice a square ?
 */

const { isPrime } = require('../../lib/prime');
const { memoize } = require('../../lib/utils');

this.solve = function () {
  const isPrimeM = memoize(isPrime);

  // Helper for testing the proposed conjecture given an odd composite number.
  const goldbach = n => {
    let p = n;
    while (p > 2) {
      // Find p 1st prime below n or previous p.
      do {p -= 2} while (p > 2 && !isPrimeM(p));
      // Start with the smallest square j².
      let j = 0;
      let sq2;
      do {
        // Check the sum of this prime and twice that square
        sq2 = 2*(++j)**2;
        const goldSum = p + sq2;
        if (goldSum > n)
          break; // use a smaller prime
        else if (goldSum === n)
          return true; // one point for the conjecture
      }
      while (sq2 < n);
    }
    // Reaching this point means we have an odd composite that cannot be written
    // as the sum of a prime and twice a square.
    return false;
  };

  // Iterate odd composite numbers until we find a match disproving Goldbach's
  // other conjecture.
  let n = 33;
  let found;
  while (!found) {
    n += 2;
    if (!isPrimeM(n) && goldbach(n) === false)
      found = n;
  }

  return found;
}

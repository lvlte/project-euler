/**
 * Problem 58 - Spiral primes
 *
 * @see {@link https://projecteuler.net/problem=58}
 *
 * Starting with 1 and spiralling anticlockwise in the following way, a square
 * spiral with side length 7 is formed.
 *
 * [...]
 *
 * It is interesting to note that the odd squares lie along the bottom right
 * diagonal, but what is more interesting is that 8 out of the 13 numbers lying
 * along both diagonals are prime; that is, a ratio of 8/13 ≈ 62%.
 *
 * If one complete new layer is wrapped around the spiral above, a square spiral
 * with side length 9 will be formed. If this process is continued, what is the
 * side length of the square spiral for which the ratio of primes along both
 * diagonals first falls below 10% ?
 */

const { isPrime } = require('../../lib/prime');

this.solve = function () {
  const targetRatio = 0.1;

  // We are searching for all prime numbers p statisfying
  //  p = n² - m(n-1) with n ∈ {2k+1 :k ∈ {Z} } and m ∈ {1, 2, 3}

  let count = 0;  // how many prime numbers lie along diagonals
  let n = 3;      // actual side length

  while (true) {
    const n2 = n**2;
    const k = n-1;
    for (let m=1; m<=3; m++)
      isPrime(n2 - m*k) && count++;
    const r = count/(2*k+1);
    if (r < targetRatio)
      break;
    n += 2;
  }

  return n;
}

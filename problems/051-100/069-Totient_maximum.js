/**
 * Problem 69 - Totient maximum
 *
 * @see {@link https://projecteuler.net/problem=69}
 *
 * Euler's Totient function, φ(n) [sometimes called the phi function], is used
 * to determine the number of numbers less than n which are relatively prime
 * to n. For example, as 1, 2, 4, 5, 7, and 8, are all less than nine and
 * relatively prime to nine, φ(9)=6.
 *
 *    n  Relatively Prime     φ(n)      n/φ(n)
 *    2               1        1          2
 *    3             1,2        2          1.5
 *    4             1,3        2          2
 *    5         1,2,3,4        4          1.25
 *    6             1,5        2          3
 *    7     1,2,3,4,5,6        6          1.1666...
 *    8         1,3,5,7        4          2
 *    9     1,2,4,5,7,8        6          1.5
 *   10         1,3,7,9        4          2.5
 *
 * It can be seen that n=6 produces a maximum n/φ(n) for n ≤ 10.
 *
 * Find the value of n ≤ 1,000,000 for which n/φ(n) is a maximum.
 */

const { iterPrimes } = require('../../lib/prime')

this.solve = function () {
  const nMax = 1_000_000;

  // The totient can be computed using the product of the distinct primes p
  // dividing n :
  //  φ(n) = n*∏[p|n](1-1/p)

  // @see https://mathworld.wolfram.com/TotientFunction.html
  // @see Prime.totient(n)

  // We need to find the maxmimum value of n/φ(n) for n <= nMax :
  //  n/φ(n) = n/(n*∏[p|n](1-1/p))
  //         = 1/∏[p|n](1-1/p)
  //         = 1/Xn                    let Xn = ∏[p|n](1-1/p)

  // Which translates into finding the lowest value of Xn for n <= nMax.

  // Xn = (1-1/p1)(1-1/p2)...(1-1/pk)

  // We can observe that :
  //  if 2 is a factor of n, the whole is multiplied by 1/2,
  //  if 3 is a factor of n, the whole is multiplied by 2/3,
  //  if 5 is a factor of n, the whole is multiplied by 4/5,
  //  ...
  // Therefore, the more distinct prime factors we have and the smaller they
  // are, the faster Xn decreases.

  // So we can minimize Xn and thus maximize n/φ(n) for n <= nMax by computing
  // the longest product of the smallest distinct primes of n which stays below
  // nMax.

  // Since our prime iterator is faster when an upper bound is set and as the
  // product will grow very fast, we will use 50 as a limit which is more than
  // sufficient for nMax <= 614889782588491410n.

  let n = null;
  let prod = 1;

  for (const prime of iterPrimes(50)) {
    prod *= prime;
    if (prod > nMax) {
      n = prod/prime;
      break;
    }
  }

  return n;
}

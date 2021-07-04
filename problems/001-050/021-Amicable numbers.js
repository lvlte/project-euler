/**
 * Problem 21 - Amicable numbers
 *
 * @see {@link https://projecteuler.net/problem=21}
 *
 * Let d(n) be defined as the sum of proper divisors of n (numbers less than n
 * which divide evenly into n).
 * If d(a) = b and d(b) = a, where a ≠ b, then a and b are an amicable pair and
 * each of a and b are called amicable numbers.
 *
 * For example :
 * - the proper divisors of 220 are  1, 2, 4, 5, 10, 11, 20, 22, 44, 55 and 110;
 *   therefore d(220) = 284.
 *
 * - the proper divisors of 284 are 1, 2, 4, 71 and 142;
 *   therefore d(284) = 220.
 *
 * Evaluate the sum of all the amicable numbers under 10000.
 */

const { sum, divisors } = require('../../lib/utils')

this.solve = function () {
  const limit = 10_000;

  const d = (n) => sum(divisors(n));

  let s = 0;
  let sumdiv = {}; // { n : d(n) }

  for (let n=1; n<limit; n++) {
    const dn = sumdiv[n] = d(n);
    if (dn in sumdiv && sumdiv[dn] === n && dn !== n) {
      s += n + dn;
    }
  }

  return s;
}

/**
 * Problem 56 - Powerful digit sum
 *
 * @see {@link https://projecteuler.net/problem=56}
 *
 * A googol (10^100) is a massive number: one followed by one-hundred zeros;
 * 100^100 is almost unimaginably large: one followed by two-hundred zeros.
 * Despite their size, the sum of the digits in each number is only 1.
 *
 * Considering natural numbers of the form, a^b, where a, b < 100, what is the
 * maximum digital sum ?
 */

const { sum } = require('../../lib/math');
const { digits } = require('../../lib/utils');

this.solve = function () {
  // Brute force : start with highest values for a and b and decrease, break
  // when the number a^b can't produce a digital sum which is greater than the
  // current one (that is, when the number of its digits is smaller than the
  // maxSum divided by nine digits).

  const limit = 100n;
  let maxSum = 0n;

  for (let a=limit-1n, p=0; Math.log10(Number(a**limit))>p; a--) {
    for (let b=limit-1n; b>0; b--) {
      const n = a**b;
      if (Math.log10(Number(n)) < p)
        break;
      const s = sum(digits(n));
      if (s > maxSum) {
        maxSum = s;
        p = maxSum/9;
      }
    }
  }

  return maxSum;
}

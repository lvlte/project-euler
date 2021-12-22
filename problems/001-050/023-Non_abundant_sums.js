/**
 * Problem 23 - Non-abundant sums
 *
 * @see {@link https://projecteuler.net/problem=23}
 *
 * A perfect number is a number for which the sum of its proper divisors is
 * exactly equal to the number. For example, the sum of the proper divisors
 * of 28 would be 1 + 2 + 4 + 7 + 14 = 28, which means that 28 is a perfect
 * number.
 *
 * A number n is called deficient if the sum of its proper divisors is less
 * than n and it is called abundant if this sum exceeds n.
 *
 * As 12 is the smallest abundant number, 1 + 2 + 3 + 4 + 6 = 16, the smallest
 * number that can be written as the sum of two abundant numbers is 24. By
 * mathematical analysis, it can be shown that all integers greater than 28123
 * can be written as the sum of two abundant numbers. However, this upper limit
 * cannot be reduced any further by analysis even though it is known that the
 * greatest number that cannot be expressed as the sum of two abundant numbers
 * is less than this limit.
 *
 * Find the sum of all the positive integers which cannot be written as the sum
 * of two abundant numbers.
 */

const { sum, divisors } = require('../../lib/math');

this.solve = function () {
  const nMax = 28_123;

  // Collect abundant numbers.
  let abundant = [];
  for (let n=1; n<=nMax; n++) {
    sum(divisors(n, true)) > n && abundant.push(n);
  }

  // Positive integers which CAN be written as the sum of 2 abundant numbers.
  let abSums = {};
  for (let i=0; i<abundant.length; i++) {
    for (let j=i; j<abundant.length; j++) {
      const tmp = abundant[i] + abundant[j];
      abSums[tmp] = tmp;
    }
  }

  // From there deduce those which cannot and sum them.
  let s = 0;
  for (let n=1; n<=nMax; n++) {
    if (!abSums[n])
      s += n;
  }

  return s;
}

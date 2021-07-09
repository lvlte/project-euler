/**
 * Problem 43 - Sub-string divisibility
 *
 * @see {@link https://projecteuler.net/problem=43}
 *
 * The number, 1406357289, is a 0 to 9 pandigital number because it is made up
 * of each of the digits 0 to 9 in some order, but it also has a rather
 * interesting sub-string divisibility property.
 *
 * Let d1 be the 1st digit, d2 be the 2nd digit, and so on. In this way, we
 * note the following:
 *
 *    d₂d₃d₄ = 406 is divisible by 2
 *    d₃d₄d₅ = 063 is divisible by 3
 *    d₄d₅d₆ = 635 is divisible by 5
 *    d₅d₆d₇ = 357 is divisible by 7
 *    d₆d₇d₈ = 572 is divisible by 11
 *    d₇d₈d₉ = 728 is divisible by 13
 *    d₈d₉d₁₀= 289 is divisible by 17
 *
 * Find the sum of all 0 to 9 pandigital numbers with this property.
 */

const { range } = require('../../lib/utils');
const { permute } = require('../../lib/combinatorics');
const { remZero } = require('../../lib/math');

this.solve = function () {
  const set = range(10);
  const primes = [2, 3, 5, 7, 11, 13, 17];

  // We can generate permutations of the set [0,1,2,3,4,5,6,7,8,9] (excluding
  // later those starting with 0) to get all 0-to-9 pandigitals.
  const pandigitals = permute(set);

  // Checks sub-string divisibility of n (given an array of digits of n). d2d3d4
  // are translated into d1d2d3 and so on to match array index. We start with
  // the largest divisor to break the loop as early as possible.
  const checkDivisibility = d => {
    for (let i=9; i>2; i--) {
      const n = +(''+d[i-2]+d[i-1]+d[i]);
      if (!remZero(n, primes[i-3]))
        return false;
    }
    return true;
  }

  let sum = 0;
  for (let i=0; i<pandigitals.length; i++) {
    if (pandigitals[i][0] === 0)
      continue;
    if (checkDivisibility(pandigitals[i]))
      sum += +pandigitals[i].join('');
  }

  return sum;
}

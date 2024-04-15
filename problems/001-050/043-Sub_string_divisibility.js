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

const { range, diff } = require('../../lib/utils');
const { permute } = require('../../lib/combinatorics');
const { remZero, sum } = require('../../lib/math');

this.solve = function () {
  // We can work with digits triplets : the key is to create 3-digit multiples
  // for each prime, starting with the d₈d₉d₁₀ numbers (because there are less
  // multiples of 17 than multiples of 2 which means fewer candidates to begin
  // with).

  // Then for each one of them, we take the two first digits and try to create
  // 3-digits multiples of 13 that ends with these digits, and if any, repeat
  // the process with the next group, and so on until we reach the multiples of
  // two. At each stage, we expand the candidate numbers which are represented
  // as strings. After that, we will just need to prepend their first digit (d₁)
  // to the numbers obtained from the last stage.

  const set = range(10).map(String);
  const primes = [2, 3, 5, 7, 11, 13, 17];

  // A[s] contains the pandigital number candidates strings at some stage s,
  // initially the multiples of 17, d₈d₉d₁₀ for s=0, then the 4-digits numbers
  // d₇d₈d₉d₁₀ for s=1, d₆d₇d₈d₉d₁₀ for s=2, etc.
  let p = primes.pop();
  const A = [
    range(p, 10**3, p).map(n => (''+n).padStart(3, 0)).filter(digits => {
      return digits.length == new Set(digits).size;
    })
  ];

  while (primes.length) {
    const candidates = A.at(-1);
    const next = [];
    p = primes.pop();
    for (let i=0; i<candidates.length; i++) {
      const [d1, d2] = candidates[i];
      diff(set, candidates[i]).forEach(d => {
        const n = Number(d + d1 + d2);
        if (remZero(n, p))
          next.push([d, ...candidates[i]].join(''))
      });
    }
    A.push(next);
  }

  const pandigitals = A.at(-1).map(digits => {
    const d = diff(set, digits).pop();
    return Number([d, ...digits].join(''));
  });

  return sum(pandigitals);
}

// Alternative method (brute force)
this.solve2 = function () {
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

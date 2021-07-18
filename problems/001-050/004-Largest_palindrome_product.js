/**
 * Problem 4 - Largest palindrome product
 *
 * @see {@link https://projecteuler.net/problem=4}
 *
 * A palindromic number reads the same both ways. The largest palindrome made
 * from the product of two 2-digit numbers is 9009 = 91 × 99.
 *
 * Find the largest palindrome made from the product of two 3-digit numbers.
 */

const { isPalindromic } = require('../../lib/utils');

this.solve = function () {
  const d = 3; // number of digits
  const min = 10**(d-1);
  const max = 10**d - 1;

  // largest palindrome x = m * n, with n <= m
  let largest = { x: 0, m: 0, n: 0 };

  find:
  for (let m=max; m>min; m--) {
    for (let n=m; n>min; n--) {
      const x = m * n;
      if (!isPalindromic(''+x))
        continue;
      if (x > largest.x)
        largest = { x, m, n };
      else if (m < largest.n)
        break find;
    }
  }

  return largest.x;
}

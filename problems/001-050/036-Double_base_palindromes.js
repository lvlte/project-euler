/**
 * Problem 36 - Double-base palindromes
 *
 * @see {@link https://projecteuler.net/problem=36}
 *
 * The decimal number, 585 = 1001001001₂ (binary), is palindromic in both bases.
 *
 * Find the sum of all numbers, less than one million, which are palindromic in
 * base 10 and base 2.
 *
 * Please note that the palindromic number, in either base, may not include
 * leading zeros.
 */

const { isPalindromic } = require('../../lib/utils');

this.solve = function () {
  const limit = 1_000_000;
  let sum = 0;

  // brute force..
  for (let n=0; n<limit; n++) {
    if (isPalindromic(''+n) && isPalindromic(n.toBinary()))
      sum += n;
  }

  return sum;
}

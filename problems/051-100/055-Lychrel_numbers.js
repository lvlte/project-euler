/**
 * Problem 55 - Lychrel numbers
 *
 * @see {@link https://projecteuler.net/problem=55}
 *
 * If we take 47, reverse and add, 47 + 74 = 121, which is palindromic.
 *
 * Not all numbers produce palindromes so quickly. For example,
 *
 *    349 + 943 = 1292,
 *    1292 + 2921 = 4213
 *    4213 + 3124 = 7337
 *
 * That is, 349 took three iterations to arrive at a palindrome.
 *
 * Although no one has proved it yet, it is thought that some numbers, like 196,
 * never produce a palindrome. A number that never forms a palindrome through
 * the reverse and add process is called a Lychrel number.
 *
 * [...]
 *
 * How many Lychrel numbers are there below ten-thousand ?
 */

const { isPalindromic } = require('../../lib/utils');

this.solve = function () {
  const limit = 10_000n;
  const maxIter = 50;

  const reverseAndAdd = n => {
    return n + BigInt((''+n).split('').reverse().join(''));
  }

  const isLychrel = n => {
    let i = 0;
    while (++i < maxIter) {
      const _n = reverseAndAdd(n);
      if (isPalindromic(''+_n))
        return false;
      n = _n;
    }
    return true;
  };

  // brute force
  let lychrel = [];
  for (let n=10n; n<limit; n++) {
    if (isLychrel(n))
      lychrel.push(n);
  }

  // console.log(lychrel);

  return lychrel.length;
}

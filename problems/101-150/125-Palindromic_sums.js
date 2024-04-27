/**
 * Problem 125 - Palindromic sums
 *
 * @see {@link https://projecteuler.net/problem=125}
 *
 * The palindromic number 595 is interesting because it can be written as the
 * sum of consecutive squares: 6² + 7² + 8² + 9² + 10² + 11² + 12².
 *
 * There are exactly eleven palindromes below one-thousand that can be written
 * as consecutive square sums, and the sum of these palindromes is 4164. Note
 * that 1 = 0² + 1² has not been included as this problem is concerned with the
 * squares of positive integers.
 *
 * Find the sum of all the numbers less than 10⁸ that are both palindromic and
 * can be written as the sum of consecutive squares.
 */

const { sum } = require('../../lib/math');
const { isPalindromic, range } = require('../../lib/utils');

this.solve = function () {

  const limit = 1e8;

  // A sum requires at least 2 summands which are squares, so the max number to
  // be squared is :
  const nmax = Math.ceil(Math.sqrt(limit / 2));

  // We will use an array where each element at index i represents the sum of m
  // consecutive squares that starts with (i+1)² : we initialize the array for
  // m=1 and then incrementally produce sums with ++m addends by adding (i+m)²
  // to the current sums. Elements exceeding the limit are removed and the loop
  // ends when there is no more square sum to expand.
  //
  //  m=1: [  1,  4,  9, 16, ... ]
  //  m=2: [  5, 13, 25, 41, ... ]
  //  m=3: [ 14, 29, 50, 77, ... ]
  //  ...
  //
  let m = 1;
  const squareSums = range(1, nmax).map(n => n**2);

  // NB. The problem description doesn't mention that but it happens that there
  // exists palindromes that can be written as the sum of consecutive squares in
  // more than one way, those are counted only once in the final sum.
  const palindromes = new Set();

  while(squareSums.length && m++) {
    for (let i=0; i<squareSums.length; i++) {
      const sqsum = squareSums[i] + (i + m)**2;
      if (sqsum < limit) {
        squareSums[i] = sqsum;
        if (isPalindromic(sqsum.toString())) {
          palindromes.add(sqsum);
        }
      }
      else {
        squareSums.splice(i);
        break;
      }
    }
  }

  return sum(palindromes);
}

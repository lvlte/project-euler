/**
 * Problem 30 - Digit fifth powers
 *
 * @see {@link https://projecteuler.net/problem=30}
 *
 * Surprisingly there are only three numbers that can be written as the sum of
 * fourth powers of their digits :
 *
 * 1634 = 1^4 + 6^4 + 3^4 + 4^4
 * 8208 = 8^4 + 2^4 + 0^4 + 8^4
 * 9474 = 9^4 + 4^4 + 7^4 + 4^4
 *
 * As 1 = 1^4 is not a sum it is not included.
 *
 * The sum of these numbers is 1634 + 8208 + 9474 = 19316.
 *
 * Find the sum of all the numbers that can be written as the sum of fifth
 * powers of their digits.
 */

const { sum } = require('../../lib/math');

this.solve = function () {
  // Finding numbers that can be written as the sum of fifth powers of their
  // digits implies to find bounds for which, when crossed, we know that there
  // are no such number, otherwise we would never know when to stop searching.

  // Finding the upper limit :
  //  -> 9^5 + 9^5 + 9^5 + 9^5 + 9^5 = 295245
  //    max 5-digits number 99999 yields a 6-digits number, so need at least 6.
  //  -> 9^5 * 6 = 354294
  //    354294 < 999999 (6-digits numbers match)
  //  -> 9^5 * 7 = 413343
  //     413343 < 9999999 (7 times 9^5 produces only 6 digits)
  //  -> continuing only increments the gap (8 times 9^5 is still 6 digits...)

  // So the greatest valid candidate is : 354294
  const limit = 354294;

  // Sum of fifth powers of the digits of x.
  const f = x => sum((''+x).split('').map(d => (+d)**5));

  let s = 0;
  let x = 10; // requires at least 2 digits
  while (++x <= limit)
    if (x === f(x))
      s += x;

  return s;
}

/**
 * Problem 52 - Permuted multiples
 *
 * @see {@link https://projecteuler.net/problem=52}
 *
 * It can be seen that the number, 125874, and its double, 251748, contain
 * exactly the same digits, but in a different order.
 *
 * Find the smallest positive integer, x, such that 2x, 3x, 4x, 5x, and 6x,
 * contain the same digits.
 */

const { digits, range, count } = require('../../lib/utils');

this.solve = function () {
  // Start with x and 6x that must contain exactly the same digits :
  //  nDigit(x) = ⌈log10(x)⌉ = ⌈log10(6x)⌉

  // We can deduce that 10^(nDigit-1) < x < ⌈10^nDigit/6⌉.

  // For example with nDigits = 2, the min value of x is 10, and the max value
  // is 100/6.

  // Given these bounds, we can do some brute force.

  // The smallest integer divisible by 2, 3, 4, 5, and 6 is 60, which is out of
  // range for a 2-digit number, so wee will start with 3.

  const multipliers = range(2, 7);

  // Compare occurrences of digits in h1 and h2, returns true if they match.
  const occMatch = (h1, h2) => {
    for (let digit in h1) {
      if (h1[digit] != h2[digit])
        return false;
    }
    return true;
  };

  // Checks if the given number contain the same digits when multiplied
  const xMatch = x => {
    const occ = count(digits(x, false));
    for (let i=0; i<multipliers.length; i++) {
      if (!occMatch(count(digits(x*multipliers[i], false)), occ))
        return false;
    }
    return true;
  }

  let smallestX;
  let nDigit = 2;

  Search:
  while (nDigit++) {
    const [min, max] = [10**(nDigit-1), Math.ceil(10**(nDigit)/6)];
    for (let x=min; x<max; x++) {
      if (xMatch(x)) {
        smallestX = x;
        break Search;
      }
    }
  }

  return smallestX;
}

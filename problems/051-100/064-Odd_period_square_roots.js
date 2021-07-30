/**
 * Problem 64 - Odd period square roots
 *
 * @see {@link https://projecteuler.net/problem=64}
 *
 * All square roots are periodic when written as continued fractions. [...]
 *
 * For example, let us consider √(23) [...]. It can be seen that the sequence
 * is repeating. For conciseness, we use the notation √(23) = [4;(1,3,1,8)] to
 * indicate that the block (1,3,1,8) repeats indefinitely.
 *
 * The first ten continued fraction representations of (irrational) square roots
 * are:
 *
 *  √2 = [1; (2)], period=1
 *  √3 = [1; (1,2)], period=2
 *  √5 = [2; (4)], period=1
 *  √6 = [2; (2,4)], period=2
 *  √7 = [2; (1,1,1,4)], period=4
 *  √8 = [2; (1,4)], period=2
 *  √10 = [3; (6)], period=1
 *  √11 = [3; (3,6)], period=2
 *  √12 = [3; (2,6)], period=2
 *  √13 = [3; (1,1,1,1,6)], period=5
 *
 * Exactly four continued fractions, for N <= 13, have an odd period.
 *
 * How many continued fractions for N <= 10 000 have an odd period ?
 */

const { periodicSquareRoot } = require('../../lib/math');
const { range } = require('../../lib/utils');

this.solve = function () {
  const limit = 10_000;

  // Generates some squares
  const maxRange = Math.ceil(Math.sqrt(limit));
  const squares = range(2, maxRange).mapToObj(n => [n*n, n]);

  let oddPeriods = 0;
  for (let n=2; n<=limit; n++) {
    if (n in squares)
      continue;
    const [a0, period] = periodicSquareRoot(n);
    oddPeriods += period.length % 2;
  }

  return oddPeriods;
}

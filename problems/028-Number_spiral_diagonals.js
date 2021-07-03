/**
 * Problem 28 - Number spiral diagonals
 *
 * @see {@link https://projecteuler.net/problem=28}
 *
 * Starting with the number 1 and moving to the right in a clockwise direction,
 * a 5 by 5 spiral is formed as follows :
 *
 *            21 22 23 24 25
 *            20  7  8  9 10
 *            19  6  1  2 11
 *            18  5  4  3 12
 *            17 16 15 14 13
 *
 * It can be verified that the sum of the numbers on the diagonals is 101 :
 *    ->   1 + 3 + 5 + 7 + 9 + 13 + 17 + 21 + 25 = 101
 *
 * What is the sum of the numbers on the diagonals in a 1001 by 1001 spiral
 * formed in the same way?
 */

const { range, sum } = require('../lib/utils');

this.solve = function () {
  // Considering any n*n grid, n ⋹ 2N+1, we just need to sum the four corners
  // and repeat the process for n=n-2 while n > 1, returning the total sum + 1.

  // Return the four corner numbers in a n*n grid for n > 1.
  const corners = n => {
    const sq = n*n;
    const offset = n-1;
    return range(4).map(x => sq-x*offset);
  }

  let n = 1001;
  let total = 1;

  while (n > 1) {
    total += sum(corners(n));
    n -= 2;
  }

  return total;
}

/**
 * Problem 81 - Path sum: two ways
 *
 * @see {@link https://projecteuler.net/problem=81}
 *
 * In the 5 by 5 matrix below, the minimal path sum from the top left to the
 * bottom right, by only moving to the right and down, is indicated between < >
 * and is equal to 2427.
 *
 *      <131>  673   234   103    18
 *      <201> < 96> <342>  965   150
 *       630   803  <746> <422>  111
 *       537   699   497  <121>  956
 *       805   732   524  < 37> <331>
 *
 * Find the minimal path sum from the top left to the bottom right by only
 * moving right and down in p081_matrix.txt, a 31K text file containing an 80
 * by 80 matrix.
 */

const { load } = require('../../lib/utils');
const data = load('p081_matrix.txt').split(/\r\n|\n/);
const matrix = data.filter(l => l).map(r => r.split(',').map(n => +n));

this.solve = function () {
  // We already had to deal with "two ways" path sums in problem 18 and 67.

  // So if we transform the given matrix into a triangular grid, we should be
  // able to apply the same logic.

  // Given the 5x5 matrix from the example :
  //
  //  1. Creating rows from diagonals (bottom-left to up-right), we obtain the
  //     following rhombus :
  //
  //                            131
  //                          201 673
  //                        630 096 234
  //                      537 803 342 103
  //                    805 699 746 965 018
  //                      732 497 422 150
  //                        524 121 111
  //                          037 956
  //                            331
  //
  //  2. Now we just need to add some cells to form a triangle :
  //
  //                            131
  //                          201 673
  //                        630 96 234
  //                      537 803 342 103
  //                    805 699 746 965 018
  //                  xxx 732 497 422 150 xxx
  //                xxx xxx 524 121 111 xxx xxx
  //              xxx xxx xxx 037 956 xxx xxx xxx
  //            xxx xxx xxx xxx 331 xxx xxx xxx xxx

  // Since we need the minimal path sum, we will fill empty cells with Infinity.

  // 1. Reshaping the matrix
  let triangle = Array(matrix.length*2-1);
  for (let i=0; i<matrix.length; i++) {
    const row = matrix[i];
    for (let j=0; j<row.length; j++) {
      const n = row[j];
      const k = j+i;
      if (!triangle[k])
        triangle[k] = [n];
      else
        triangle[k].unshift(n);
    }
  }

  // 2. Adding missing cells to form a triangle
  for (let i=matrix.length, j=1; i<triangle.length; j++ && i++) {
    const missing = Array(j).fill(Infinity);
    triangle[i].push(...missing);
    triangle[i].unshift(...missing);
  }

  // Minimal path sum
  for (let i=triangle.length-2; i>=0; i--)
    for (let j=0; j<triangle[i].length; j++)
      triangle[i][j] += Math.min(triangle[i+1][j], triangle[i+1][j+1]);

  return triangle[0][0];
}

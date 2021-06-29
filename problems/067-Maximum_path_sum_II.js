/**
 * Problem 18 - Maximum path sum II
 *
 * @see {@link https://projecteuler.net/problem=67}
 *
 * By starting at the top of the triangle below and moving to adjacent numbers
 * on the row below, the maximum total from top to bottom is 23 :
 *
 *                            3
 *                           7 4
 *                          2 4 6
 *                         8 5 9 3
 *
 * That is, 3 + 7 + 4 + 9 = 23.
 *
 * Find the maximum total from top to bottom in triangle.txt, a 15K text file
 * containing a triangle with one-hundred rows.
 *
 * NOTE: This is a much more difficult version of Problem 18. It is not possible
 * to try every route to solve this problem, as there are 299 altogether! If you
 * could check one trillion (1012) routes every second it would take over twenty
 * billion years to check them all. There is an efficient algorithm to solve it.
 * ;o)
 */

const { readFileSync } = require('fs');
const { resolve } = require('path');

const fpath = resolve(__dirname, '../res/p067_triangle.txt');
const data = readFileSync(fpath, {encoding:'utf8', flag:'r'});
const grid = data.split(/\r\n|\n/).filter(l => l).map(r => r.split(' ').map(n => +n));

this.solve = function () {
  /** @see 018-Maximum_path_sum_I.js */

  for (let i=grid.length-2; i>=0; i--)
    for (let j=0; j<grid[i].length; j++)
      grid[i][j] += Math.max(grid[i+1][j], grid[i+1][j+1]);

  return grid[0][0];
}

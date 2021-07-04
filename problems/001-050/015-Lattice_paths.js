/**
 * Problem 15 - Lattice paths
 *
 * @see {@link https://projecteuler.net/problem=15}
 *
 * Starting in the top left corner of a 2×2 grid, and only being able to move
 * to the right and down, there are exactly 6 routes to the bottom right corner.
 *
 *         +----+----+          +----+    +          +----+    +
 *                   |               |                    |
 *         +    +    +          +    +----+          +    +    +
 *                   |                    |               |
 *         +    +    v          +    +    v          +    +---->
 *
 *
 *         +    +    +          +    +    +          +    +    +
 *         |                    |                    |
 *         +----+----+          +----+    +          +    +    +
 *                   |               |               |
 *         +    +    v          +    +---->          +----+---->
 *
 * How many such routes are there through a 20×20 grid?
 */

const { binomialCoefCentral } = require('../../lib/math.js');

this.solve = function () {
  // The number of possible paths of length 2n from one corner to the opposite
  // in an n*n grid correspond to the nth central binomial coefficient.
  // @see how -> http://www.robertdickau.com/lattices.html

  const n = 20;
  const nPaths = binomialCoefCentral(n);

  return nPaths;
}

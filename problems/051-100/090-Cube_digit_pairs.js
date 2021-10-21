/**
 * Problem 90 - Cube digit pairs
 *
 * @see {@link https://projecteuler.net/problem=}
 *
 * Each of the six faces on a cube has a different digit (0 to 9) written on it;
 * the same is done to a second cube. By placing the two cubes side-by-side in
 * different positions we can form a variety of 2-digit numbers.
 *
 * For example, the square number 64 could be formed.
 *
 * In fact, by carefully choosing the digits on both cubes it is possible to
 * display all of the square numbers below one-hundred: 01, 04, 09, 16, 25, 36,
 * 49, 64, and 81.
 *
 * For example, one way this can be achieved is by placing {0, 5, 6, 7, 8, 9}
 * on one cube and {1, 2, 3, 4, 8, 9} on the other cube.
 *
 * However, for this problem we shall allow the 6 or 9 to be turned upside-down
 * so that an arrangement like {0, 5, 6, 7, 8, 9} and {1, 2, 3, 4, 6, 7} allows
 * for all nine square numbers to be displayed; otherwise it would be impossible
 * to obtain 09.
 *
 * In determining a distinct arrangement we are interested in the digits on each
 * cube, not the order.
 *
 * {1, 2, 3, 4, 5, 6} is equivalent to {3, 6, 4, 1, 2, 5}
 * {1, 2, 3, 4, 5, 6} is distinct from {1, 2, 3, 4, 5, 9}
 *
 * But because we are allowing 6 and 9 to be reversed, the two distinct sets in
 * the last example both represent the extended set {1, 2, 3, 4, 5, 6, 9} for
 * the purpose of forming 2-digit numbers.
 *
 * How many distinct arrangements of the two cubes allow for all of the square
 * numbers to be displayed ?
 */

const { range } = require('../../lib/utils');
const { nkCombinations } = require('../../lib/combinatorics');

this.solve = function () {
  // We can solve this problem easily using combinatorics.

  // The number of ways to place digits on a cube is (n choose k), with n the
  // number of digits to be used and k the number of cube faces.

  // We can build these combinations to obtain all possible arrangements of
  // digits for one cube (or just all distinct cubes made from these digits).

  // Also, in order to take account of the 6/9 rule, we will extend every set
  // containing one of these 2 digits with its "upside-down" counterpart.

  // Then, we can create cube pairs which we can do in the same manner, with n
  // the number of distinct cubes and k=2.

  // From there, we just need to check how many of these pairs allow for all of
  // the square numbers to be displayed.

  // Set of digits to be used.
  const digits = new Set(range(10));

  // Set of squares below limit (a square is represented with a 2-digits array)
  const squares = range(1, Math.sqrt(100)).map(n => {
    return String(n**2).padStart(2, '0').split('').map(d => +d);
  });

  // Create all cubes that can be made from our set of digits, extending those
  // containing 6 or 9.
  const cubes = nkCombinations(digits, 6).map(cube => {
    if (cube.has(6)) cube.add(9);
    if (cube.has(9)) cube.add(6);
    return cube;
  });

  // Create cube pairs (distinct arrangements of two cubes that can be made).
  const pairs = nkCombinations(cubes, 2);

  // Returns whether or not the given arrangement allow for all of the square
  // numbers to be displayed.
  const predicate = (cube1, cube2) => {
    for (let i=0; i<squares.length; i++) {
      const [a, b] = squares[i];
      if (!(cube1.has(a) && cube2.has(b) || cube1.has(b) && cube2.has(a)))
        return false;
    }
    return true;
  };

  // Count the distinct arrangements that can produce all square numbers.
  let count = 0;
  for (let i=0; i<pairs.length; i++) {
    const [cube1, cube2] = pairs[i];
    if (predicate(cube1, cube2)) {
      count++;
    }
  }

  return count;
}

/**
 * Problem 62 - Cubic permutations
 *
 * @see {@link https://projecteuler.net/problem=62}
 *
 * The cube, 41063625 (345^3), can be permuted to produce two other cubes:
 * 56623104 (384^3) and 66430125 (405^3). In fact, 41063625 is the smallest
 * cube which has exactly three permutations of its digits which are also cube.
 *
 * Find the smallest cube for which exactly five permutations of its digits are
 * cube.
 */

const { digits } = require('../../lib/utils');

this.solve = function () {
  // Create some cubes and index them by their digit combinations.

  // When a given combination has five unique permutations, continue until the
  // cubes have more digits than those of that combination, since we need to
  // find the smallest cube with such properties, and because we don't want it
  // to have more than five permutations.

  const nPerm = 5;
  let cubeHashT = {};
  let combiMatches = new Set();

  let n = 1;
  let stop = null;

  while (n++) {
    const cube = n**3;
    if (stop && cube >= stop)
      break;
    const digCombi = digits(cube, false).sort((a, b) => a - b).join('');
    if (digCombi in cubeHashT) {
      cubeHashT[digCombi].push(cube);
      if (cubeHashT[digCombi].length == nPerm) {
        combiMatches.add(digCombi);
        stop = 10**(digCombi.length-1);
      }
      else if (cubeHashT[digCombi].length > nPerm) {
        combiMatches.delete(digCombi);
        if (combiMatches.isEmpty())
          stop = Infinity;
      }
    }
    else {
      cubeHashT[digCombi] = [cube];
    }
  }

  let smallestCube = Infinity;
  for (const match of combiMatches) {
    smallestCube = Math.min(smallestCube, ...cubeHashT[match]);
  }

  return smallestCube;
}

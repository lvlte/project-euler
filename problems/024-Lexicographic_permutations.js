/**
 * Problem 24 - Lexicographic permutations
 *
 * @see {@link https://projecteuler.net/problem=24}
 *
 * A permutation is an ordered arrangement of objects. For example, 3124 is one
 * possible permutation of the digits 1, 2, 3 and 4. If all of the permutations
 * are listed numerically or alphabetically, we call it lexicographic order.
 *
 * The lexicographic permutations of 0, 1 and 2 are:
 *
 *      012   021   102   120   201   210
 *
 * What is the millionth lexicographic permutation of the digits 0, 1, 2, 3, 4,
 * 5, 6, 7, 8 and 9?
 */

const { range, permute } = require('../lib/utils');

this.solve = function () {
  const set = range(10);
  const pos = 10**6;

  // There must be a more efficient way.. generate all the permutations, then
  // converted as a string sort them in lexicographic order.
  // const p = permute(set).map(p => p.join('')).sort((a, b) => a.localeCompare(b));
  const p = permute(set).sort((a, b) => a.join('').localeCompare(b.join('')));

  return p[pos-1];
}

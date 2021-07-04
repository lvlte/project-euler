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

const { range } = require('../../lib/utils');
const { permute, lehmerCode, factorial } = require('../../lib/math');

this.solve = function () {
  const set = range(10);
  const pos = 10**6;

  // There must be a more efficient way.. generate all the permutations, then
  // converted as a string sort them in lexicographic order.
  // const p = permute(set).map(p => p.join('')).sort((a, b) => a.localeCompare(b));

  const p = permute(set);

  // Use Lehmer code to index permutations.
  let orderedP = Array(p.length);
  for (let i=0; i<p.length; i++) {
    // Convert code from mixed/factorial base to base 10
    const code = lehmerCode(p[i]);
    let index = 0;
    for (let i=0; i<code.length; i++) {
      index += code[i]*factorial(code.length - i - 1);
    }
    orderedP[index] = p[i];
  }

  return +orderedP[pos-1].join('');
}

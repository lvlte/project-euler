/**
 * Problem 39 - Integer right triangles
 *
 * @see {@link https://projecteuler.net/problem=39}
 *
 * If p is the perimeter of a right angle triangle with integral length sides,
 * {a,b,c}, there are exactly three solutions for p = 120
 *
 *    {20,48,52}, {24,45,51}, {30,40,50}
 *
 * For which value of p ≤ 1000, is the number of solutions maximised ?
 */

const { sum } = require('../../lib/math');
const { PTp } = require('../../lib/triangle');

this.solve = function () {
  // Let's generate primitive pythagorean triples for which the perimeter stays
  // below pMax.

  const pMax = 1000;
  const triples = PTp(pMax);

  let perimeters = {};
  let nSolMax = 0;
  let whichP;

  for (let i=0; i<triples.length; i++) {
    const p = sum(triples[i]);
    if (p in perimeters) {
      perimeters[p]++;
      if (perimeters[p] > nSolMax) {
        nSolMax = perimeters[p];
        whichP = p;
      }
    }
    else perimeters[p] = 1;
  }

  return whichP;
}

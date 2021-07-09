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
const { PPTp } = require('../../lib/triangle');

this.solve = function () {
  // Let's generate primitive pythagorean triples, then from each find the
  // derivatives for which the perimeter stays below pMax, if any, counting
  // the number of triples per matching perimeter.

  const pMax = 1000;
  const ppt = PPTp(pMax);

  let perimeters = {};
  let nSolMax = 0;
  let whichP;

  for (let i=0; i<ppt.length; i++) {
    const p = sum(ppt[i]);
    let m = 0;
    let pp;
    while ((pp=++m*p) <= pMax) {
      if (pp in perimeters) {
        perimeters[pp]++;
        if (perimeters[pp] > nSolMax) {
          nSolMax = perimeters[pp];
          whichP = pp;
        }
      }
      else perimeters[pp] = 1;
    }
  }

  return whichP;
}

T

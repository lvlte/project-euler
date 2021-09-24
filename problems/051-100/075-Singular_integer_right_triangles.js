/**
 * Problem 75 - Singular integer right triangles
 *
 * @see {@link https://projecteuler.net/problem=75}
 *
 * It turns out that 12 cm is the smallest length of wire that can be bent to
 * form an integer sided right angle triangle in exactly one way, but there are
 * many more examples.
 *
 *    12 cm: (3,4,5)
 *    24 cm: (6,8,10)
 *    30 cm: (5,12,13)
 *    36 cm: (9,12,15)
 *    40 cm: (8,15,17)
 *    48 cm: (12,16,20)
 *
 * In contrast, some lengths of wire, like 20 cm, cannot be bent to form an
 * integer sided right angle triangle, and other lengths allow more than one
 * solution to be found; for example, using 120 cm it is possible to form
 * exactly three different integer sided right angle triangles.
 *
 *    120 cm: (30,40,50), (20,48,52), (24,45,51)
 *
 * Given that L is the length of the wire, for how many values of L ≤ 1,500,000
 * can exactly one integer sided right angle triangle be formed ?
 */

const { PTp } = require('../../lib/triangle');

this.solve = function () {

  // We already had to deal with pythagorean triples so the problem is quite
  // easy now that we got the proper function.

  // We will just generate all the pythagorean triples for which the perimeter
  // stays under the given limit and count those appearing only once.

  // This probabaly could be done more efficiently though.

  const L = 1_500_000;
  const triples = PTp(L);

  let LValues = {};
  let single = new Set();

  for (let i=0; i<triples.length; i++) {
    const [a, b, c] = triples[i];
    const p = a + b + c;
    if (p in LValues) {
      LValues[p]++;
      single.delete(p);
    }
    else {
      LValues[p] = 1;
      single.add(p);
    }
  }

  return single.size;
}

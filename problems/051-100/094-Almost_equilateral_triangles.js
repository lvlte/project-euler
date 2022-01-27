/**
 * Problem 94 - Almost equilateral triangles
 *
 * @see {@link https://projecteuler.net/problem=94}
 *
 * It is easily proved that no equilateral triangle exists with integral length
 * sides and integral area. However, the almost equilateral triangle 5-5-6 has
 * an area of 12 square units.
 *
 * We shall define an almost equilateral triangle to be a triangle for which two
 * sides are equal and the third differs by no more than one unit.
 *
 * Find the sum of the perimeters of all almost equilateral triangles with
 * integral side lengths and area and whose perimeters do not exceed one
 * billion (1,000,000,000).
 */

const { PPTChildT3 } = require('../../lib/triangle');

this.solve = function () {
  // A Heronian triangle, also known as a Heron triangle or a Hero triangle, is
  // a triangle with integer sides and integer area.

  // We are searching for Heronian triangles satisfying the "almost equilateral"
  // definition, that is all isosceles Hero triangles for which the base length
  // differs from the legs length by exactly one unit.

  // Regarding their perimeter, it is always an even number, thus every Heronian
  // triangle has an odd number of sides of even length. This means that for
  // those almost equilateral of the form (x, x, x±1), x is odd.

  // All isosceles Heronian triangles are decomposable. They are formed by
  // joining two congruent Pythagorean triangles along either of their common
  // legs, such that the equal sides of the isosceles triangle are the
  // hypotenuses of the Pythagorean triangles, and the base of the isosceles
  // triangle is twice the other Pythagorean leg.

  // Consequently, every Pythagorean triple is the building block for two
  // isosceles Heronian triangles, since the join can be along either leg :
  //
  //  Given a pythagorean triple (a, b, c), we can build
  //   H1 = (c, c, 2a) (joining on b)
  //   H2 = (c, c, 2b) (joining on a)
  //
  //  Therefore, in order to obtain an almost equilateral triangle (c, c, c±1),
  //  we need our triple (a, b, c) to satisfy 2a = c ± 1 or 2b = c ± 1, which
  //  implies that the hypotenuse c must be odd.

  // This means that all such triangles can be built from primitive pythagorean
  // triangles and that no derivative can match (since c is odd and 2a is even,
  // |2a - c| >= 1, then for any positive integer m, m * |2a - c| >= m, so the
  // 1-unit length difference can only hold when |2a - c| = 1 with m = 1).

  // As an almost equilateral triangle (c, c, c±1) has a perimeter p = 3*c ± 1,
  // we can define cMax, the maximum hypotenuse length for the pythagoreans,
  // such that 3*cMax + 1 = pMax.

  // However, generating all primitive pythagorean triples with an hypotenuse
  // lower than (10^9-1)/3 (which means a lot) and checking for each one of them
  // if |2a - c| = 1 or |2b - c| = 1 is not efficient at all.

  // (first attempt to solve this without ppt is described below in solve2)

  // Hopefully, Berggren showed that all primitive Pythagorean triples can be
  // generated from the (3, 4, 5) triangle by using 3 linear transformations
  // (T1, T2, T3). Hence, each one of them is the "parent" of three additional
  // primitive triples :

  //      |        a      |         b      |         c
  //  ----|---------------|----------------|-----------------
  //   T1 |  a - 2b + 2c  |   2a - b + 2c  |   2a - 2b + 3c
  //  ----|---------------|----------------|-----------------
  //   T2 |  a + 2b + 2c  |   2a + b + 2c  |   2a + 2b + 3c
  //  ----|---------------|----------------|-----------------
  //   T3 | -a + 2b + 2c  |  -2a + b + 2c  |  -2a + 2b + 3c

  // ... and if we inspect these parent/child relationships, it appears that all
  // triples that satisfy the condition belong to the same (unique) lineage :
  // - triples satisfying |2a - c| = 1 have one T3-child satisfying |2b - c| = 1
  // - triples satisfying |2b - c| = 1 have one T1-child satisfying |2a - c| = 1
  //
  //    Suppose we obtain a triple for which |2a - c| = 1 by applying T1 on its
  //    parent, it implies the parent satifies :
  //     |2(a - 2b + 2c) - (2a - 2b + 3c)| = 1
  //     |-2b + c| = 1
  //     |2b - c| = 1
  //
  //    And if we obtain a triple for which |2b - c| = 1 by applying T3 on its
  //    parent, it implies the parent satifies :
  //     |2(-2a + b + 2c) - (-2a + 2b + 3c)| = 1
  //     |-2a + c| = 1
  //     |2a - c| = 1

  // This is rather convenient for our problem !

  // With the same logic, we can prove that transition T2 can't produce such
  // triple whatever the parent, and also that there is no transition that can
  // produce such triple if the parent doesn't meet the requirement in the first
  // place (except obviously for the root).

  // In other words, starting from root (a=3, b=4, c=5) for which |2a - c| = 1,
  // and by applying the linear transformations T3 and T1 alternatively, we will
  // obtain every pythagorean triples that are the building blocks of an almost
  // equilateral triangle, and only them.

  // Also, as T3(a, b, c) and T1(b, a, c) yield the same triple with the output
  // values of a and b swapped, we can use only one transition and swap a and b
  // between each call. This way, we only have to consider the case |2a - c| = 1
  // and the corresponding triangle (c, c, 2a) with perimeter p = 2(c+a) because
  // our variable `a` (as well as `b`) will represent alternatively the value of
  // a and b.

  const pMax = 1_000_000_000;   // maximum perimeter
  const cMax = (pMax - 1) / 3;  // maximum hypotenuse length

  // The sum of perimeters of all almost equilateral Heronian triangles
  let pSum = 0;
  let [a, b, c] = [3, 4, 5];

  while (c <= cMax) {
    pSum += 2*(c+a);
    [b, a, c] = PPTChildT3(a, b, c);
  }

  return pSum;
}

// Alternative method
this.solve2 = () => {
  // Originally, my approach was to avoid having to generate pythagorean triples
  // but still to take advantage of the heronian triangles being decomposable in
  // two pythagorean triples. This is simpler but involves more code and is less
  // efficient.

  // Since we already got two arbitrary triples of the form (c, c, c±1) for any
  // odd integer c such that cMin <= c <= cMax, then for each c we can set :
  //  a = (c ± 1)/2
  //  b = √(c² - a²)
  // and check whether or not b is an integer.

  // In such case, (a, b, c) is a pythagorean triple and therefore (c, c, c±1)
  // is an almost equilateral heronian triangle.

  const pMax = 1_000_000_000;   // maximum perimeter
  const cMax = (pMax - 1) / 3;  // maximum hypotenuse length
  const cMin = 5;               // smallest triple is (3, 4, 5)

  // The max safe value for c is the max safe root of c².
  const rtMax = Math.sqrt(Number.MAX_SAFE_INTEGER);

  // Checks if (a, b, c) is a pythagorean triple.
  const check = (a, b, c, a2, b2, c2) => {
    if (Number.isInteger(b) && a2 + b2 - c2 === 0) {
      if (c <= rtMax)
        return true;
      // For c greater than max safe root, we need to double check with bigint
      // to ensure we have no error.
      c = BigInt(c);
      a = BigInt(a);
      b = Math.sqrt(Number(c*c - a*a));
      if (!Number.isInteger(b))
        return false;
      b = BigInt(b);
      return a*a + b*b === c*c;
    }
    return false;
  }

  // The sum of perimeters of all almost equilateral Heronian triangles
  let pSum = 0;

  // For each odd value of c, we consider the triangle (c, c, c±1) and check if
  // it can be decomposed into two copy of a pythagorean triples (a, b, c), in
  // which case it is an almost equilateral heronian triangle.
  for (let c=cMin; c<=cMax; c+=2) {
    let a = (c-1)/2;    // (c, c, c-1)
    let a2 = a*a;
    let c2 = c*c;
    let b = Math.sqrt(c2 - a2);
    if (check(a, b, c, a2, b*b, c2)) {
      pSum += 3*c - 1;
      continue;
    }
    a = a+1;            // (c, c, c+1)
    a2 = a*a;
    b = Math.sqrt(c2 - a2);
    if (check(a, b, c, a2, b*b, c2))
      pSum += 3*c + 1;
  }

  return pSum;
}

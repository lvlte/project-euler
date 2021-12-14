/**
 * Problem 91 - Right triangles with integer coordinates
 *
 * @see {@link https://projecteuler.net/problem=91}
 *
 * The points P (x1, y1) and Q (x2, y2) are plotted at integer co-ordinates and
 * are joined to the origin, O(0,0), to form a triangle Δ OPQ.
 *
 * There are exactly fourteen triangles containing a right angle that can be
 * formed when each co-ordinate lies between 0 and 2 inclusive; that is,
 * 0 ≤ x1, y1, x2, y2 ≤ 2.
 *
 * Given that 0 ≤ x1, y1, x2, y2 ≤ 50, how many right triangles can be formed ?
 */

const { gcd } = require('../../lib/math');

this.solve = function () {
  const maxCoord = 50;
  let rt; // number of right triangles

  // 1 - Right angle at the origin.

  // First let's consider all triangles with a right angle at the origin. These
  // triangles are drawn by joining O, P, Q with P laying on the y-axis, and Q
  // laying on the x-axis : O(0, 0), P(x1=0, y1), Q(x2, y2=0).

  // We only have two variables here, y1 and x2, so the number of triangles with
  // a right angle at the origin is just the number of distinct pairs (x, y).

  // Given that 0 ≤ x1, y1, x2, y2 ≤ 50, we got 50^2 pairs.
  rt = maxCoord**2;

  // 2 - Right angle on the x-axis xor y-axis

  // Then, for each pair ( P(0, y1), Q(x2, 0) ), we can get 2 other triangles :
  //  - moving P horizontally to x2, we obtain a right angle in Q, on the x-axis
  //  - moving Q vertically to y1, we obtain a right angle in P, on the y-axis

  // | Right angle at O(0,0) | Right angle on x-axis | Right angle on y-axis |
  // |        _______        |        _______        |        _______        |
  // |       |\      |       |       |  /|   |       |       |r /    |       |
  // |       | \     |       |       | / |   |       |       | /     |       |
  // |       |r_\____|       |       |/_r|___|       |       |/______|       |

  // Actually from each of these pairs we can draw a unique rectangle, and we
  // are just counting 3 of its 4 right angles, excluding the one that does not
  // involve the origin.

  // So, we got 3 times 50^2 pairs, or 50^2 * 3 right triangles.
  rt *= 3;

  // 3 - Other triangles

  // Now we need to find all other right triangles, that is all triangles having
  // a right angle, say in P, where P is neither on the y-axis nor the x-axis.

  // In other words, given O(0, 0) and P(x, y), how many points Q with integer
  // coordinates that fits into the plane are there along the line perpendicular
  // to OP which passes through P ?

  // Given any P(x, y) with 0 > (x, y) > 50, we know that :
  // -> The slope of the line drawn by OP is y/x.
  // -> PQ must be perpendicular to OP, so the slope of PQ is the negative
  //    reciprocal slope of OP, which is -x/y.

  // First let's say we want to find the integer coordinates lying along OP, we
  // start from the origin, and we know that to reach P(x, y) we must travel y
  // steps along the y-axis for x steps along the x-axis.
  // -> Therefore, if both x and y have a common divisor d, we have a point in
  // (x/d, y/d).
  // -> Actually if we take their greatest common divisor, we obtain the number
  // of integer points along OP, including P :
  // -> With d = gcd(x, y), points = [ (nx/d, ny/d) for n in 1:d ]

  // For example, if we take P(9, 11) then the slope of OP is 11/9 which is an
  // irreducible fraction because gcd(9, 11) = 1, but if we move P to (9, 12),
  // the fraction can be reduced by a factor of d=3, gcd(9, 12), which means
  // that there are 3 integer points on OP (excluding O, including P).

  // Knowing that, we can state that for each point with integer coordinates
  // (x', y') lying on the line drawn by OP, with d = gcd(x, y) :
  // -> x' is a multiple of x/d,
  // -> y' is a multiple of y/d

  // So starting with P(9, 12), d = 3, we would obtain the integer coordinates
  // (x', y') such that x' = k * 9/3, and y' = k * 12/3, with k > 0 :
  //  [ (3, 4), (6, 8), (9, 12), ... ]

  // Now, since we need to find the Q's along the perpendicular to OP passing
  // through P, we can apply the same logic considering a slope of -x/y instead
  // of y/x, starting from P instead of the origin, meaning we can go downwards
  // and upwards, as long as the coordinates of Q are in the given range, ie. :
  // - counting the Qx's, the multiple of y/d that fits the plane horizontally,
  // - counting the Qy's, the multiple of |-x/d| that fits the plane vertically,
  // - take the min(nQx, nQy) to get the number of point Q that can be drawn on
  //   the plane, and thus the number of right triangle OPQ.

  // -> Optimization :
  // Given that 0 ≤ x1, y1, x2, y2 ≤ 50 (square grid), every pair (x, y) can be
  // swapped to its counterpart (y, x) for which we will obtain the same result,
  // so we don't need to consider (y, x) if we already considered (x, y), but
  // just consider the pair (x, y) twice, except when x = y as it refers to one
  // single point along the diagonal y = x.
  // We can also swipe x and y for counting upwards instead of downards (not the
  // same result but same function to get it).

  // Helper to count the number of integer coordinates downards (x,y) that are
  // in the required range (x,y are positive integers so the slope is always
  // negative).
  const downwards = (x, y, dx, dy) => {
    const nx = (maxCoord-x)/dx;
    const ny = y/dy;
    return Math.floor(Math.min(nx, ny));
  };

  // Given P(x,y) counts the number of points Q such that OPQ draws a triangle
  // with right angle in P.
  const countQs = (x, y, dx, dy) => {
    // Counting upwards amount to counting downwards after swapping x,y.
    return downwards(x, y, dx, dy) + downwards(y, x, dy, dx);
  }

  // Count the number of Q's for each combination (x,y) representing both P(x,y)
  // and P(y,x), with 0 < x <= 50 and y >= x.
  for (let x=1; x<=maxCoord; x++) {
    rt += 2 * Math.min(x, maxCoord-x);    // when y = x, countQs(x, x, 1, 1)
    for (let y=x+1; y<=maxCoord; y++) {
      const d = gcd(x, y);
      const [dx, dy] = [y/d, x/d];        // [ |y/d|, |-x/d| ]
      rt += 2 * countQs(x, y, dx, dy);
    }
  }

  return rt;
}

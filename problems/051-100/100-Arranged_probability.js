/**
 * Problem 100 - Arranged probability
 *
 * @see {@link https://projecteuler.net/problem=100}
 *
 * If a box contains twenty-one coloured discs, composed of fifteen blue discs
 * and six red discs, and two discs were taken at random, it can be seen that
 * the probability of taking two blue discs :
 *
 *    P(BB) = (15/21)×(14/20) = 1/2
 *
 * The next such arrangement, for which there is exactly 50% chance of taking
 * two blue discs at random, is a box containing eighty-five blue discs and
 * thirty-five red discs.
 *
 * By finding the first arrangement to contain over 10^12 = 1,000,000,000,000
 * discs in total, determine the number of blue discs that the box would
 * contain.
 */

const { sqrtExpansions } = require('../../lib/math');

this.solve = function () {
  const minNDiscs = 10**12;

  // Let b, r, respectively the number of blue and red discs, and n the total
  // number of discs, such that b + r = n >= minNDiscs.

  // We have :
  //  P(BB) = P1(B)*P2(B) = 1/2, with P1(B) > sqrt(1/2) > P2(B), and
  //  P1(B) = b/n
  //  P2(B) = (b-1)/(n-1)

  // Developping P(BB) :
  //  (b/n) * ((b-1)/(n-1)) = 1/2
  //  b(b-1) / n(n-1) = 1/2
  //  b²-b = (n²-n)/2
  //  2b² - 2b - n² + n = 0

  // We obtain a quadratic diophantine equation : 2⁢x² - y² - 2⁢x + y = 0

  // It draws a rectangular hyperbola (conic section), which is not centered
  // at the origin, but have its transverse axis parallel to the x-axis.
  // @see graph https://www.desmos.com/calculator/ydprqrmbkh

  // The standard form of the equation of a hyperbola with center (h, k) and
  // transverse axis parallel to the x-axis is (x - h)²/a² - (y - k)²/b² = c,
  // and the equations of the asymptotes are y = ±b/a * (x - h) + k.
  // @see
  //  https://en.wikipedia.org/wiki/Hyperbola
  //  https://courses.lumenlearning.com/waymakercollegealgebra/chapter/equations-of-hyperbolas/

  // Let's transform the equation in a standard form, we obtain :
  //  ⁢x² - ⁢x - y²/2 + y/2 = 0
  //  (x - 1/2)² - (y - 1/2)²/2 = 1/8

  // We got h=1/2, k=1/2, a=1 and b=√2, and thus the asymptote equation :
  //  y = b/a * (x - h) + k
  //  y = √2 (x - 1/2) + 1/2

  // Nb. a simple diophantine (Pell) equation of the form x² - ny² = 1 has an
  // asymptote y = x/√n, and integer solutions are found by using the continued
  // fraction expansion of the square root of n (@see problem 66).

  // Here we will use the same logic : as the slope of the asymptote is √2, we
  // can use the convergents of √2 to produce linear functions that pass through
  // the center (h,k) and intersect the curve on lattice points.

  // One out of two convergeants produce a function that intersects the curve,
  // (ie. 1 < √2, 3/2 > √2, 7/5 < √2, ... ) the others diverge from it and can
  // be discarded.

  // Let n ∈ 2ℕ+1, and pₙ/qₙ the corresponding convergeant of √2. Substituting
  // it to √2 in the asymptote equation we got y = pₙ/qₙ (x - 1/2) + 1/2, for
  // which the first (smallest) integer pair (x, y) intersects the hyperbola,
  // and is thus a solution to the diophantine. Finding such pair is now trivial
  // since we got the slope of the linear function, pₙ/qₙ, and we know it passes
  // through the center (h, k) :
  //
  //    x = (qₙ+1)/2
  //    y = (pₙ+1)/2
  //
  //  n     pₙ/qₙ   Substitution                Integer solutions       (x, y)
  //  1.    1/1    y = 1(x - 1/2) + 1/2 = x   ( (1+1)/2, (1+1)/2 )     (1, 1)
  //  3.    7/5    y = 7/5(x - 1/2) + 1/2     ( (5+1)/2, (7+1)/2 )     (3, 4)
  //  5.   17/12   y = 41/29(x - 1/2) + 1/2   ( (29+1)/2, (41+1)/2 )   (15, 21)
  //  ...

  // We just need to adjust the number of expansions of the continued fraction
  // representation of √2 so that one convergent finally produces a solution
  // for which the total number of discs (y) exceeds minNDiscs.

  const sqrt2 = sqrtExpansions(2, 35); // the 33th convergent yields a solution

  for (let i=0; i<sqrt2.length; i+=2) {
    const [p, q] = sqrt2[i];
    const [x, y] = [(q+1n)/2n, (p+1n)/2n];
    if (y > minNDiscs)
      return x;
  }

  // Note: we could also worked out the diophantine relating blue and red discs
  // (instead of blue and total number). In this case we would substitute b+r to
  // n in the first equation and obtain another quadratic diophantine :
  //
  //  x² - 2xy - y² - x + y = 0
  //
  // Working out center (h=1/2, k=0), and the asymptote with positive slope :
  //
  //  y = (√2 - 1)(x - 1/2)
  //
  // The integer solutions given the convergeant of √2, pₙ/qₙ, would be :
  //
  //    x = (qₙ+1)/2
  //    y = (pₙ-qₙ)/2
  //
}

// Alternative method
this.solve2 = function () {

  // There is an interesting method to find integer solutions to a quadratic
  // diophantine which is called Vieta Jumping.
  // @see https://en.wikipedia.org/wiki/Vieta_jumping#Geometric_interpretation

  // The idea is that we can produce integer points by alternatively flipping
  // some roots. By doing this the paths from one point to another draw a double
  // spiral, meaning we can go outward to find greater roots, or inward to find
  // smaller roots back to the origin.

  // The first thing to note is that the diophantine equation used in the first
  // method cannot be used because it's graph is not symmetric with respect to
  // the line y = x, and it misses a ±kxy part (ie. by flipping roots we would
  // be stuck in a square instead of jumping out of a spiral).

  // Though the second equation (see Note above) fits the condition :
  //
  //  x² - 2xy - y² - x + y = 0
  //
  // @see graph https://www.desmos.com/calculator/uwie6si9zy

  // Given an integer point (x,y) on the spiral, we got two other points :
  // -> one with the same x-value : (x, -2x - y + 1)
  // -> one with the same y-value : (-x + 2y + 1, y)

  // Since we want only the positive roots, we can apply several flips at once
  // because only one out of four points in one spiral will have positive values
  // for both x and y. So let's say start with a positive root point (x,y) :
  //  -> we need to go vertically to go outward, so we define :
  //      y′ = -2x - y + 1
  //  -> now y′ is negative, we go horizontally by flipping x :
  //      x′ = -x + 2y′ + 1
  //      x′ = -x + 2(-2x - y + 1) + 1
  //      x′ = -5x - 2y + 3
  //  -> both x′ and y′ are negative, now flipping y′ we get :
  //      y″ = -2x′ - y′ + 1
  //      y″ = -2(-5x - 2y + 3) - (-2x - y + 1) + 1
  //      y″ = 12x + 5y - 6
  //  -> and finally we flip x′, which gives :
  //      x″ = -x′ + 2y″ + 1
  //      x″ = -(-5x - 2y + 3) + 2(12x + 5y - 6) + 1
  //      x″ = 29x + 12y - 14

  // So we can obtain new solutions by applying the following transformations
  // recursively :
  //  xₙ₊₁ = 29xₙ + 12yₙ - 14
  //  yₙ₊₁ = 12xₙ + 5yₙ - 6

  // Nb. We need to do this on both branches of the spiral to get all solutions,
  // starting with 2 positive roots in respect to each branch, which we got from
  // the problem description (otherwise we could have started at the origin and
  // initiate the spiral using the vertical and horizontal transformation to
  // produce the first positive roots).

  const minNDiscs = 10**12;

  const spiral = [
    [ [15, 6 ] ],  // branch 0
    [ [85, 35] ]   // branch 1
  ];

  const vietaJump = ([x, y]) => [29*x + 12*y - 14, 12*x + 5*y - 6];

  let x, y;
  let i = 0;

  do {
    const branch = i++ % 2;
    [x, y] = vietaJump(spiral[branch].last());
    spiral[branch].push([x, y]);
  }
  while (x + y <= minNDiscs);

  return x;
}

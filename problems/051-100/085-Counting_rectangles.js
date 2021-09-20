/**
 * Problem 85 - Counting rectangles
 *
 * @see {@link https://projecteuler.net/problem=85}
 *
 * By counting carefully it can be seen that a rectangular grid measuring 3 by 2
 * contains eighteen rectangles.
 *
 * Although there exists no rectangular grid that contains exactly two million
 * rectangles, find the area of the grid with the nearest solution.
 */

const { quadratic } = require('../../lib/math');

this.solve = function () {
  // Drawing a rectangle contained in a rectangular grid can be done by picking
  // two horizontal lines and two vertical lines from that grid, and then draw
  // the intersection of these lines.

  // Actually, by intersecting any pair of horizontal lines with any pair of
  // vertical lines of a grid, we can count all its rectangles.

  // Let m,n two integers such that 0 < m <= n,

  // In a m*n grid, we got m+1 horizontal lines and n+1 vertical lines, which
  // means we got :
  //  `m+1 choose 2` distinct pairs of horizontal lines
  //  `n+1 choose 2` distinct pairs of vertical lines

  // The number of intersections or rectangles that can be drawn is just the
  // product of these two numbers.

  // A binomial coefficient (n choose k) is given by the formula :
  //  (nCk) = n!/(k!(n-k)!)

  // We have a product of binomial coefficients with k=2, which we can write :
  //  f(m,n) = (mCk) * (nCk)
  //         = ( m!/(2(m-2)!) ) * ( n!/(2(n-2)!) )
  //         = ( m(m-1)/2 ) * ( n(n-1)/2 )
  //         = m(m-1) * n(n-1) * 1/4

  // We substitute m with m+1 and n with n+1 and we obtain :
  //  f(m,n) = m(m+1)n(n+1)/4

  // Now we got a function f(m,n) that gives the number of rectangles contained
  // in a m*n grid.

  // So we want to find any m,n pairs for which f(m,n) ~= 2 000 000.

  // But we can remove the term 1/4 from f(m,n) and target 4*2e6 instead :
  //  Let g(m,n) = 4*f(m,n)
  //      g(m,n) = m(m+1)n(n+1)

  const nRect = 2e6;
  const target = 4*nRect;

  // Actually we can still use a simpler function :
  //  Let h(x) = x(x+1), so that 4*f(m,n) = h(m) * h(n)

  const h = x => x*(x+1);

  // Now we want to find any m,n pairs for which h(m)*h(n) ~= target.

  // Then, given some positive integer m <= n, we can use the quadratic formula
  // to find the values of n for which the product h(m)*h(n) is as close to the
  // target as possible, in this context we already got hm = h(m), then :
  //  h(m)*h(n) = target
  //  hm * n(n+1) = target
  //  hm*n² + hm*n - target = 0
  //
  // With x the positive root of that equation, as we need to find the nearest
  // (integer) solution for the number of rectangles, we can then use both :
  //  n = ⌊x⌋, for a solution with almost but less than nRect rectangles
  //  n = ⌈x⌉, for a solution with almost but more than nRect rectangles

  // By doing this we compute only the best m,n candidates.

  // Keep the nearest solution as :
  let nearest = {
    m: null,
    n: null,
    rect: null,    // number of rectangles for an m*n grid
    diff: Infinity // difference between that number (rect) and nRect
  }

  let m = 0, n;
  do {
    const hm = h(++m);
    [, n] = quadratic(hm, hm, -target);
    [Math.floor(n), Math.ceil(n)].forEach(n => {
      const rect = hm*h(n)/4;
      const diff = Math.abs(nRect - rect);
      if (diff < nearest.diff)
        nearest = { m, n, rect, diff };
    });
  } while (m < n);

  // Return the area of the corresponding grid
  return nearest.m*nearest.n;
}

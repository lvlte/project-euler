/**
 * Problem 66 - Diophantine equation
 *
 * @see {@link https://projecteuler.net/problem=66}
 *
 * Consider quadratic Diophantine equations of the form: x² - Dy² = 1
 *
 * For example, when D=13, the minimal solution in x is 649² – 13×180² = 1.
 *
 * It can be assumed that there are no solutions in positive integers when D is
 * square.
 *
 * By finding minimal solutions in x for D = {2, 3, 5, 6, 7}, we obtain the
 * following:
 *      3² – 2×2² = 1
 *      2² – 3×1² = 1
 *      9² – 5×4² = 1
 *      5² – 6×2² = 1
 *      8² – 7×3² = 1
 *
 * Hence, by considering minimal solutions in x for D ≤ 7, the largest x is
 * obtained when D=5.
 *
 * Find the value of D ≤ 1000 in minimal solutions of x for which the largest
 * value of x is obtained.
 */

// Diophantine equations of the form x²-Dy²=1 are known as Pell's equation,
// also called the Pell–Fermat equation.
const { Pell } = require('../../lib/math');

this.solve = function () {
  let largest = {D: null, x: 0};

  for (let D=2; D<=1000; D++) {
    const d = Pell(D);
    if (!d)
      continue;
    const [x,] = d;
    if (x > largest.x)
      largest = {D, x};
  }

  return largest.D;
}

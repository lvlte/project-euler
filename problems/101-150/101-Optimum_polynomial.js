/**
 * Problem 101 - Optimum polynomial
 *
 * @see {@link https://projecteuler.net/problem=101}
 *
 * If we are presented with the first k terms of a sequence it is impossible to
 * say with certainty the value of the next term, as there are infinitely many
 * polynomial functions that can model the sequence.
 *
 * As an example, let us consider the sequence of cube numbers. This is defined
 * by the generating function, uₙ = n³: 1, 8, 27, 64, 125, 216, ...
 *
 * Suppose we were only given the first two terms of this sequence. Working on
 * the principle that "simple is best" we should assume a linear relationship
 * and predict the next term to be 15 (common difference 7). Even if we were
 * presented with the first three terms, by the same principle of simplicity,
 * a quadratic relationship should be assumed.
 *
 * We shall define OP(k, n) to be the nth term of the optimum polynomial
 * generating function for the first k terms of a sequence. It should be clear
 * that OP(k, n) will accurately generate the terms of the sequence for n ≤ k,
 * and potentially the first incorrect term (FIT) will be OP(k, k+1); in which
 * case we shall call it a bad OP (BOP).
 *
 * As a basis, if we were only given the first term of sequence, it would be
 * most sensible to assume constancy; that is, for n ≥ 2, OP(1, n) = u₁.
 *
 * Hence we obtain the following OPs for the cubic sequence:
 *
 *    OP(1, n) = 1                1, <1>, ...
 *    OP(2, n) = 7n − 6           1, 8, <15>, ...
 *    OP(3, n) = 6n² − 11n + 6    1, 8, 27, <58>, ...
 *    OP(4, n) = n³               1, 8, 27, 64, 125, ...
 *
 * Clearly no BOPs exist for k ≥ 4.
 *
 * By considering the sum of FITs generated by the BOPs (indicated in <> above),
 * we obtain 1 + 15 + 58 = 74.
 *
 * Consider the following tenth degree polynomial generating function:
 *
 *    uₙ = 1 − n + n² − n³ + n⁴ − n⁵ + n⁶ − n⁷ + n⁸ − n⁹ + n¹⁰
 *
 * Find the sum of FITs for the BOPs.
 */

const { rowReduct, sum } = require('../../lib/math');
const { range } = require('../../lib/utils');

this.solve = function () {
  const degree = 10;

  function U(n) {
    return 1 - n + n*n - n**3 + n**4 - n**5 + n**6 - n**7 + n**8 - n**9 + n**10;
  }

  const series = range(1, degree+1).map(U);

  // We define OP(k, n); as a polynomial of degree k-1 given the first k terms
  // of our series.
  function OP(k, n) {
    const terms = series.slice(0, k);

    // For polynomial of degree >= 2 we use Gaussian elimination to create the
    // optimum generating functions, for lower degree the values are trivial.
    switch (k) {
      case 1:
        return terms[0];

      case 2: {
        // degree 1 : y = ax + b
        const a = terms[1] - terms[0];
        const b = terms[0] - a;
        return a*n + b;
      }

      case 3: {
        // 2nd degree polynomial : y = ax² + bx + c
        // (demonstrates the default case with specific values for vizualizing)
        // We need to produce 3 linear equations that express the relationships
        // between the terms themselves and the coefficients a, b, and c so that
        // we can retrieve their values using row reduction.
        const M = terms.map((y, i) => {
          const x = i + 1;
          return [x**2, x, 1, y]; // a*x² + b*x + c*1 = y
        });
        const [a, b, c] = rowReduct(M).map(Math.round);
        return a*n**2 + b*n + c;
      }

      default: {
        // Produce k linear equations to solve for k unknowns.
        const M = terms.map((y, i) => {
          const x = i + 1;
          return [ ...range(k-1, -1, -1).map(p => x**p), y];
        });
        const coeff = rowReduct(M).map(Math.round);
        return sum(coeff.map((m, i) => m*n**(k-1-i)));
      }
    }
  }

  let sumOfFITs = 0;
  for (let k=1; k<=degree; k++) {
    // The 1st potential incorrect term is OP(k, k+1);
    let n = k + 1;
    let nthTerm = OP(k, n);
    while (nthTerm === series[n-1])
      nthTerm = OP(k, ++n);
    sumOfFITs += nthTerm;
  }

  return sumOfFITs;
}

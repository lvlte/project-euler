/**
 * Problem 57 - Square root convergents
 *
 * @see {@link https://projecteuler.net/problem=57}
 *
 * It is possible to show that the square root of two can be expressed as an
 * infinite continued fraction.
 *
 *  √2 = 1+(1/(2+1/(2+1/(2+...))))
 *
 * [...]
 *
 * In the first one-thousand expansions, how many fractions contain a numerator
 * with more digits than the denominator ?
 */

const { digits } = require('../../lib/utils');

this.solve = function () {
  const maxExpansions = 1000;

  // So we got a periodic continued fraction :
  //  √2 = [1; 2, 2, ...]

  // Starting the convergents series [p/q] with :
  //  S = [ 1/1, 1/1 + 1/2, ... ]

  // For each expansion of the continued fraction, we can express both numerator
  // and denominator as S(n) = 2*S(n-1) + S(n-2)

  // @see `../ref/Period of the Continued Fraction of √n.pdf`
  // @see _Math.sqrtExpansions(n, maxExpansions)

  // Expansion series for the square root of two [ [p, q], ...]
  let S = Array(maxExpansions);
  S[0] = [1n, 1n];
  S[1] = [3n, 2n];

  let i = 1;
  let count = 0;
  while (++i <= maxExpansions) {
    const p = 2n*S[i-1][0] + S[i-2][0];
    const q = 2n*S[i-1][1] + S[i-2][1];
    S[i] = [p, q];
    if (digits(p, false).length > digits(q, false).length)
      count++;
  }

  return count;
}

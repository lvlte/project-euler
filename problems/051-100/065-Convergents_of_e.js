/**
 * Problem 65 - Convergents of e
 *
 * @see {@link https://projecteuler.net/problem=65}
 *
 * The square root of 2 can be written as an infinite continued fraction. [...]
 *
 * The infinite continued fraction can be written: √2 = [1;(2)], (2) indicates
 * that 2 repeats ad infinitum. In a similar way, √23 = [4;(1,3,1,8)].
 *
 * It turns out that the sequence of partial values of continued fractions for
 * square roots provide the best rational approximations. [...]

 * What is most surprising is that the important mathematical constant,
 *   e = [2;(1,2,1,1,4,1,1,6,1,...,1,2k,1,...)]
 *
 * The first ten terms in the sequence of convergents for e are:
 *  2, 3, 8/3, 11/4, 19/7, 87/32, 106/39, 193/71, 1264/465, 1457/536, ...
 *
 * The sum of digits in the numerator of the 10th convergent is 1+4+5+7 = 17
 *
 * Find the sum of digits in the numerator of the 100th convergent of the
 * continued fraction for the mathematical constant e.
 */

const { remZero, sum } = require('../../lib/math');
const { digits } = require('../../lib/utils');

this.solve = function () {
  const nExpansions = 100;

  // We saw in problem 057-Square_root_convergents how to expand the square root
  // convergeant series from its continued fraction representation.

  // For e, the period of the continued fraction is infinite but hopefully there
  // is the (1, 2k, 1) cyclic pattern.

  // We will use the pattern (2k, 1, 1) for convenience since the 2k's are met
  // when n % 3 = 0.

  // So, for each expansion of the infinite continued fraction of e, we can
  // express both numerator and denominator as, with n > 2 :
  //  n: 1, 2,3,4,5,6,7,8,9,...
  //    [2;(1,2,1,1,4,1,1,6,...)]
  //          ^ ^ ^
  //          |-> S(n) = 2k*S(n-1) + S(n-2)
  //            |-> S(n) = S(n-1) + S(n-2)
  //              |-> S(n) = S(n-1) + S(n-2)

  // Expansion series for e.
  let S = [[2n, 1n], [3n, 1n]];
  let n = S.length;

  while (++n <= nExpansions) {
    const i = n-1;
    let p, q;
    if (remZero(n, 3)) {
      const k2 = BigInt(2*n/3);
      p = k2*S[i-1][0] + S[i-2][0];
      q = k2*S[i-1][1] + S[i-2][1];
    }
    else {
      p = S[i-1][0] + S[i-2][0];
      q = S[i-1][1] + S[i-2][1];
    }
    S[i] = [p, q];
  }

  return sum(digits(S.at(-1)[0]));
}

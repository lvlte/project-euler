/**
 * Problem 119 - Digit power sum
 *
 * @see {@link https://projecteuler.net/problem=119}
 *
 * The number 512 is interesting because it is equal to the sum of its digits
 * raised to some power: 5 + 1 + 2 = 8, and 8³ = 512.
 *
 * Another example of a number with this property is 614656 = 28⁴.
 *
 * We shall define aₙ to be the nth term of this sequence and insist that a
 * number must contain at least two digits to have a sum.
 *
 * You are given that a₂ = 512 and a₁₀ = 614656.
 *
 * Find a₃₀.
 */

const { sum, nthRoot } = require('../../lib/math');
const { digits } = require('../../lib/utils');

this.solve = function () {

  // Let x = base^exp.

  // Basically, we need to produce some pairs of (base, exp) and check whether
  // or not the digit sum of x is equal to the base, in which case we store the
  // result in an array that we can sort later.

  // The only difficulty in this problem is to produce these pairs in such a way
  // that x increases, otherwise it would be hard to break the search at some
  // point without making assumptions.

  // To do that, we can specify an arbitrary range of integers [xMin, xMax], and
  // produce all integer pairs (base, exp) such that xMin ≤ base^exp ≤ xMax. By
  // starting with xMin=10 (the first integer with 2 digits), we know at the end
  // the batch that we covered all possible values of x lower than or equal to
  // xmax, which means at this point we can measure the length of our sequence
  // and either break the search, or repeat the process with higher ranges until
  // we got at least 30 matches.

  // Also, by using ranges of powers of ten, we can set a limit for the possible
  // bases that should match the expression. For example with xMax=1000, we know
  // the highest digit sum for x is when x=999, that is 9+9+9, which in terms of
  // xMax is equal to 9*log10(xMax).

  // Nb. An instinctive way of producing (base, exp) pairs is probably to have
  // a loop for the bases and an inner loop for the exponents, which I did :
  //
  //   const baseMax = Math.min(9*Math.log10(xMax), Math.sqrt(xMax));
  //   for (let base=2; base<=baseMax; base++) {
  //     const expMin = Math.max(2, Math.ceil(logb(xMin, base)));
  //     const expMax = Math.floor(logb(xMax, base));
  //     for (let exp=expMin; exp<=expMax; exp++) {
  //       ...
  //     }
  //   }
  //
  // but I realized then than the other way around is a bit more effective.

  const A = [];
  const n = 30;
  let [xMin, xMax] = [10, 1000];

  do {
    const baseCeil = 9*Math.log10(xMax);
    for (let exp=2, rtMax; (rtMax=nthRoot(xMax, exp)) >= 2; exp++) {
      const baseMin = Math.max(2, Math.ceil(nthRoot(xMin, exp)));
      const baseMax = Math.min(baseCeil, Math.floor(rtMax));
      for (let base=baseMin; base<=baseMax; base++) {
        const x = base**exp;
        if (sum(digits(x)) === base)
          A.push({x, base, exp});
      }
    }
    [xMin, xMax] = [xMax+1, xMax*10];
  } while(A.length < n);

  A.sort((a, b) => a.x - b.x);

  return A[n-1].x;
}

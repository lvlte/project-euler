/**
 * Problem 80 - Square root digital expansion
 *
 * @see {@link https://projecteuler.net/problem=80}
 *
 * It is well known that if the square root of a natural number is not an
 * integer, then it is irrational. The decimal expansion of such square roots
 * is infinite without any repeating pattern at all.
 *
 * The square root of two is 1.41421356237309504880..., and the digital sum of
 * the first one hundred decimal digits is 475.
 *
 * For the first one hundred natural numbers, find the total of the digital sums
 * of the first one hundred decimal digits for all the irrational square roots.
 */

const { isSquare, sqrtExpansions, sum } = require('../../lib/math');
const { digits } = require('../../lib/utils');

this.solve = function () {
  const nMax = 100;
  const decimals = 100;

  // We will use the continued fraction expansion of the square roots to compute
  // decimals, @see sqrtExpansions().

  // Numerators and denominators are BigInt, which means we need to multiply the
  // numerator by ten raised to the power of one hundred to compute the division
  // p/q with a precision of one hundred decimals (because only the integer part
  // is considered with bigint).
  const exponent = BigInt(decimals);

  // How many expansions do we need to obtain at least the required precision ?
  // For now it's adjusted by hand by testing if that many expansions is enough
  // to make the 100 first decimals of p/q always the same as it would be with
  // more expansions. It would be nice though to find a mathematical trick that
  // could tell the minimum number of expansions required to obtain the first n
  // decimals of an irrational square root.
  const expansions = 200;

  let digitSum = 0;
  for (let n=2; n<=nMax; n++) {
    if (isSquare(n))
      continue;
    const [p, q] = sqrtExpansions(n, expansions).last();
    const digitStr = String((p*10n**exponent)/q).substr(0, decimals);
    digitSum += sum(digits(digitStr));
  }

  return digitSum;
}

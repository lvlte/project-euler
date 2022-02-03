/**
 * Problem 104 - Pandigital Fibonacci ends
 *
 * @see {@link https://projecteuler.net/problem=104}
 *
 * The Fibonacci sequence is defined by the recurrence relation:
 *
 *      Fₙ = Fₙ−₁ + Fₙ−₂, where F₁ = 1 and F₂ = 1.
 *
 * It turns out that F₅₄₁, which contains 113 digits, is the first Fibonacci
 * number for which the last nine digits are 1-9 pandigital (contain all the
 * digits 1 to 9, but not necessarily in order).
 *
 * And F₂₇₄₉, which contains 575 digits, is the first Fibonacci number for
 * which the first nine digits are 1-9 pandigital.
 *
 * Given that Fₖ is the first Fibonacci number for which the first nine digits
 * AND the last nine digits are 1-9 pandigital, find k.
 */

const { φ } = require('../../lib/math');

this.solve = function () {
  // The idea is to use modular arithmetic to only keep track of the last nine
  // digits of Fₖ, thus avoiding to work with hundreds-digits (BigInt) numbers
  // and improve performance.

  // When we find a Fibonacci number for which the last nine digits are 1-9
  // pandigital, we can compute Fₖ to check for the first nine digits, but again
  // we can avoid to compute the whole number and directly get to the digits of
  // interest by using base 10 logarithms (ie. handling d instead of 10^d).

  // Knowing that :
  //  Fₙ = (φⁿ - ψⁿ) / √5, and ψⁿ/√5 < 1/2 for any n >= 0
  //  Fₙ = ⌊ φⁿ/√5 ⌉       (rounded to nearest integer)

  // Let Fₙ = 10^d,
  //  d ≈ log10(φⁿ/√5)
  //  d ≈ log10(φⁿ) - log10(√5)            log(a/b) = log(a) - log(b)
  //  d ≈ n*log10(φ) - log10(√5)           log(x^n) = n*log(x)

  // So the only variable here is n !

  // Even if d is not exact, it will be precise enough to retrieve the first
  // digits of Fₙ, actually we just need to adjust its integral part (knowing
  // that it represents the number of digits before the radix point of Fₙ).

  // For example, let 10^d = 123456789123.456, we decrement d to get a 9-digit
  // integer part 10^(d-3) = 123456789.123456, which just need to be truncated.

  // Precomputing constants.
  const LOGφ = Math.log10(φ);
  const LOG5 = Math.log10(Math.sqrt(5));

  // Returns the first nine digits of Fₙ, given n.
  const fib9 = n => {
    const d = n*LOGφ - LOG5;
    const x = d - Math.floor(d) + 8;
    return Math.floor(10**x);
  }

  // Checks whether or not n is a 1-9 pandigital number.
  const isPandigital = n => {
    const D = new Set(''+n);
    if (D.size != 9 || D.has('0'))
      return false;
    return true;
  };

  // The last nine digits of Fₖ corresponds to Fₖ modulo m = 10^9.
  const m = 10**9;

  // First two Fibonacci number, for k=0, k=1.
  let [a, b] = [0, 1];
  let k = 1;

  while (++k) {
    [a, b] = [b, (a+b) % m];
    if (isPandigital(b) && isPandigital(fib9(k)))
      break;
  }

  return k;
}

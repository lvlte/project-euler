/**
 * Problem 33 - Digit cancelling fractions
 *
 * @see {@link https://projecteuler.net/problem=33}
 *
 * The fraction 49/98 is a curious fraction, as an inexperienced mathematician
 * in attempting to simplify it may incorrectly believe that 49/98 = 4/8, which
 * is correct, is obtained by cancelling the 9s.
 *
 * We shall consider fractions like, 30/50 = 3/5, to be trivial examples.
 *
 * There are exactly four non-trivial examples of this type of fraction, less
 * than one in value and containing two digits in the numerator and denominator.
 *
 * If the product of these four fractions is given in its lowest common terms,
 * find the value of the denominator.
 */

const { remZero, gcd } = require('../../lib/math');

this.solve = function () {
  // There are only 2 digits in both the numerator and denominator, so we can
  // do some brute force to find these digit cancelling fractions.

  const limit = 100;
  const min = 10;

  const isTrivial = (n, d) => remZero(n, 10) && remZero(d, 10);

  const haveCommonDigits = (n, d) => {
    n = ''+n;
    const [d1, d2] = ''+d;
    return n.includes(d1) || n.includes(d2);
  };

  const wrongCancelling = (n, d) => {
    const [n1, n2] = ''+n;
    const [d1, d2] = ''+d;
    return n2 === d1 ? [+n1, +d2] : false;
  }

  // Digit cancelling fractions product ([n, d] represents n/d).
  let fractionP = [1, 1];

  for (let d=min; d<limit; d++) {
    for (let n=min; n<d; n++) {
      if (isTrivial(n, d) || !haveCommonDigits(n ,d))
        continue;
      const r = wrongCancelling(n, d);
      if (!r)
        continue;
      if (r[0]/r[1] === n/d) {
        fractionP[0] *= r[0];
        fractionP[1] *= r[1];
      }
    }
  }

  // Reducing the fraction to its lowest form
  let [n, d] = fractionP;
  let div;
  do {
    div = gcd(n, d);
    n /= div;
    d /= div;
  } while (div > 1);

  return d;
}

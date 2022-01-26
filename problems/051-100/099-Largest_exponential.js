/**
 * Problem 99 - Largest exponential
 *
 * @see {@link https://projecteuler.net/problem=99}
 *
 * Comparing two numbers written in index form like 2¹¹ and 3⁷ is not difficult,
 * as any calculator would confirm that 2^11 = 2048 < 3^7 = 2187.
 *
 * However, confirming that 632382^518061 > 519432^525806 would be much more
 * difficult, as both numbers contain over three million digits.
 *
 * Using p099_base_exp.txt, a 22K text file containing one thousand lines with
 * a base/exponent pair on each line, determine which line number has the
 * greatest numerical value.
 *
 * NOTE: The first two lines in the file represent the numbers in the example
 * given above.
 */

const { load } = require('../../lib/utils');
const baseExp = load('p099_base_exp.txt');

this.solve = function () {
  // We will use the logarithm "power rule" so that we can compare reasonable
  // values : logb(x^n) = n*logb(x)

  let max = 0;
  let line;

  baseExp.forEach(([base, exp], i) => {
    const n = exp * Math.log(base);
    if (n > max) {
      max = n;
      line = i + 1;
    }
  });

  return line;
}

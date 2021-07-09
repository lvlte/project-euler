/**
 * Problem 40 - Champernowne's constant
 *
 * @see {@link https://projecteuler.net/problem=40}
 *
 * An irrational decimal fraction is created by concatenating the positive
 * integers: 0.123456789101112131415161718192021...
 *                        ^
 * It can be seen that the 12th digit of the fractional part is 1.
 *
 * If dn represents the nth digit of the fractional part, find the value of the
 * following expression :
 *
 *    d1 × d10 × d100 × d1000 × d10000 × d100000 × d1000000
 */

const { product } = require('../../lib/math');

this.solve = function () {
  const nSet = [1, 10, 100, 1_000, 10_000, 100_000, 1_000_000];
  const limit = nSet[nSet.length-1];
  let fpart = '';
  let n = 0;

  // brute force: generate Champernowne's constant fractional part until its
  // length reaches the max value of n.
  while (++n && fpart.length <= limit)
    fpart += n;

  return product(nSet.map(n => fpart[n-1]));
}

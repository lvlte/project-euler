/**
 * Problem 53 - Combinatoric selections
 *
 * @see {@link https://projecteuler.net/problem=53}
 *
 * There are exactly ten ways of selecting three from five, 12345:
 *        123, 124, 125, 134, 135, 145, 234, 235, 245, and 345
 *
 * In combinatorics, we use the notation (`5 over 3`) (read "n choose k") = 10
 * In general, (`n over r`) = n!/r!(n-r)! where r ≤ n, and 0! = 1
 *
 * It is not until 23, that a value exceeds one-million: (23 over 10) = 1144066
 *
 * How many, not necessarily distinct, values of (n over r) for 1 ≤ n ≤ 100, are
 * greater than one-million ?
 */

const { nChooseK } = require('../../lib/combinatorics');

this.solve = function () {
  let nCks = 0;

  for (let n=1n; n<=100n; n++)
    for (let k=1n; k<=n; k++)
      nChooseK(n, k) > 1_000_000n && nCks++;

  return nCks;
}

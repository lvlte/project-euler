/**
 * Problem 71 - Ordered fractions
 *
 * @see {@link https://projecteuler.net/problem=71}
 *
 * Consider the fraction, n/d, where n and d are positive integers. If n<d and
 * HCF(n,d)=1, it is called a reduced proper fraction.
 *
 * If we list the set of reduced proper fractions for d ≤ 8 in ascending order
 * of size, we get:
 *
 * 1/8, 1/7, 1/6, 1/5, 1/4, 2/7, 1/3, 3/8, 2/5, 3/7, 1/2, 4/7, 3/5, 5/8, 2/3, 5/7, 3/4, 4/5, 5/6, 6/7, 7/8
 *
 * It can be seen that 2/5 is the fraction immediately to the left of 3/7.
 *
 * By listing the set of reduced proper fractions for d ≤ 1,000,000 in ascending
 * order of size, find the numerator of the fraction immediately to the left of
 * 3/7.
 */

const { fareyLeft } = require('../../lib/sequences')

this.solve = function () {

  // This problem is related to the Farey sequence.
  // @see https://mathworld.wolfram.com/FareySequence.html

  // The Farey sequence Fn for any positive integer n is the set of irreducible
  // rational numbers a/b, with 0 <= a <= b <= n and gcd(a,b) = 1, arranged in
  // increasing order :
  //  F1 = {0/1, 1/1}
  //  F2 = {0/1, 1/2, 1/1}
  //  F3 = {0/1, 1,3, 1/2, 2/3, 1/1}
  //  Fn = ...

  // Fractions which are neighbouring terms in any Farey sequence are known as
  // a Farey pair and have the following properties :
  //  - If a/b and c/d are neighbours in a Farey sequence, with a/b < c/d, then
  //    their difference c/d - a/b = 1/bd.
  //  - If bc - ad = 1 with a < b and c < d, a/b and c/d will be neighbours in
  //    the Farey sequence of order max(b,d).

  // So we actually don't need to list the set of reduced proper fractions for
  // d ≤ 1,000,000, just get the left neighbour of 3/7 in the Farey sequence of
  // order d=1000000 using the proper algorithm.

  const [n,] = fareyLeft(3, 7, 1_000_000);

  return n;
}

/**
 * Problem 72 - Counting fractions
 *
 * @see {@link https://projecteuler.net/problem=}
 *
 * Consider the fraction, n/d, where n and d are positive integers. If n<d and
 * HCF(n,d)=1, it is called a reduced proper fraction.
 *
 * If we list the set of reduced proper fractions for d ≤ 8 in ascending order
 * of size, we get:
 *
 * 1/8, 1/7, 1/6, 1/5, 1/4, 2/7, 1/3, 3/8, 2/5, 3/7, 1/2, 4/7, 3/5, 5/8, 2/3, 5/7, 3/4, 4/5, 5/6, 6/7, 7/8
 *
 * It can be seen that there are 21 elements in this set.
 *
 * How many elements would be contained in the set of reduced proper fractions
 * for d ≤ 1,000,000?
 */

const { summatoryTotient } = require('../../lib/prime');

this.solve = function () {
  const d = 1_000_000;

  // cf. Farey sequence / summatory totient.

  // The Farey sequence Fn for any positive integer n is the set of irreducible
  // rational numbers a/b, with 0 <= a <= b <= n and gcd(a,b) = 1, arranged in
  // increasing order :
  //  F1 = {0/1, 1/1}
  //  F2 = {0/1, 1/2, 1/1}
  //  F3 = {0/1, 1,3, 1/2, 2/3, 1/1}
  //  Fn = ...

  // The number of terms in the Farey sequence for the integer n is :
  //  Fn : |Fn| = 1 + Σ(m=1,n)φ(m)
  //       |Fn| = 1 + Φ(n)           where Φ() is the summatory totient function

  const N = 1 + summatoryTotient(d);

  return N - 2; // exclude 0/1 and 1/1.
}

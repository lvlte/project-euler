/**
 * Problem 73 - Counting fractions in a range
 *
 * @see {@link https://projecteuler.net/problem=73}
 *
 * Consider the fraction, n/d, where n and d are positive integers. If n<d and
 * HCF(n,d)=1, it is called a reduced proper fraction.
 *
 * If we list the set of reduced proper fractions for d ≤ 8 in ascending order
 * of size, we get:
 *
 * 1/8, 1/7, 1/6, 1/5, 1/4, 2/7, 1/3, 3/8, 2/5, 3/7, 1/2, 4/7, 3/5, 5/8, 2/3, 5/7, 3/4, 4/5, 5/6, 6/7, 7/8
 *
 * It can be seen that there are 3 fractions between 1/3 and 1/2.
 *
 * How many fractions lie between 1/3 and 1/2 in the sorted set of reduced
 * proper fractions for d ≤ 12,000?
 */

const { summatoryTotient} = require('../../lib/prime');
const { fareyNext, fareyRight } = require('../../lib/sequences');

this.solve = function () {
  // Farey sequence again (cf. previous problems).

  // The Farey sequence Fn of order n is an ascending sequence of irreducible
  // fractions between 0 and 1 whose denominators do not exceed n.

  // The sorted set of reduced proper fractions for d ≤ 12,000 corresponds to
  // the set given by the Farey sequence of order d :
  //  S = { h/k ∈ Fd } - {0/1, 1/1}

  // One idea would be to compute the next term after 1/3 and continue until
  // we get 1/2, counting terms along the way.

  // Knowing that the middle of any three successive terms in a Farey sequence
  // is the mediant of the other two, getting e/f (the right neighbor of c/d) is
  // easier to compute if we are given the Farey pair [a/b, c/d] (ie. efficient)
  // than if we were only given c/d.
  // @see fareyNext(), fareyPrev() vs fareyRight(), fareyLeft()

  // So let's start with the farey pair [1/3 and its right neighbor].
  const n = 12_000;
  let [a, b] = [1, 3];
  let [c, d] = fareyRight(a, b, n);
  let e, f;

  let count = 1;
  do {
    [e, f] = fareyNext(a, b, c, d, n);
    [a, b] = [c, d];
    [c, d] = [e, f];
  }
  while (d != 2 && count++);

  return count;
}

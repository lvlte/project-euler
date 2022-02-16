
/**
 * Problem 106 - Special subset sums: meta-testing
 *
 * @see {@link https://projecteuler.net/problem=106}
 *
 * Let S(A) represent the sum of elements in set A of size n. We shall call it
 * a special sum set if for any two non-empty disjoint subsets, B and C, the
 * following properties are true:
 *
 *    1. S(B) ≠ S(C); that is, sums of subsets cannot be equal.
 *    2. If B contains more elements than C then S(B) > S(C).
 *
 * For this problem we shall assume that a given set contains n strictly
 * increasing elements and it already satisfies the second rule.
 *
 * Surprisingly, out of the 25 possible subset pairs that can be obtained from
 * a set for which n = 4, only 1 of these pairs need to be tested for equality
 * (first rule). Similarly, when n = 7, only 70 out of the 966 subset pairs
 * need to be tested.
 *
 * For n = 12, how many of the 261625 subset pairs that can be obtained need to
 * be tested for equality?
 */

this.solve = function () {

  // Let consider a set S of n strictly increasing elements. Since rule 2 is
  // already satified, we only need to consider pairs of subsets of the same
  // length, so for any pair [A, B], we got |A| = |B| = m, with 2 <= m <= ⌊n/2⌋.

  // So, at first glance it appears that :
  //
  //  For n=4, m=2, and nCk(2m,2)/2 = 3, so only 3 out of the 25 possible
  //  subset pairs would need to be tested for equality (at first glance).
  //
  //  For n=5, m=2 as well, so for each of the nCk(n,2m)=5 combinations of size
  //  2m=4, we would need to check 3 subset pairs, that is 5*3 = 15 in total.
  //
  //  For n=6, 2 <= m <= 3,
  //    m=2 : nCk(6,4)=15 combinations of nCk(4,2)/2=3 pairs, 15*3 = 45
  //    m=3 : nCk(6,6)=1  combinations of nCk(6,2)/2=3 pairs, 1*10 = 10
  //    We would have to check 55 subset pairs.
  //
  //  ... and so on.

  // Now the question is, as it is stated that for n=4 only 1 of the pairs need
  // to be tested, how do we get from 3 to 1 ?

  // n=4 :
  //
  //  S = { s1, s2, s3, s4 }
  //  A = { a1, a2 }, with a1=s1 and a2=s2
  //  B = { b1, b2 }, with b1=s3 and b2=s4

  //     A    |    B     | (A|B) ordered  |
  //  s1 + s2 | s3 + s4  | a1, a2, b1, b2 |
  //  s1 + s3 | s2 + s4  | a1, b1, a2, b2 |
  //  s1 + s4 | s2 + s3  | a1, b1, b2, a2 |


}

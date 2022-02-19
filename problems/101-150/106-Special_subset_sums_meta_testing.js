
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

const { nChooseK, catalan } = require('../../lib/combinatorics');
const { range } = require('../../lib/utils');

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
  //    We would have to check at least 55 subset pairs.
  //
  //  ... and so on.

  // Now the question is, as it is stated that for n=4 only 1 of the pairs need
  // to be tested, how do we get from 3 to 1 ?
  //
  // Let S = { s1, s2, s3, s4 }, with s1 < s2 < s3 < s4.
  // Let [ A = {a1, a2}, B = {b1, b2} ] a subset pair made from S, with a1 < a2,
  // and b1 < b2.
  //
  // Writing down the 3 subset pairs, we can easily observe which one of the 3
  // does require an equality check :
  //
  //     A   |    B   |       S(A) ≠ S(B)       |
  //  s1, s2 | s3, s4 |    trivial (ai < bj)    |
  //  s1, s3 | s2, s4 |    trivial (ai < bi)    |
  //  s1, s4 | s2, s3 | required (a1<b1, a2>b2) |
  //
  // In order to catch what pattern is involved here, we can write each pair
  // [A, B] as the ordered sequence of (A|B), and map each element of that
  // sequence to a symbol representing which of the subset it is a member of :
  //
  //   [ a1, ..., am ] -> "/"
  //   [ b1, ..., bm ] -> "\"
  //
  // We use these specific symbols to draw a path describing "how unequal" are
  // the subsets of a given pair, by catenating them so that they form peaks
  // which can go above and/or below the horizontal line :
  //
  //     A   |    B   | (A|B) ordered  | Path | S(A) ≠ S(B) |
  //         |        |                |      |             |
  //         |        |                |  /\  |             |
  //  s1, s2 | s3, s4 | a1, a2, b1, b2 | /  \ |  trivial    |
  //         |        |                |      |             |
  //  s1, s3 | s2, s4 | a1, b1, a2, b2 | /\/\ |  trivial    |
  //         |        |                |      |             |
  //  s1, s4 | s2, s3 | a1, b1, b2, a2 | /\   |     ?       |
  //         |        |                |   \/ |             |
  //
  //   -> If the path stay above the horizontal line, it means S(A) < S(B).
  //   -> If the path stay below the horizontal line, it means S(B) < S(A).
  //   -> If it crosses the horizontal line though, a test is required.
  //
  // Similarly, for n=6, and m=3, we can "see" that there are 5 out of 10 subset
  // pairs that have their sum unequal without requiring a test :
  //
  //      A      |    B       |     (A|B) ordered      |  Path  | S(A) ≠ S(B) |
  //             |            |                        |        |             |
  //             |            |                        |   /\   |             |
  //             |            |                        |  /  \  |             |
  //  s1, s2, s3 | s4, s5, s6 | a1, a2, a3, b1, b2, b3 | /    \ |  trivial    |
  //             |            |                        |        |             |
  //             |            |                        |  /\/\  |             |
  //  s1, s2, s4 | s3, s5, s6 | a1, a2, b1, a3, b2, b3 | /    \ |  trivial    |
  //             |            |                        |        |             |
  //             |            |                        |    /\  |             |
  //  s1, s3, s4 | s2, s5, s6 | a1, b1, a2, a3, b2, b3 | /\/  \ |  trivial    |
  //             |            |                        |        |             |
  //             |            |                        |    /\  |             |
  //  s2, s3, s4 | s1, s5, s6 | b1, a1, a2, a3, b2, b3 |   /  \ |     ?       |
  //             |            |                        | \/     |             |
  //             |            |                        |  /\    |             |
  //  s1, s2, s5 | s3, s4, s6 | a1, a2, b1, b2, a3, b3 | /  \/\ |  trivial    |
  //             |            |                        |        |             |
  //             |            |                        |        |             |
  //  s1, s3, s5 | s2, s4, s6 | a1, b1, a2, b2, a3, b3 | /\/\/\ |  trivial    |
  //             |            |                        |        |             |
  //             |            |                        |        |             |
  //  s2, s3, s5 | s1, s4, s6 | b1, a1, a2, b2, a3, b3 |   /\/\ |     ?       |
  //             |            |                        | \/     |             |
  //             |            |                        |        |             |
  //  s1, s4, s5 | s2, s3, s6 | a1, b1, b2, a2, a3, b3 | /\  /\ |     ?       |
  //             |            |                        |   \/   |             |
  //             |            |                        |        |             |
  //  s2, s4, s5 | s1, s3, s6 | b1, a1, b2, a2, a3, b3 |     /\ |     ?       |
  //             |            |                        | \/\/   |             |
  //             |            |                        |        |             |
  //  s3, s4, s5 | s1, s2, s6 | b1, b2, a1, a2, a3, b3 |     /\ |     ?       |
  //             |            |                        | \  /   |             |
  //             |            |                        |  \/    |             |

  // The problem now translates to : Given m "/" and m "\", we need to find the
  // number of ways to form peaks that all stay above the horizontal line.

  // This relates to Catalan numbers and Dyck words. In this context, each path
  // is called a "mountain range". A Dyck word is a balanced (correctly nested)
  // sequence of parentheses or brackets (which we could have used instead of
  // "/" and "\").

  // The number of ways to draw mountain ranges with m "/" and m "\" corresponds
  // to the number of distinct Dyck words with exactly m pairs of parentheses,
  // which is the m-th Catalan number.
  // @see 'Catalan Numbers.pdf' in ref/ directory.

  // Which means :
  // -> for n=4, m=2 we can discard C(2) subset pairs (2).
  // -> for n=6, m=2 we can discard C(2) subset pairs per 6C4-combination (2*15).
  // -> for n=6, m=3 we can discard C(3) subset pairs per 6C6-combination (5*1).
  // ...

  const n = 12;
  let needTest = 0;
  for (const m of range(2, Math.floor(n/2)+1)) {
    const combi2m = nChooseK(n, 2*m);
    const pairs = nChooseK(2*m, m) / 2;
    needTest += combi2m * (pairs - catalan(m));
  }

  return needTest;
}

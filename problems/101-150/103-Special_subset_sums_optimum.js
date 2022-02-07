/**
 * Problem 103 - Special subset sums: optimum
 *
 * @see {@link https://projecteuler.net/problem=103}
 *
 * Let S(A) represent the sum of elements in set A of size n. We shall call it
 * a special sum set if for any two non-empty disjoint subsets, B and C, the
 * following properties are true:
 *
 *    1. S(B) ≠ S(C); that is, sums of subsets cannot be equal.
 *    2. If B contains more elements than C then S(B) > S(C).
 *
 * If S(A) is minimised for a given n, we shall call it an optimum special sum
 * set. The first five optimum special sum sets are given below.
 *
 *                    n = 1: {1}
 *                    n = 2: {1, 2}
 *                    n = 3: {2, 3, 4}
 *                    n = 4: {3, 5, 6, 7}
 *                    n = 5: {6, 9, 11, 12, 13}
 *
 * It seems that for a given optimum set, A = {a1, a2, ... , an}, the next
 * optimum set is of the form B = {b, a1+b, a2+b, ... ,an+b}, where b is the
 * "middle" element on the previous row.
 *
 * By applying this "rule" we would expect the optimum set for n = 6 to be
 * A = {11, 17, 20, 22, 23, 24}, with S(A) = 117. However, this is not the
 * optimum set, as we have merely applied an algorithm to provide a near
 * optimum set. The optimum set for n = 6 is A = {11, 18, 19, 20, 22, 25},
 * with S(A) = 115 and corresponding set string: 111819202225.
 *
 * Given that A is an optimum special sum set for n = 7, find its set string.
 *
 * NOTE: This problem is related to Problem 105 and Problem 106.
 */

const { nkCombinations, setPartitions } = require('../../lib/combinatorics');
const { sum } = require('../../lib/math');
const { range } = require('../../lib/utils');

this.solve = function () {
  // The idea is to create an array of candidate numbers which is made of those
  // from the "near optimum set" along with their closest neighbors (in order to
  // allow some sort of deviation from the base set, which may not be optimum,
  // as for the example with n=6).

  // Then we create combinations of n elements from these candidates to obtain
  // set candidates, and for each set, we check if it is a special sum set.

  // We will sort the sets candidates in ascending order of the sum of their
  // elements beforehand so that we can then break the search as soon as a SSS
  // is found.

  // Note: My first approach was wrong, and I knew it somehow because I had to
  // check all subsets sums together to get the correct solution, but it's only
  // when I got into problems 105 and 106 that I realized "any two non-empty
  // disjoint subsets" of A doesn't mean "any partition of A into 2 parts", we
  // must take into account the 2-blocks partitions of every subsets of A of
  // size k in [2,|A|]. This amount to generate all the combinations (subsets)
  // of A, and check every disjoint subsets pair.

  // Now, to check if a given set S is a special sum set, we first generate the
  // k-combinations from S elements for k in [2, n]. Then for each combination,
  // we check that every partition of its elements into two disjoint subsets
  // satisfies the rules.

  // The problem with the "deviation" method is that it would need a proof that
  // the optimum set can always be obtained from the base (near optimum) set, or
  // one of its derivatives.

  // Optimum set for n-1
  const A = [ 11, 18, 19, 20, 22, 25 ];
  // const A = [ 6, 9, 11, 12, 13 ];

  // The "middle" element from A
  const b = A[Math.floor(A.length/2)];

  // Near optimum set for n
  const B = [b, ...A.map(an => an + b)];
  const n = B.length;

  // Set of numbers to be used, and the corresponding k-combinations candidates.
  const numbers = [...new Set(B.map(bn => range(bn-1, bn+2)).flat())];
  const sets = nkCombinations(numbers, n).sort((a, b) => sum(a) - sum(b));

  // Creates k-combinations of indexes from 0 to n-1, and for k in range [2, n],
  // we will use it to generate the subsets of length K for any set S of length
  // n by mapping each combination of indexes to the corresponding subset of
  // elements of S, ie. [ S[i] for i in C ].
  const I = nkCombinations(range(n), range(2, n+1));

  // Generates subsets of S from the combinations of indexes (C).
  function* subsets (S) {
    for (const indexes of I) {
      yield indexes.map(i => S[i]);
    }
  }

  // Checks whether or not the given partition statisfies the two rules.
  function isValid([A, B]) {
    const sA = sum(A);
    const sB = sum(B);
    if (sA == sB)
      return false;
    if (A.length > B.length && sA <= sB || A.length < B.length && sA >= sB)
      return false;
    return true;
  }

  // Checks whether or not the given set S is a special sum set.
  const isSpecial = S => {
    for (const subset of subsets(S)) {
      if (!setPartitions(subset, 2).every(isValid))
        return false;
    }
    return true;
  }

  // Optimum special sum set
  const OS = {
    set: [],
    sum: Infinity
  };

  // Check each set until we find a special sum set. We know that the first one
  // that is found is the optimum set because sets are sorted by sum.
  for (const S of sets) {
    if (isSpecial(S)) {
      OS.sum = sum(S);
      OS.set = S;
      break;
    }
  }

  return +OS.set.join('');
}

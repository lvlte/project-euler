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

const { setPartitions, nkCombinations } = require('../../lib/combinatorics');
const { sum } = require('../../lib/math');
const { range } = require('../../lib/utils');

this.solve = function () {
  // The idea is to create an array of candidate numbers which is made of those
  // from the "near optimum set" along with their closest neighbors (in order to
  // allow some sort of deviation from the base set, which may not be optimum,
  // as for the example with n=6).

  // Then we create combinations of n elements from these candidates, and for
  // each set S we check that every partition of S made of 2 non-empty disjoint
  // subsets statisfies the two rules.

  // The problem with this method is that it would need a proof that the optimum
  // set can always be obtained from the base (near optimum) set or one of the
  // "deviated" sets...

  // Optimum set for n-1
  const A = [ 11, 18, 19, 20, 22, 25 ];
  // const A = [ 6, 9, 11, 12, 13 ];

  // The "middle" element from A
  const b = A[Math.floor(A.length/2)];

  // Near optimum set for n
  const B = [b, ...A.map(an => an + b)];

  // Set of numbers to be used, and the corresponding k-combinations candidates.
  const numbers = new Set(B.map(bn => range(bn-1, bn+2)).flat());
  const sets = nkCombinations(numbers, B.length);

  // Checks whether or not the given partition statisfies the two rules.
  function isValid([A, B]) {
    const sA = sum(A);
    const sB = sum(B);
    if (sA === sB || this.cache[sA] || this.cache[sB])
      return false;
    if ((A.length > B.length && sB > sA) || (A.length < B.length && sA > sB))
      return false;
    this.cache[sA] = sA;
    this.cache[sB] = sB;
    return true;
  }

  // Keep track of the optimum special sum set
  let OS = {
    set: [],
    sum: Infinity
  };

  // Check the partitions of each set, and keep only the optimum set.
  for (let i=0; i<sets.length; i++) {
    const set = [...sets[i]];
    const P = setPartitions(set, 2);
    const cache = {};
    if (P.every(isValid, { cache })) {
      const sP = sum(set);
      if (sP < OS.sum) {
        OS.sum = sP;
        OS.set = set;
      }
    }
  }

  return +OS.set.join('');
}

/**
 * Problem 105 - Special subset sums: testing
 *
 * @see {@link https://projecteuler.net/problem=105}
 *
 * Let S(A) represent the sum of elements in set A of size n. We shall call it
 * a special sum set if for any two non-empty disjoint subsets, B and C, the
 * following properties are true:
 *
 *    1. S(B) ≠ S(C); that is, sums of subsets cannot be equal.
 *    2. If B contains more elements than C then S(B) > S(C).
 *
 * For example, {81, 88, 75, 42, 87, 84, 86, 65} is not a special sum set
 * because 65 + 87 + 88 = 75 + 81 + 84,
 * whereas {157, 150, 164, 119, 79, 159, 161, 139, 158} satisfies both rules
 * for all possible subset pair combinations and S(A) = 1286.
 *
 * Using p105_sets.txt, a 4K text file with one-hundred sets containing seven
 * to twelve elements (the two examples given above are the first two sets in
 * the file), identify all the special sum sets, A1, A2, ..., Ak, and find the
 * value of S(A1) + S(A2) + ... + S(Ak).
 *
 * NOTE: This problem is related to Problem 103 and Problem 106.
 */

const { load } = require('../../lib/utils');
const { sum } = require('../../lib/math');
const { disjointPairs } = require('../../lib/combinatorics');
const sets = load('p105_sets.txt').map(line => line.split(',').map(Number));

this.solve = function () {

  // The brute force method of generating and checking every subsets partitions
  // of a set (cf. problem 103) does the job but it takes more than one second
  // to check the one-hundred sets.

  // Actuallly the second rule can be checked without having to generate any
  // subsets combination: given a set S, we just need to sort its elements in
  // ascending order and check that the sum of the k smallest ones is greater
  // than that of the (k-1) greatest ones for k: 1 < k < |S|/2. If the smallest
  // subset combination of size k is greater than the biggest (k-1)-combination,
  // then any other k-combination will be as well obviously since they all are
  // greater than the smallest one.

  // For the first rule, we will use the function disjointPairs(), it is faster
  // than setPartitions(). We could even do better by computing directly the
  // disjoint subsets sums instead of creating them and then only do the sum.

  // We will check rule 2 first as it allows to discard sets without requiring
  // much effort, that is, less than for rule 1.

  const check1 = A => {
    for (const [B, C] of disjointPairs(A)) {
      if (sum(B) === sum(C))
        return false;
    }
    return true;
  };

  const check2 = A => {
    A = A.sort((a, b) => a - b);
    const k = A.length/2;
    let delta = A[0];
    for (let i=1; i<k; i++) {
      delta += A[i] - A[A.length-i];
      if (delta <= 0)
        return false;
    }
    return true;
  }

  let sumOfSums = 0;
  for (const S of sets) {
    if (check2(S) && check1(S))
      sumOfSums += sum(S);
  }

  return sumOfSums;
}

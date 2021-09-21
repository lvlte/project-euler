/**
 * Problem 32 - Pandigital products
 *
 * @see {@link https://projecteuler.net/problem=32}
 *
 * We shall say that an n-digit number is pandigital if it makes use of all the
 * digits 1 to n exactly once; for example, the 5-digit number, 15234, is 1
 * through 5 pandigital.
 *
 * The product 7254 is unusual, as the identity, 39 × 186 = 7254, containing
 * multiplicand, multiplier, and product is 1 through 9 pandigital.
 *
 * Find the sum of all products whose multiplicand/multiplier/product identity
 * can be written as a 1 through 9 pandigital.
 *
 * HINT: Some products can be obtained in more than one way so be sure to only
 * include it once in your sum.
 */

const { setPartitions, permute } = require('../../lib/combinatorics');
const { range } = require('../../lib/utils');
const { sum } = require('../../lib/math');

this.solve = function () {
  // First, we need to find the partitions of the set S=[1,2,3,4,5,6,7,8,9] with
  // k=3 non-empty disjoint subsets (every element is included in exactly one
  // subset). For example : {{3,9},{1,6,8},{2,4,5,7}}.

  // @see http://oeis.org/wiki/Set_partitions
  // Not to be confused with the partition of an integer n which corresponds to
  // a multiset (elements are allowed to appear more than once) of positive
  // integers whose elements sum to n (like with coins in the previous problem).

  // Incidentally, we can count the number of ways to partition a set of n
  // objects into k non-empty subsets (ie. to check if generating such partition
  // can be done in reasonable time).
  // That number is called a "Stirling number of the second kind" (or Stirling
  // partition number).
  // @see https://mathworld.wolfram.com/StirlingNumberoftheSecondKind.html

  const n = 9;
  const k = 3;
  // console.log('stirling2(n, k)', stirling2(n, k)); // -> 3025

  const set = range(1, n+1);
  const partitions = setPartitions(set, k);

  // Then, for each partition, we need to find all the permutations of its
  // subsets producing an identity that can be arranged as a product. For
  // example :
  //  {{3,9},{1,6,8},{2,4,5,7}} can be permutted as {{3,9},{1,8,6},{7,2,5,4}}
  //  which corresponds to the pandigital product 39 × 186 = 7254

  // The thing is that generating all the permutations would take a while so we
  // need to skip the "invalid" partitions as soon as we can. We can use simple
  // heuristics, for the given set S=[1,2,3,4,5,6,7,8,9] and with k=3 :

  // -> We can't produce a product containing more than 4-digits :
  //    Let's say we have a product m * n = p, and p has 5 digits, which means
  //    there are 4 digits left for m and n. However in such case the product
  //    cannot be greater than 9*876 = 7884, which has only 4 digits.
  //    Therefore p cannot contain more than 4-digits.

  // -> Similarly, we can't produce a product containing less than 4-digits :
  //    Or we would have at least 6 digits to deal with on the other hand, the
  //    smallest product in that case is 1*23456 = 23456 which has 5 digits.
  //    Therefore p must contain 4-digits.

  // -> Elements in each partition subset are sorted in ascending order, which
  //    means we start with the permutations giving the lowest m, n and p. So
  //    in certain cases we can use the reverse permutation of p to set a pMax
  //    and exclude the given partition if m * n > pMax, because in that case
  //    any other permutation whatsoever would be invalid, with m * n > p.

  // Helper that checks if the given partition subsets are valid.
  const checkSubsets = (a, b, c) => {
    if (!(a.length === 4 || b.length === 4 || c.length === 4))
      return false;
    if (!(a.length === 1 || b.length === 1 || c.length === 1)) {
      // (subsets length are 2, 3 and 4)
      const [m, n, p] = [a, b, c].map(s => +s.join('')).sort((a,b) => a-b);
      const pMax = +(''+p).split('').reverse().join('');
      if (m*n > pMax)
        return false;
    }
    return true;
  };

  // Keeping only unique products
  let products = new Set();

  // For each partition, skip if invalid, or permute the subsets elements and
  // recombine them into identities we can check, keeping only valid products.
  for (let i=0; i<partitions.length; i++) {
    const [s1, s2, s3] = partitions[i];
    if (!checkSubsets(s1, s2, s3))
      continue;
    const [S1, S2, S3] = [permute(s1), permute(s2), permute(s3)];
    S1.forEach(a => {
      S2.forEach(b => {
        S3.forEach(c => {
          const [m, n, p] = [a, b, c].map(s => +s.join('')).sort((x,y) => x-y);
          if (m*n === p)
            products.add(p);
        });
      });
    });
  }

  return sum([...products]);
}

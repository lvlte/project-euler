/**
 * Problem 88 - Product-sum numbers
 *
 * @see {@link https://projecteuler.net/problem=88}
 *
 * A natural number N that can be written as the sum and product of a given set
 * of at least two natural numbers, {a1, a2, ... , ak} is called a product-sum
 * number: N = a1 + a2 + ... + ak = a1 × a2 × ... × ak.
 *
 * For example, 6 = 1 + 2 + 3 = 1 × 2 × 3.
 *
 * For a given set of size, k, we shall call the smallest N with this property
 * a minimal product-sum number. The minimal product-sum numbers for sets of
 * size, k = 2, 3, 4, 5, and 6 are as follows.
 *
 *        k=2: 4 = 2 × 2 = 2 + 2
 *        k=3: 6 = 1 × 2 × 3 = 1 + 2 + 3
 *        k=4: 8 = 1 × 1 × 2 × 4 = 1 + 1 + 2 + 4
 *        k=5: 8 = 1 × 1 × 2 × 2 × 2 = 1 + 1 + 2 + 2 + 2
 *        k=6: 12 = 1 × 1 × 1 × 1 × 2 × 6 = 1 + 1 + 1 + 1 + 2 + 6
 *
 * Hence for 2 ≤ k ≤ 6, the sum of all the minimal product-sum numbers is
 * 4 + 6 + 8 + 12 = 30; note that 8 is only counted once in the sum.
 *
 * In fact, as the complete set of minimal product-sum numbers for 2 ≤ k ≤ 12
 * is {4, 6, 8, 12, 15, 16}, the sum is 61.
 *
 * What is the sum of all the minimal product-sum numbers for 2 ≤ k ≤ 12000 ?
 */

const { sum } = require('../../lib/math');

this.solve = function () {

  // The first thing is that for any k>=2, the minimal product-sum M[k] must be
  // greater than k :
  //  A sum of k ones is greater than a product of ones, so there must be at
  //  least one factor greater than one in the product, and the corresponding
  //  sum thus becomes greater than k.

  // In fact, there must be at least two factors greater than one, otherwise the
  // product will always be smaller than the sum :
  //  Let's say we have (k-1) ones and one term x > 1, then we got for k>=2 :
  //    1^(k-1) * x  <  1*(k-1) + x
  //              x  <  x + k-1

  // The second thing is that from any product of factors greater than one, we
  // can always add ones to make the sum of factors match the product, eg. :
  //  2*2*2 = 8 and 2+2+2 = 6, missing 2.
  //  Then by adding 2 ones : 1*1*2*2*2 = 1+1+2+2+2 = 8, we got a product-sum
  //  candidate for k=5.

  // This means that any multiset S of such factors is actually a product-sum
  // candidates for M[k] :
  //  k corresponds to the number of factors plus the number of missing ones,
  //  and the product-sum is just the product, unaffected by the ones.
  //    k = |S| + product(S) – sum(S)
  //    M[k] <= product(S)

  // In fact, all minimal product-sums are the result of a product of factors
  // greater than one, so by calculating every possible (distinct) products in
  // a certain range, we should be able to find all minimal product-sums M[k]
  // for 2 ≤ k ≤ 12000.

  // The lower bound of that range is obviously 2*2, we need to find an upper
  // bound (the lowest possible) :
  //  There must be at least two factors, so there is at most k-2 ones used in
  //  any product-sum candidates. The smallest factor being 2, let S = {2, x},
  //  we got :
  //    product(S) – sum(S) = k-2
  //             2x - (2+x) = k-2
  //                     2x = k+x
  //                      x = k
  //  Then, we have a guaranteed product-sum produced by S = {2, k} :
  //    1^(k-2)*2*k = 1*(k-2)+2+k = 2k

  // So the minimal product-sum for k is such that k < M[k] ≤ 2k.

  const kMin = 2;
  const kMax = 12_000;
  const limit = 2*kMax;

  // Now, the problem is to calculate every possible (distinct) products which
  // stays below 2k.

  // This can be achieved efficiently using recursion and dynamic programming.

  // For example, to produce the products of two factors, 2*2, 2*3, 2*4..., a
  // function can take the numbers p=2, and n=2, and calculate the products :
  //   p*n, p*(n+1), p*(n+2), ..., p*nMax <= limit
  // Then, for each product or for each n, we can let the function call itself
  // to expand that product further by adding a factor. Starting with p=2, we
  // got the following expansions :
  //  n=2 : 2*2 -> 2*2*2 -> 2*2*2*2 -> ...
  //  n=3 : 2*3 -> 2*3*3 -> 2*3*3*3 -> ...
  //  ...

  // At each level the function expands the current product p with the factor n,
  // and creates new products : p*n, p*(n+1), ..., p*nMax <= limit, which are
  // then expanded in turn. For example at level 2 (to 3) we can have :
  //  2*2 -> p=2*2, n=2 : 2*2*2 -> 2*2*2*2
  //                n=3 : 2*2*3 -> 2*2*3*3
  //                ...
  // The key here is that the value of p and n evolve independently in the scope
  // of each function call (at each level).

  // Because of its recursive behavior, our function doesn't have to keep track
  // of the factors in use, but only the actual value of p and n in its scope :
  //  2*2 -> p=4, n=2 : 4*2 -> 8*2 -> ...
  //              n=3 : 4*3 -> 8*3 -> ...
  //              ...
  // And the same apply to the sum s that corresponds to each product p.

  // Finally, for each new product p and sum s, the function finds how many ones
  // are missing from s to match p, then finds the value of k so that p can be
  // assigned to M[k] if smaller than the current value of M[k].

  // Let the minimal product-sum numbers default to Infinity.
  let M = Array(kMax).fill(Infinity);

  // The recursive function
  //  p: value of the product to expand
  //  s: value of the sum to expand
  //  n: smallest factor to multiply with p (and add to s)
  //  m: virtual number of factors actually in use (also the function depth).
  const findMPS = (p, s, n, m) => {
    const nMax = Math.floor(limit/p);
    for (n, m++; n<=nMax; n++) {
      const ss = s+n;
      const pp = p*n;         // solution candidate is the current product
      const ones = pp-(ss);   // number of ones needed to adjust sum to product
      const k = m+ones;       // making a minimal product-sum candidate for k
      if (pp < M[k])
        M[k] = pp;
      findMPS(pp, ss, n, m);
    }
  };

  // Now, we are only interested in producing 2 factors since the recursion does
  // the rest. We start with the smallest, let p=2, and set n=p so the function
  // goes with 2*2, 2*3, etc., then p=n=3, for 3*3, 3*4 etc., up to p=n=⌊√(2k)⌋.
  const pMax = Math.floor(Math.sqrt(limit));
  for (let p=2; p<=pMax; p++) {
    findMPS(p, p, p, 1);
  }

  // Dedupe (minimal product-sum numbers must be counted only once in the sum)
  const set = [...new Set(M.slice(kMin))];

  return sum(set);
}

/**
 * Problem 122 - Efficient exponentiation
 *
 * @see {@link https://projecteuler.net/problem=122}
 *
 * The most naive way of computing n¹⁵ requires fourteen multiplications:
 *
 *    n × n × ... × n = n¹⁵
 *
 * But using a "binary" method you can compute it in six multiplications:
 *
 *     n   × n  = n²
 *     n²  × n² = n⁴
 *     n⁴  × n⁴ = n⁸
 *     n⁸  × n⁴ = n¹²
 *     n¹² × n² = n¹⁴
 *     n¹⁴ × n  = n¹⁵
 *
 * However it is yet possible to compute it in only five multiplications:
 *
 *     n   × n  = n²
 *     n²  × n  = n³
 *     n³  × n³ = n⁶
 *     n⁶  × n⁶ = n¹²
 *     n¹² × n³ = n¹⁵
 *
 * We shall define m(k) to be the minimum number of multiplications to compute
 * nᵏ; for example m(15) = 5.
 *
 * For 1 ≤ k ≤ 200, find ∑ m(k).
 */

/* eslint-disable max-len */

const { sum } = require('../../lib/math');

this.solve = function () {

  // Multiplying powers of the same base amounts to adding up the exponents :
  //
  //  nᵃ × nᵇ = nᵃ⁺ᵇ
  //
  // So counting the minimum number of multiplications to compute nᵏ amounts to
  // counting the minimum number of additions to compute k.

  // We can represent each step of the computation of n¹⁵ given in the example
  // as follows, where A is an "addition chain" for k, and |A| - 1 the length
  // of the chain, candidate for m(k) (the length of an addition chain is the
  // number of sums needed to express all its numbers which is one less than
  // the cardinality of the sequence) :

  //         nᵏ        |       k        |  A = { 1, ... , k }
  // ------------------|----------------|--------------------------
  //         n         |       1        |  { 1 }
  //   n   × n  = n²   |   1 + 1  =  2  |  { 1, 2 }
  //   n²  × n  = n³   |   2 + 1  =  3  |  { 1, 2, 3 }
  //   n³  × n³ = n⁶   |   3 + 3  =  6  |  { 1, 2, 3, 6 }
  //   n⁶  × n⁶ = n¹²  |   6 + 6  = 12  |  { 1, 2, 3, 6, 12 }
  //   n¹² × n³ = n¹⁵  |  12 + 3  = 15  |  { 1, 2, 3, 6, 12, 15 }

  // Somehow, we are asked to sum the lengths of the shortest addition chains
  // for 1 ≤ k ≤ 200.

  // https://en.wikipedia.org/wiki/Addition-chain_exponentiation
  // https://en.wikipedia.org/wiki/Addition_chain
  // https://oeis.org/A003313

  // Expanding a SAC for some k doesn't always produce a SAC for some k+x, so
  // we can forget about dynamic programming. This also means that searching
  // for solutions in increasing order of AC length is not a good approach as
  // it would imply storing chains of length l to produce those of length l+1,
  // and since we can't discard the non-optimal ones, both time and space
  // complexity would have a combinatorial growth (and even if we could discard
  // them, because the number of distinct SAC for k increases significantly as
  // k increases).

  // Let's imagine a multifurcating tree representing every possible AC (the
  // root node is `1` and the paths from the root to any of its descendants
  // represent an AC; such tree would have many duplicate nodes but it's just
  // to visualize). The wrong approach described above is actually analogous
  // to a breadth-first search, while we rather need to perform a depth-first
  // search, recursively traversing the tree by prioritizing the bigger steps
  // (a step x is the path from node k to its child `k+x`) : since any step is
  // obtained from the current chain (path to current node), we only need one
  // array representing that current chain to traverse the tree, so the space
  // complexity falls to O(n).

  // Reducing the search space using Brauer chains
  //
  // A Brauer chain or star chain is an addition chain in which every member
  // after the first is the sum of the immediately preceeding element and any
  // previous (possibly the same) element. A number n for which a shortest chain
  // exists which is a Brauer chain is called a Brauer number.
  //
  // It turns out that the smallest non-Brauer number is 12509*, thus we can
  // drastically reduce the search space by using only star steps, searching
  // only for shortest Brauer chains.
  //
  // * no Brauer chain for k=12509 is as short as this chain :
  //  {1,2,4,8,16,17,32,64,128,256,512,1024,1041,2082,4164,8328,8345,12509}
  //              ^^^^^
  //                |-> non-star step (17 is not used to produce 32)
  //
  // @see "Non-Brauer numbers" https://oeis.org/A349044

  // Optimization 1 - Stack vs Recursion
  //
  // Instead of using a recursive function in which we make a call for each star
  // step added to the current value of k, we can use an iterative stack-based
  // alorithm. By simulating the recursion using a stack (Last In First Out), we
  // have to produce the smaller steps first in order to process the bigger ones
  // first. This is an advantage because, if adding a step to the current value
  // of k exceeds kmax, we can `break` the loop producing those steps, minmizing
  // the number of additions and checks, while by producing bigger steps first
  // we would have to `continue` that loop (or use more code to prevent all the
  // unecessary additions and checks). The performance gain is barely noticeable
  // for small values of `kmax` but becomes more significant for higher values.

  // Optimization 2 - Upper Bound
  //
  // It has been proven* that :
  //
  //  m(k) ≤ 9/log₂(71) × log₂(k)
  //
  // for all k, but astonishingly, it turns out that there always exists one or
  // more Brauer chains in which the inequality above applies for EVERY member
  // of the chain, at least for k ≤ 51667 (verified) and most likely for higher
  // values (conjectured; see ref/122-Efficient_exponentiation/checkNonBrauer.js
  // for more details on this). Again, the performance gain becomes significant
  // with higher values of of k (kmax > 1000).
  //
  // * @see "Efficient calculation of powers in a semigroup" by Wattel & Jensen.
  //
  // https://mathoverflow.net/q/217411
  // https://www.desmos.com/calculator/fmqrh6ifn8
  // https://oeis.org/A264803
  // project-euler/ref/122-Efficient_exponentiation/checkNonBrauer.js


  // See also :
  // https://wwwhomes.uni-bielefeld.de/achim/addition_chain.html
  // https://www.numbersaplenty.com/ac/
  // https://additionchains.com/


  const kmax = 200;

  const c = 9 / Math.log2(71);
  const upperBound = k => Math.floor(c*Math.log2(k));

  const chain = Array(upperBound(kmax) + 1);
  const M = [0, ...Array.from({length: kmax}, (_, i) => upperBound(i+1))];

  const stack = [{ k: 1, mk: 0 }];

  while (stack.length > 0) {
    let { k, mk } = stack.pop();

    M[k] = mk;
    chain[mk] = k;

    const nextMk = mk+1;
    if (nextMk >= chain.length || k === kmax) {
      continue;
    }

    for (let i=0; i<=mk; i++) {
      const nextK = k + chain[i];
      if (nextK > kmax) break;
      if (nextMk <= M[nextK]) {
        stack.push({ k: nextK, mk: nextMk });
      }
    }
  }

  return sum(M);
}

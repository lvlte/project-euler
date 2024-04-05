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
  // values (conjectured). Again, the performance gain becomes significant with
  // higher values of k (kmax > 1000).
  //
  // * @see "Efficient calculation of powers in a semigroup" by Wattel & Jensen.
  //
  // https://mathoverflow.net/q/217411
  // https://www.desmos.com/calculator/fmqrh6ifn8
  // https://oeis.org/A264803


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


this.solve2 = checkNonBrauer;

/**
 * Check Brauer vs Non-Brauer numbers up to k=100000. The goal is also to show
 * that the Non-Brauer numbers found (verified + candidates) remains the same
 * regardless of the upper bound used (conjectured in "Optimization 2", vs no
 * bound) by our algorithm.
 *
 * SAC lengths are taken from A003313's b-file.
 * Non-Brauer numbers are taken from A349044's b-file (k ≤ 51667 at the time
 * of writing).
 *
 * For k in A349044, every length mismatch correspond to a Non-Brauer number.
 *
 * It is then conjectured that mismatches for higer values of k are indeed
 * Non-Brauer numbers that are not yet on the OEIS.
 *
 * Run-time :
 *  - ~10 minutes with the upperbound
 *  - ~1h50m without bound
 */
async function checkNonBrauer() {

  const responseData = res => res.text().then(data => data
    .split(/\r?\n/)
    .filter(line => line.length && !line.startsWith('#'))
    .map(line => line.split(/\s+/).map(Number))
  );

  console.log('Fetching data from OEIS...');

  // Shortest addition chain lengths
  const SACLen = await fetch('https://oeis.org/A003313/b003313.txt').then(responseData);

  // Non-Brauer numbers
  const nonBrauer = (
    await fetch('https://oeis.org/A349044/b349044.txt').then(responseData)
  ).map(([, n]) => n);

  const kmax = 1e5;
  console.log(`Computing Brauer chain lengths up to k = ${kmax}`);

  const c = 9 / Math.log2(71);
  const upperBound = k => Math.floor(c*Math.log2(k));

  const chain = Array(upperBound(kmax) + 1);
  // const M = [0, ...Array.from({length: kmax}, (_, i) => upperBound(i+1))];
  const M = [0, ...Array(kmax).fill(Infinity)];

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

  const nBmax = Math.max(...nonBrauer);
  const nonBrauerSet = new Set(nonBrauer);
  const nonBrauer2 = [];

  for (const [k, mk] of SACLen) {
    if (k > kmax) break;
    if (nonBrauerSet.has(k)) continue;
    if (M[k] !== mk) {
      if (k <= nBmax) {
        // unexpected (brauer number missed, should not happen)
        console.log('\x1b[31m%s\x1b[0m', `m(${k}) = ${mk}, found ${M[k]}`);
      }
      else {
        nonBrauer2.push(k);
      }
    }
  }

  console.log('Non-Brauer numbers :');

  console.log('- verified :', nonBrauer);
  // 12509, 13207, 13705, 15473, 16537, 20753, 22955, 23219, 23447, 24797, 25018,
  // 26027, 26253, 26391, 26414, 26801, 27401, 27410, 30897, 30946, 31001, 32921,
  // 33065, 33074, 41489, 41506, 43755, 43927, 45867, 46355, 46419, 46797, 46871,
  // 46894, 47761, 49373, 49577, 49593, 49594, 49611, 50036, 50829, 51667

  console.log('- conjectured :', nonBrauer2);
  // 51891, 52011, 52054, 52493, 52506, 52759, 52782, 52828, 53602, 54033, 54802,
  // 54820, 61665, 61745, 61794, 61892, 61977, 62002, 62225, 62259, 65689, 65833,
  // 65842, 66035, 66130, 66148, 67067, 69407, 70167, 70295, 72953, 74195, 77267,
  // 79127, 82465, 82679, 82685, 82793, 82961, 82978, 83012, 83387, 83609, 84887,
  // 85461, 87510, 87831, 87854, 87881, 87897, 88841, 88915, 90929, 91673, 91691,
  // 91734, 92579, 92627, 92691, 92710, 92838, 92901, 92949, 92971, 93003, 93329,
  // 93397, 93719, 93742, 93788, 94993, 95505, 98525, 98729, 98733, 98745, 98746,
  // 98763, 99129, 99154, 99177, 99186, 99188, 99195, 99222

  return sum(M);
}


/**
 * Problem 111 - Primes with runs
 *
 * @see {@link https://projecteuler.net/problem=111}
 *
 * Considering 4-digit primes containing repeated digits it is clear that they
 * cannot all be the same: 1111 is divisible by 11, 2222 is divisible by 22,
 * and so on. But there are nine 4-digit primes containing three ones:
 *
 *            1117, 1151, 1171, 1181, 1511, 1811, 2111, 4111, 8111
 *
 * We shall say that M(n, d) represents the maximum number of repeated digits
 * for an n-digit prime where d is the repeated digit, N(n, d) represents the
 * number of such primes, and S(n, d) represents the sum of these primes.
 *
 * So M(4, 1) = 3 is the maximum number of repeated digits for a 4-digit prime
 * where one is the repeated digit, there are N(4, 1) = 9 such primes, and the
 * sum of these primes is S(4, 1) = 22275. It turns out that for d = 0, it is
 * only possible to have M(4, 0) = 2 repeated digits, but there are N(4, 0) = 13
 * such cases.
 *
 * In the same way we obtain the following results for 4-digit primes.
 *
 *            | Digit, d  |  M(4, d)  |  N(4, d)  |  S(4, d)  |
 *            |-----------|-----------|-----------|-----------|
 *            |     0     |     2     |     13    |   67061   |
 *            |     1     |     3     |     9     |   22275   |
 *            |     2     |     3     |     1     |   2221    |
 *            |     3     |     3     |     12    |   46214   |
 *            |     4     |     3     |     2     |   8888    |
 *            |     5     |     3     |     1     |   5557    |
 *            |     6     |     3     |     1     |   6661    |
 *            |     7     |     3     |     9     |   57863   |
 *            |     8     |     3     |     1     |   8887    |
 *            |     9     |     3     |     7     |   48073   |
 *
 * For d = 0 to 9, the sum of all S(4, d) is 273700.
 *
 * Find the sum of all S(10, d).
 */

const { nkCombinations, permuteU } = require('../../lib/combinatorics');
const { sum } = require('../../lib/math');
const { isPrime } = require('../../lib/prime');
const { range } = require('../../lib/utils');

this.solve = function () {

  // In short, we need to build n-digits numbers having a maximum of repeating
  // digits d for d = 0 to 9, and then check whether or not they are prime.

  // The solution I came up with consists in building n-digits numbers from
  // combinations, in a way that allows to eliminate those candidates that can't
  // be prime as early as possible.

  // We want to avoid having to generate millions of n-digits combinations, so
  // we will focus on the non-repeating digits rather than the d's, and more
  // specifically on the combinations of indexes they can possibly occupy in an
  // n-digits prime number.

  // Since finding a maximum of repeating digits amounts to finding a minimum of
  // non-repeating digits, by focusing on the non-repeating digits only, we will
  // have less and smaller combinations to deal with.

  // Let's call the non-repeating digits the x's, x being a wildcard digit
  // representing any digit other than d. Let k the number of x's to consider,
  // we want prime numbers so there is at least one of them among the n-digits
  // number candidates. For example, for n=4, k=1 (k=1 is a trivial case but
  // to picture the thing) :
  //
  //    index combinations of the x's :     [  [0],  [1],  [2],  [3] ]
  //    number candidates representation :  [ xddd, dxdd, ddxd, dddx ]
  //
  // The idea here is that the (n choose k) index combinations are the same
  // regardless of d, so we would just have to build them once per value of k,
  // which will be increased only if a set of candidates does not yield any
  // prime (ie. k will stay small).
  //
  // Though we know from the start some combinations will be invalid for d even,
  // in such case one x must be at index n-1, so in the example above, 'dddx'
  // would be the only good candidate.
  //
  // Also, in case d=0, we know there are at least two x's that must lie at
  // index 0 and n-1, so in this situation we shall directly start with k=2 :
  //
  //    index combinations of the x's :     [  [0, 3] ]
  //    number candidates representation :  [   x00x  ]
  //
  // To sum this up :
  //  - for d odd, we got (n choose k) index combinations to consider.
  //  - for d even and greater than zero, we have one fixed index so we got
  //    (n-1 choose k-1) index combinations to consider.
  //  - for d=0, we have two fixed index so we got (n-2 choose k-2) combinations
  //    to consider.

  // In the same manner, we need to build some k-multicombinations of values for
  // the x's from the set of digits minus d. The idea here is that, again, the
  // ((9 choose k)) values combinations only needs to be built once per value of
  // d and k, knowing that k won't grow that much before we find a set of prime
  // numbers.

  // Once we got valid index combinations and values combinations for the x's,
  // for some d and some k, we can generate the corresponding set of number
  // candidates. Building up a number candidate consists in creating an array
  // of length n, and fill it by mapping the unique permutations of a given x's
  // value combination to the corresponding index combination, and setting the
  // value of d for the other, non-mapped, indexes. If we take the example above
  // for n=4, d=0, and k=2 :
  //
  //    index combination  |  value permutations |      number
  //   --------------------|---------------------|-----------------
  //                       |        [1, 1]       |   [1, 0, 0, 1]
  //         [0, 3]        |        [1, 2]       |   [1, 0, 0, 2]
  //                       |        [2, 1]       |   [2, 0, 0, 1]
  //                       |        [1, 3]       |   [1, 0, 0, 3]
  //                       |         ...         |       ...
  //
  // In this example we got only one index combination but the idea is that for
  // each index combination, the value permutations to use are the same for a
  // given pair (k, d).

  // From there, we shall just discard even numbers and those with a leading 0
  // and test the remaining candidates for primality.

  // Nb. building numbers using combinatorics takes ~3ms, primality test of the
  // candidates takes up to ~30ms.

  const n = 10;
  const D = range(10);        // Set of digits to use
  const I = range(n);         // Set of digit indexes for an n-digits number.

  // Object used for caching x's index combinations.
  const X = {};

  // Returns valid index combinations for the x's, given d and k.
  const xIndexCombi = (d, k) => {
    if (d === 0)
      return nkCombinations(I.slice(1, -1), k-2).map(c => [0, ...c, n-1]);

    if (!(k in X))
      X[k] = {};

    // Parity of d (0 = even, 1 = odd)
    const p = d & 1;

    if (!(p in X[k])) {
      if (p === 0)
        X[k][p] = nkCombinations(I.slice(0, -1), k-1).map(c => [...c, n-1]);
      else
        X[k][p] = nkCombinations(I, k);
    }

    return X[k][p];
  };

  // Create number candidates from the k-combinations of x's, given d.
  function createNumbers(d, xIdx, xVal) {
    const C = [];
    for (const xs of xVal) {
      for (const pxs of permuteU(xs)) {
        const c = Array(n).fill(d);
        xIdx.forEach((xi, i) => c[xi] = pxs[i]);
        if (c[0] === 0 || (c.at(-1) & 1) === 0)
          continue;
        C.push(+c.join(''));
      }
    }
    return C;
  }

  // Returns the set of n-digits prime numbers having the maximum number of
  // repeated digits d.
  const P = d => {
    const primes = [];

    let k = d === 0 ? 2 : 1;                       // the minimum number of x's
    const xDigits = D.filter(digit => digit != d); // set of values for the x's

    do {
      const xVal = nkCombinations(xDigits, k, true);
      for (const xIdx of xIndexCombi(d, k)) {
        const candidates = createNumbers(d, xIdx, xVal);
        primes.push(...candidates.filter(n => isPrime(n)));
      }
    }
    while (!primes.length && k++);

    return primes;
  }

  // Summing all S(n, d) for each digit d.
  let s = 0;
  for (const d of D) {
    s += sum(P(d));
  }

  return s;
}

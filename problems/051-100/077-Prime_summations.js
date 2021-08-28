/**
 * Problem 77 - Prime summations
 *
 * @see {@link https://projecteuler.net/problem=77}
 *
 * It is possible to write ten as the sum of primes in exactly five different
 * ways:
 *
 *      7 + 3
 *      5 + 5
 *      5 + 3 + 2
 *      3 + 3 + 2 + 2
 *      2 + 2 + 2 + 2 + 2
 *
 * What is the first value which can be written as the sum of primes in over
 * five thousand different ways ?
 */

const { intPartitionR } = require('../../lib/combinatorics');
const { getPrimes } = require('../../lib/prime');

this.solve = function () {
  // This problems relates to integer partition as the previous one, but here
  // we are asked to find the value of n for which the number of partitions
  // into prime parts exceeds 5000 (instead of having to find the number of
  // unrestricted partitions of n).

  // We already had to deal with restricted partitions in problem 31 (Coin sums)
  // where parts size were restricted to some coin denominations.

  // For the coin sums problem, we actually built the partitions of n=200 by
  // combining parts, which could have been useful if we were to produce them
  // to do something with it, but is not efficient when we are only asked to
  // count them.

  // A more efficient way to solve such change making problems is to use dynamic
  // programming, solving the puzzle from bottom up instead of recursively :
  // Given a set of available parts S sorted in ascending order,
  // -> Let consider N and P[N] the number of restricted partitions of N we need
  //    to find.
  // -> Let P an array where P[n] will be the number of r. partitions of n,
  //    with 0 <= n <= N.
  // -> Set P[0] = 1, then solve sub-problem for i, with 0 < i < |S| :
  //    -> let j : S[i] <= j <= N
  //    -> add to p[j] the number of partitions of j-S[i] which are already
  //       computed and represents the combinations of parts smaller than S[i]
  //       that can be (re-)used for adding up to j.
  //    -> increase j and repeat until j = N.
  // -> At the end of the i,j loop, the partitions of n that can be made from
  //    parts belonging to S are computed for n <= N.

  // @see intPartitionR(n, k, S)

  // Now that we got this function, we can find for which n it returns a value
  // exceeding five thousand : starting with a small value, all we need is to
  // increment n and adjust the prime parts accordingly, then check the result.

  const nWays = 5_000;

  // We need an upper bound for the prime parts, we can set an aribtrary value
  // and in case the solution n is greater than this value, then n is probably
  // false and we need to increase the limit.
  const limit = 100;
  const primes = getPrimes(limit);

  let n = 29; // intPartition(29) < 5000, then intPartitionR(29, S) < 5000
  let pn = 0; // partition number

  // Adjusting prime parts according to n.
  let index = primes.findIndex(p => p > n);
  let primeParts = primes.slice(0, index);

  do {
    if (n%2 && primes[index+1] <= n)
      primeParts.push(primes[index++]);
    pn = intPartitionR(n, false, primeParts);
  }
  while (pn <= nWays && n++);

  return n;
};


this.solve2 = function () {

  // Another method using the generating function :

  // Let P a set of prime numbers, then the number of partitions of n whose
  // parts belong to P has the following generating function :
  //
  //  Π[p∈P](1-x^p)^-1

  // A generating function is a single function used to "encode" an infinite
  // sequence. The output of such function is not the nth term of the sequence
  // but a power series whose coefficients are the actual terms.
  // @see http://discrete.openmathbooks.org/dmoi2/section-27.html

  // The generating function (1-x)^-1 yields the series :
  //  1 + x + x² + x³ + x⁴ + ...
  // which corresponds to the sequence of coefficients :
  //  1, 1, 1, 1, 1, ...

  // The sequence for (1-x²)^-1 = 1 + x² + x⁴ + x⁶ + ... is :
  //  1, 0, 1, 0, 1, 0, 1, ...

  // The sequence for (1-x³)^-1 = 1 + x³ + x⁶ + x⁹ + ... is :
  //  1, 0, 0, 1, 0, 0, 1, 0, 0, 1, ...

  // -> There is a simple pattern to exploit here :
  //  Given (1-x^p)^-1, we got the pattern `one, followed by (p-1) zeros` which
  //  repeats indefinitely.

  // We are given Π[p∈P](1-x^p)^-1, wich corresponds to the product of the power
  // series of (1-x^p)^-1 for p the prime parts to be used. This means there is
  // a generating function and its corresponding series for each prime parts,
  // and we need to compute the product of these generating functions.

  // An infinite power series is an infinite sum of terms. We can't manipulate
  // infinite sequences, so we need to set an arbitrary limit for the number of
  // terms to work out. Not an issue as we just need to expand the power series
  // of the generating function until some coefficient exceeds five thousands.
  // So we just need to adjust this limit accordingly.

  const nWays = 5_000;
  const limit = 100;
  const primes = getPrimes(limit);

  // Computes the product of the given sequences A and B.
  // S = a0b0 + (a0b1+a1b0)x + (a0b2+a1b1+a2b0)x² + (a0b3+a1b2+a2b1+a3b0)x³ + ⋯
  const sequenceProduct = (A, B) => {
    let S = Array(limit);
    S[0] = 1; // a0b0 is a constant term as x^0 = 1
    for (let i=1; i<limit; i++) {
      S[i] = 0;
      for (let k=0; k<=i; k++)
        S[i] += A[k] * B[i-k];
    }
    return S;
  };

  // Initilaize the sequence of coefficients given by our power series starting
  // with the smallest prime, as shown above : 1, 0, 1, 0, 1, 0, 1, ...
  let S = Array(limit).fillS([1, 0]);

  // Now for each primes p, we turn (1-x^p)^-1 into the corresponding sequence
  // and update the sequences product accordingly.
  for (let i=1; i<primes.length; i++) {
    const pattern = [1, ...Array(primes[i]-1).fill(0)];
    S = sequenceProduct(S, Array(limit).fillS(pattern));
  }

  const n = S.findIndex(term => term > nWays);
  if (n === -1)
    return [undefined, 'Need to increase `limit`'];

  return n;
};

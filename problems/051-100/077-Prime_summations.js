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

const { intPartition } = require('../../lib/combinatorics');
const { getPrimes } = require('../../lib/prime');

this.solve = function () {
  // This problems relates to integer partition as the previous one, but here
  // we are asked to find the value of n for which the number of partitions
  // into prime parts exceeds 5000 (instead of having to find the number of
  // unrestricted partitions of n).

  // We already had to deal with restricted partitions in problem 31 (Coin sums)
  // where parts size were restricted to some coin denominations.

  // Now that we got a dedicated function, we can easily find for which n the
  // number of restricted partitions exceeds five thousand : starting with a
  // small value for which p(n) < 5000, all we need is to increment n and adjust
  // the prime parts accordingly, until p(n) > 5000.

  const nWays = 5_000;

  // We need an upper bound for the prime parts, we can set an aribtrary value
  // and in case the solution n is greater than this value, then n is probably
  // false and we need to increase the limit.
  const limit = 100;
  const primes = getPrimes(limit);

  let n = 29; // intPartition(30) > 5000 (unrestricted)
  let pn = 0; // partition number

  // Adjusting prime parts according to n.
  let index = primes.findIndex(p => p > n);
  let primeParts = primes.slice(0, index);

  do {
    if (n%2 && primes[index+1] <= n)
      primeParts.push(primes[index++]);
    pn = intPartition(n, null, primeParts);
  }
  while (pn <= nWays && n++);

  return n;
};


this.solve2 = function () {

  // Another method using the generating function :

  // The number of partitions of n into prime parts has the following generating
  // function, with P the set of prime numbers (https://oeis.org/A000607) :
  //
  //    Π[p∈P]1/(1-xᵖ)
  //

  // A generating function is a single function used to "encode" an infinite
  // sequence. The output of such function is not the nth term of the sequence
  // but a power series whose coefficients are the actual terms :
  //  G(x) = a₀ + a₁x + a₂x² + a₃x³ + a₄x⁴ + ...
  // @see https://discrete.openmathbooks.org/dmoi2/section-27.html

  // The generating function 1/(1-x) yields the series :
  //  1 + x + x² + x³ + x⁴ + ...
  // which corresponds to the sequence of coefficients :
  //  1, 1, 1, 1, 1, ...

  // The sequence for 1/(1-x²) = 1 + x² + x⁴ + x⁶ + ... is :
  //  1, 0, 1, 0, 1, 0, 1, ...

  // The sequence for 1/(1-x³) = 1 + x³ + x⁶ + x⁹ + ... is :
  //  1, 0, 0, 1, 0, 0, 1, 0, 0, 1, ...

  // -> There is a simple pattern to exploit here :
  //  Given 1/(1-xᵖ), we got the pattern `one, followed by (p-1) zeros` which
  //  repeats indefinitely.

  // We are given Π[p∈P]1/(1-xᵖ), which corresponds to the product of the power
  // series of 1/(1-xᵖ) for p the prime parts to be used. This means there is
  // a generating function and its corresponding series for each prime parts,
  // and we need to compute the product of these generating functions. Then, in
  // the resulting sequence, we just have to find the index of the first term
  // that exceeds five thousand.

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
    S[0] = 1; // a0b0 is a constant term as x⁰ = 1
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

  // Now for each prime p, we turn 1/(1-xᵖ) into the corresponding sequence
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

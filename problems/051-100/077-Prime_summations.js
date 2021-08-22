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
}

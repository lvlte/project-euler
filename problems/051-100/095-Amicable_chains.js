/**
 * Problem 95 - Amicable chains
 *
 * @see {@link https://projecteuler.net/problem=95}
 *
 * The proper divisors of a number are all the divisors excluding the number
 * itself. For example, the proper divisors of 28 are 1, 2, 4, 7, and 14. As
 * the sum of these divisors is equal to 28, we call it a perfect number.
 *
 * Interestingly the sum of the proper divisors of 220 is 284 and the sum of
 * the proper divisors of 284 is 220, forming a chain of two numbers. For this
 * reason, 220 and 284 are called an amicable pair.
 *
 * Perhaps less well known are longer chains. For example, starting with 12496,
 * we form a chain of five numbers:
 *
 *          12496 → 14288 → 15472 → 14536 → 14264 (→ 12496 → ...)
 *
 * Since this chain returns to its starting point, it is called an amicable
 * chain.
 *
 * Find the smallest member of the longest amicable chain with no element
 * exceeding one million.
 */

this.solve = function () {
  // We call the sum of all proper divisors of n the "aliquot sum" of n, and an
  // "aliquot sequence" is a sequence of nonnegative integers in which each term
  // is the aliquot sum of the previous term.
  // -> https://en.wikipedia.org/wiki/Aliquot_sequence

  // Members of an amicable chain are numbers whose aliquot sums form a cyclic
  // sequence that begins and ends with the same number, they are also called
  // "sociable numbers" of order n, with n the period of the sequence. If the
  // order/period is 1, the number is a perfect number.
  // -> https://en.wikipedia.org/wiki/Sociable_number

  // We are searching for (the smallest term in) the longest cyclic aliquot
  // sequence with no element exceeding one million.

  // So let's build the aliquot sequences of n for n <= limit, and find the
  // the longest cycle.

  // The thing is that computing the proper divisors of n for all integers below
  // one million takes some time. So we will employ the logic used in the sieve
  // of Eratosthenes, but instead of sieving primes by iteratively marking as
  // composite the multiples of each prime, we will directly add up the value
  // of a given divisor to the aliquot sum of each of its multiple.

  const nMax = 1_000_000;

  // Aliquot sums S[n] for 0 < n <= nMax
  let S = new Array(nMax+1).fill(1);
  S[0] = undefined;
  S[1] = 0;

  let d = 1; // divisor of n
  const dMax = nMax/2;
  while (++d <= dMax) {
    for (let n=2*d; n<=nMax; n+=d)
      S[n] += d;
  }

  // Array of aliquot sequences.
  let A = new Array(nMax+1);
  A[0] = [0];
  A[1] = [1, 0];

  // Build/memoize the aliquot sequence of n, recursively if next n is greater.
  const aliquotBuild = (n, from=n) => {
    if (A[n] != undefined)
      return A[n];
    A[n] = [n];
    let next = S[n];
    if (next === n)
      return A[n];    // n is a perfect number
    if (next > from) {
      if (next > nMax) {
        A[n] = false; // exceeds limit, mark as invalid
        return A[n];
      }
      aliquotBuild(next, from);
    }
    // If A[next] exceeds limit, the sequence of n must be discarded too.
    A[next] === false ? A[n] = false : A[n].push(...A[next]);
    return A[n];
  };

  // Checks whether or not the given aliquot sequence forms an amicable chain.
  const isAmicable = chain => chain && chain[0] === chain.last();

  let longest = [];
  let n = 1;

  while (++n <= nMax) {
    const chain = aliquotBuild(n);
    if (isAmicable(chain) && chain.length > longest.length)
      longest = chain;
  }

  return Math.min(...longest);
}

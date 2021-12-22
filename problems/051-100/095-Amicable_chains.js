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

const { sum, divisors } = require('../../lib/math');
const { primesHashMap } = require('../../lib/prime');

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
  // the longest cycle (this is brute force somehow, and even if recursion +
  // memoization is used the following is not very efficient, there must be a
  // better solution.

  const nMax = 1_000_000;

  // Array of aliquot sequences.
  let A = new Array(nMax);
  A[0] = [0];
  A[1] = [1, 0];

  // Aliquot sum of n.
  const primes = primesHashMap(nMax);
  const aliquotSum = n => primes[n] && 1 || sum(divisors(n, true));

  // Build/memoize the aliquot sequence of n, recursively if next n is greater.
  const aliquotBuild = (n, from=n) => {
    if (A[n] != undefined)
      return A[n];
    A[n] = [n];
    let next = aliquotSum(n);
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

  let amicable = {};
  let longest = [];
  let n = 1;

  while (++n <= nMax) {
    const sequence = aliquotBuild(n);
    if (isAmicable(sequence)) {
      if (sequence.length > 1)
        sequence.pop() // remove cycling n
      amicable[n] = sequence;
      if (sequence.length > longest.length)
        longest = sequence;
    }
  }

  // console.log(amicable);

  return Math.min(...longest);
}

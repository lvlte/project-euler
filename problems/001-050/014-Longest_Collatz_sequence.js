/**
 * Problem 14 - Longest Collatz sequence
 *
 * @see {@link https://projecteuler.net/problem=14}
 *
 * The following iterative sequence is defined for the set of positive integers:
 *
 *  n → n/2 (n is even)
 *  n → 3n + 1 (n is odd)
 *
 * Using the rule above and starting with 13, we generate the following
 * sequence:
 *
 *  13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1
 *
 * It can be seen that this sequence (starting at 13 and finishing at 1)
 * contains 10 terms. Although it has not been proved yet (Collatz Problem),
 * it is thought that all starting numbers finish at 1.
 *
 * Which starting number, under one million, produces the longest chain?
 *
 * NOTE: Once the chain starts the terms are allowed to go above one million.
 */

this.solve = function () {
  const limit = 1_000_000;

  // C[n] contains the length of the Collatz sequences with starting number n.
  let C = {1: 1};

  // Helper, uses recursion to leverage the length cache and compute the length
  // of C[n] without storing the terms themselves.
  const collatzLen = n => {
    if (!C[n])
      C[n] = 1 + collatzLen(n % 2 ? 3*n+1 : n/2);
    return C[n];
  };

  let maxLen = 0;
  let bestN = 1;
  let n = 1;

  while (++n < limit) {
    if (collatzLen(n) > maxLen) {
      maxLen = C[n];
      bestN = n;
    }
  }

  return bestN;
}

/**
 * Problem 49 - Prime permutations
 *
 * @see {@link https://projecteuler.net/problem=49}
 *
 * The arithmetic sequence, 1487, 4817, 8147, in which each of the terms
 * increases by 3330, is unusual in two ways:
 * - each of the three terms are prime,
 * - each of the 4-digit numbers are permutations of one another.
 *
 * There are no arithmetic sequences made up of three 1-, 2-, or 3-digit primes,
 * exhibiting this property, but there is one other 4-digit increasing sequence.
 *
 * What 12-digit number do you form by concatenating the three terms in this
 * sequence?
 */

const { nkCombinations } = require('../../lib/combinatorics');
const { iterPrimes } = require('../../lib/prime');
const { digits } = require('../../lib/utils');

this.solve = function () {
  // Searching three terms in a 4-digit arithmetic sequence
  const nDigit = 4;
  const nTerms = 3;

  // Checks if the given sequence of numbers is arithmetic (assuming it contains
  // at least 3 elements).
  const isArithm = (sequence) => {
    const d = sequence[1] - sequence[0];
    for (let i=2; i<sequence.length; i++) {
      if (sequence[i]-sequence[i-1] != d)
        return false;
    }
    return true;
  };

  // We need to find nDigit primes
  const start = 10**(nDigit-1);
  const limit = 10**(nDigit);

  // Index primes permutations by their digit combinations
  // eg. { '1478': [1487, 1847, 4817, 4871, 7481, 7841, 8147, 8741] }
  let primeHT = {};
  for (const prime of iterPrimes(limit)) {
    if (prime < start)
      continue;
    const hash = digits(prime, false).sort((a,b) => a-b).join('');
    if (hash in primeHT)
      primeHT[hash].push(prime);
    else
      primeHT[hash] = [prime];
  }

  // Now that prime permutations are indexed, create nTerms sequences from them
  // and check if it is an arithmetic sequence. For example, given a set of n
  // primes permutations: [1487, 1847, 4817, 4871, 7481, 7841, 8147, 8741], n=8,
  // we need to create all possible k-combinations, k=nTerms (nChooseK).
  let match; // matching sequence
  search:
  for (const hash in primeHT) {
    if (primeHT[hash].length < nTerms)
      continue;
    const combinations = nkCombinations(primeHT[hash], nTerms);
    for (let i=0; i<combinations.length; i++) {
      if (isArithm(combinations[i])) {
        match = combinations[i];
        if (match[0] == 1487 && match[1]-match[0] == 3330)
          continue; // skipping example sequence
        break search;
      }
    }
  }

  return match.join('');
}

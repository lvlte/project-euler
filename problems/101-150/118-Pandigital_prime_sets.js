/**
 * Problem 118 - Pandigital prime sets
 *
 * @see {@link https://projecteuler.net/problem=118}
 *
 * Using all of the digits 1 through 9 and concatenating them freely to form
 * decimal integers, different sets can be formed. Interestingly with the set
 * {2,5,47,89,631}, all of the elements belonging to it are prime.
 *
 * How many distinct sets containing each of the digits one through nine exactly
 * once contain only prime elements ?
 */

const { setPartitions, permute } = require('../../lib/combinatorics');
const { sum, remZero } = require('../../lib/math');
const { isPrime } = require('../../lib/prime');
const { range } = require('../../lib/utils');

this.solve = function () {

  // We need to find the partitions of the set {1, 2, 3, 4, 5, 6, 7, 8, 9} for
  // which every parts corresponds to a permutation of a prime number, and count
  // how many prime sets can be formed from them.

  // We know there exists no 1-to-9 pandigital prime number because the sum of
  // their digits 1 + 2 + ... + 9 is divisible by 9.
  // (cf. https://en.wikipedia.org/wiki/Divisibility_rule).

  // This means the set partitions we are after must have at least two parts.

  // But what is the maximum number of parts they could have ? We know it's not
  // nine, because we don't have nine one-digit prime numbers, it's not eight
  // either. The integer partitions of 9 with 7 terms have at least 5 ones, not
  // good. But it can work with 6 terms :
  //  [1, 1, 1, 1, 1, 4] -> nope
  //  [1, 1, 1, 1, 2, 3] -> partitions of the form {2, 3, 5, 7, xx, xxx}
  //  [1, 1, 1, 2, 2, 2] -> partitions of the form {x, x, x, xx, xx, xx}

  // So the set partitions we are looking for must have at least two and at most
  // six subsets.

  // Now, since the same part can appear several times (in different partitions)
  // we want to avoid having to check it each time (ie. avoid a primality test
  // for every permutations of the same part). We use a hash table for caching
  // the number of prime numbers that can be maid from a given part.

  // We also use the divisibility rule mentioned above to check whether or not
  // a given part can be used to form a prime number : only those parts whose
  // sum is not divisible by 3 need to be permuted and checked.

  // Initialize the cache by hand for some small parts.
  const cache = new Map([ [2, 1], [3, 1], [5, 1], [7, 1], [13, 2], [17, 2] ]);

  // Returns the number of permutations of the given part that correspond to a
  // prime number.
  const nPrimePerm = part => {
    const cid = +part.join(''); // nb. Map set/get faster with primitive keys.
    if (cache.has(cid))
      return cache.get(cid);
    let count = 0;
    if (!remZero(sum(part), 3)) {
      for (const p of permute(part)) {
        if (isPrime(+p.join('')))
          count++;
      }
    }
    cache.set(cid, count);
    return count;
  }

  // When we find a "prime" partition we got one or more pandigital prime set(s)
  // for that partition : as one part can map to several primes, the number of
  // prime sets is the number of prime combinations within the same partition.

  const D = range(1, 10);
  let nSets = 0;

  for (const P of setPartitions(D)) {
    if (P.length < 2 || P.length > 6)
      continue;
    let nCombi = 1;
    for (const part of P) {
      nCombi *= nPrimePerm(part);
      if (nCombi === 0)
        break;
    }
    nSets += nCombi;
  }

  return nSets;
}

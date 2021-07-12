/**
 * Problem 50 - Consecutive prime sum
 *
 * @see {@link https://projecteuler.net/problem=50}
 *
 * The prime 41, can be written as the sum of six consecutive primes:
 *
 *                  41 = 2 + 3 + 5 + 7 + 11 + 13
 *
 * This is the longest sum of consecutive primes that adds to a prime below 100.
 *
 * The longest sum of consecutive primes below one-thousand that adds to a prime
 * contains 21 terms, and is equal to 953.
 *
 * Which prime, below one-million, can be written as the sum of the most
 * consecutive primes ?
 */

const { iterPrimes, isPrime } = require('../../lib/prime');

this.solve = function () {
  // We need to generate all primes below the given limit
  const limit = 1_000_000;
  const primes = iterPrimes(limit);

  // While collecting primes, we will add them up until reaching the limit,
  // keeping track of the prime sum p0 + p1 + ... + p(i) at index i.
  let primeSum = []; // contains prime sum pairs [(p[i], pSum[i]), ...]

  // We will get something like this (with limit=100) :
  //    p[i], pSum[i]
  //    [  2, 2  ]
  //    [  3, 5  ]  From there, we can already check for the longest sum of
  //    [  5, 10 ]  consecutive primes that starts with 2, by testing each
  //    [  7, 17 ]  element from the list in reverse order.
  //    [ 11, 28 ]
  //    [ 13, 41 ] -> prime
  //    [ 17, 58 ] -> x
  //    [ 19, 77 ] -> x

  // Once we got a prime number, we have a sequence candidate for the longest
  // prime sum yielding a prime, having the first and last terms (here 2 and 13)
  // the actual sum (41), and the number of terms in that sequence (6).

  // Obviously if the sequence starting with 2 contains all terms, there is no
  // need to go further. Otherwise it means there is at least one prime to be
  // removed from the beginning or the end of the initial prime sum.

  // In our example we already did "remove" primes from the end until getting
  // our first match corresponding to a 6-terms sum.
  // Now in order to "remove" a prime from the beginning of our sum and get the
  // actual result, we can just substract that prime's paired value from the
  // actual one at a given index :

  //   ̶ ̶[̶ ̶ ̶2̶,̶ ̶2̶ ̶ ̶]̶
  //   ̶ ̶[̶ ̶ ̶3̶,̶ ̶5̶ ̶ ̶]̶  Removing the smallest prime from our initial sum amounts
  //    [  5, 10 ]  to substract the value of its pair from the sum.
  //    [  7, 17 ]
  //    [ 11, 28 ]  removing the 2 :  |   removing the (2 and) 3 :
  //    [ 13, 41 ] ->  --break--      |
  //    [ 17, 58 ] ->  58-2 = 56      |      --break--
  //    [ 19, 77 ] ->  77-2 = 75      |      77-5 = 72

  // "remove" is quoted because the initial prime sum remains untouched, and
  // we actually ignore these terms instead of removing anything.

  // Again, the process goes backwards and continues until we get a prime, or
  // until the length of the sequence candidate falls below the longest we got
  // so far (--break--).

  // There is one more thing to take account of : the next elements in our prime
  // sum that would be above the limit at first, but not after some removals :
  //       ...
  //    [ 11, 28  ]  removing the 2 :  |   removing the (2 and) 3 :
  //    [ 13, 41  ] ->  --break--      |
  //    [ 17, 58  ] ->  58-2 = 56      |      --break--
  //    [ 19, 77  ] ->  77-2 = 75      |      77-5 = 72
  //    [ 23, 100 ] -> 100-2 = 98      |     100-5 = 95
  //       ...

  // We can observe that removing smaller primes could allow bigger ones to
  // be included in our sum, in which case it would be complicated to add them
  // up along and update the list accordingly.

  // The trick is to have them initially loaded in our sum and add a condition
  // to check if pSum[i] < limit. To do that we just we raise the sum maximum
  // to 2*limit.

  const max = 2*limit;

  let prime = primes.next().value;
  let sum = 0;

  while ((sum += prime) < max) {
    primeSum.push([prime, sum]);
    prime = primes.next().value;
  }

  // Longest sum of consecutive primes
  let longest = {
    p0: null,
    pᵢ: null,
    pSum: null,
    len: 0
  };

  // Recap - Now that we got our initial prime sum :
  // - For each collected primes starting from the lowest term :
  // -- p0=2 :
  // --- Check for the longest sum starting with p0 going backwards from the end
  // --- Break when find prime or when the sum length falls below actual longest
  // -- p0=pᵢ
  // --- (repeat, sum length is decreased as we ignore pᵢ₋₁ and previous terms)
  // -- ...
  // - When the number of terms from p0 to the end of the sequence falls below
  //   the actual longest, break.

  for (let i=0; i<primeSum.length; i++) {
    if (primeSum.length-i < longest.len)
      break;

    const p0 = primeSum[i][0];
    const ignored = i > 0 ? primeSum[i-1][1] : 0;

    let j = primeSum.length;
    let pSum, match;

    while (j>0 && j-i > longest.len) {
      pSum = primeSum[--j][1] - ignored;
      if (match = (pSum < limit && isPrime(pSum)))
        break;
    }

    if (match && j+1-i > longest.len)
      longest = {p0, pᵢ:primeSum[j][0], pSum, len:j+1-i};
  }

  // console.log(longest);

  return longest.pSum;
}

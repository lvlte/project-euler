/**
 * Problem 51 - Prime digit replacements
 *
 * @see {@link https://projecteuler.net/problem=51}
 *
 * By replacing the 1st digit of the 2-digit number *3, it turns out that six
 * of the nine possible values: 13, 23, 43, 53, 73, and 83, are all prime.
 *
 * By replacing the 3rd and 4th digits of 56**3 with the same digit, this
 * 5-digit number is the first example having seven primes among the ten
 * generated numbers, yielding the family:
 *      56003, 56113, 56333, 56443, 56663, 56773, and 56993.
 * Consequently 56003, being the first member of this family, is the smallest
 * prime with this property.
 *
 * Find the smallest prime which, by replacing part of the number (not
 * necessarily adjacent digits) with the same digit, is part of an eight
 * prime value family.
 */

const { nkCombinations } = require('../../lib/combinatorics');
const { sum, remZero } = require('../../lib/math');
const { iterPrimes, isPrime } = require('../../lib/prime');
const { range, digits } = require('../../lib/utils');

this.solve = function () {
  // The first thing to note is that since we are searching for an eight prime
  // family, the last digit (ltr) of such prime can't be a wildcard digits (as
  // it is necessarilly one of {1, 3, 7, 9}, we wouldn't make more than four
  // prime with that).

  // Also, the wildcard digits of the smallest prime we are searching for can't
  // be greater than 2 since there are 8 members in the family.

  // Actually the hardest thing in this problem is to figure out how many
  // fixed digits and wildcard digits we can|should have in our prime family.

  // Regarding the number of wildcard digits we need, I assumed there were three
  // which is actually the case, but was not able to prove it until I found this
  // page https://www.mathblog.dk/project-euler-51-eight-prime-family where the
  // author describes a trick using a divisibility rule.

  // I didn't catch it at first glance so I wrote down the following to make
  // sense of it :

  // 1. Any number is divisible by 3 (or 9) if and only if the sum of its digits
  //    is divisible by 3 (or 9) https://en.wikipedia.org/wiki/Divisibility_rule

  // We are therefore looking for numbers for which the digit sum cannot be
  // divisible by 3 : if p is prime, digitSum(p) % 3 != 0

  // 2. Modular arithmetic tells us that (x+y) % n = ((x%n) + (y%n)) % n

  // Then if p is prime, with D the list of its fixed digits and X the list of
  // its wildcard digits, we got :
  //  digitSum(p) = digitSum(...D) + digitSum(...X)
  //  digitSum(p) % 3 != 0 <=> digitSum(...D) + digitSum(...X) % 3 != 0
  //  (digitSum(...D)%3 + digitSum(...X)%3) % 3 != 0

  // Let's call the digitSum of p, D, X, respectively dp, dD, dX :
  //  dp % 3 = (dD%3 + dX%3) % 3 != 0

  // Using 2 wildcard digits, we got te following table :

  //  | X=** |  dX  | dX%3 |dp%3, dD%3=0|dp%3, dD%3=1|dp%3, dD%3=2|
  //  -------------------------------------------------------------
  //  |  00  |   0  |   0  |      0     |      1     |      2     |
  //  |  11  |   2  |   2  |      2     |      0     |      1     |
  //  |  22  |   4  |   1  |      1     |      2     |      0     |
  //  |  33  |   6  |   0  |      0     |      1     |      2     |
  //  |  44  |   8  |   2  |      2     |      0     |      1     |
  //  |  55  |  10  |   1  |      1     |      2     |      0     |
  //  |  66  |  12  |   0  |      0     |      1     |      2     |
  //  |  77  |  14  |   2  |      2     |      0     |      1     |
  //  |  88  |  16  |   1  |      1     |      2     |      0     |
  //  |  99  |  18  |   0  |      0     |      1     |      2     |

  // We can observe that :
  // -> When dD%3 = 0, there are four outcomes for which dp%3 = 0 and six for
  //    which dp%3 != 0
  // -> When dD%3 != 0, there are three outcomes for which dp%3 = 0 and seven
  //    for which dp%3 != 0

  // This means that whatever the digits D, there can be at most seven non
  // divisible numbers that can be made from D + two wildcard digits.

  // We can also find a match with the example : when dD%3=2, the values for
  // dp%3 != 0 correspond to the wildcards [00, 11, 33, 44, 66, 77, 99], which
  // are exactly those found in the 56**3 family, where 5+6+3 % 3 = 2.

  // Using only one wildcard digit, we got merely the same result with the same
  // conclusion, that is, we can't make an 8 prime family with only seven non
  // divisible numbers.

  // The same is true when using 4 or 5 wildcard digits, where the maximum is
  // also seven.

  // -> Using 3 wildcard digits, we got te following table :

  //  | X=*** |  dX  | dX%3 |dp%3, dD%3=0|dp%3, dD%3=1|dp%3, dD%3=2|
  //  --------------------------------------------------------------
  //  |  000  |   0  |   0  |      0     |      1     |      2     |
  //  |  111  |   3  |   0  |      0     |      1     |      2     |
  //  |  222  |   6  |   0  |      0     |      1     |      2     |
  //  |  333  |   9  |   0  |      0     |      1     |      2     |
  //  |  444  |  12  |   0  |      0     |      1     |      2     |
  //  |  555  |  15  |   0  |      0     |      1     |      2     |
  //  |  666  |  18  |   0  |      0     |      1     |      2     |
  //  |  777  |  21  |   0  |      0     |      1     |      2     |
  //  |  888  |  24  |   0  |      0     |      1     |      2     |
  //  |  999  |  27  |   0  |      0     |      1     |      2     |

  // Things are much clearer now : with 3 wildcards and when dD % 3 != 0, we got
  // ten non-divisible numbers candidates for being a member of our eigth prime
  // family.

  // We know the wildcard digits of the smallest prime we are searching for must
  // be either 0, 1 or 2.

  // So we are going to iterate primes in ascending order and will try to create
  // a family from any prime that has at least three 0, 1 or 2, and for which
  // the digit sum of the other (fixed) digits dD % 3 != 0.

  const familyLen = 8;
  const nWildcards = 3;

  // Check if the given prime digits match the conditions above, in which case
  // it returns the matching wildcard digit, false otherwise.
  const checkDigits = (pDigits) => {
    const occ = pDigits.occurrences();
    let d; // the wildcard digit
    if (!(occ[2] >= nWildcards && (d=2) || occ[1] >= nWildcards && (d=1) || occ[0] >= nWildcards))
      return false;
    d = d || 0;
    const dD = sum(pDigits) - nWildcards*d;
    return !remZero(dD, 3) && d;
  }

  // Try to make an eight prime family from the given digits and wildcard index,
  // returns the complete family if it succeeds, otherwise an incomplete one, as
  // the check will break as early as possible.
  const primeFamily = (p, pDigits, indexes, d) => {
    let family = [p];
    let canSkip = 2 - d;
    while (canSkip >= 0 && family.length < familyLen) {
      pDigits = pDigits.map((dig, i) => indexes.includes(i) ? +dig+1 : +dig);
      const n = +pDigits.join('');
      if (isPrime(n))
        family.push(n);
      else
        canSkip--;
    }
    return family;
  }

  // Since 56003 is the smallest prime of a seven prime family, I will assume
  // that the smallest prime of our eight prime family has at least five digits.
  let nDigits = 5;

  // Prime generator
  const primeGen = iterPrimes();

  // The matching prime family
  let eightPrimeFam;

  Search:
  while (true) {
    // Create the wildcard digits index combination for nDigits numbers :
    // Pick nWildcards from the set of nDigits-1 indexes (last digit is fixed,
    // eg. 6 digits -> 3 choose 5).
    const indexes = range(nDigits-1);
    const wildcardCombi = nkCombinations(indexes, nWildcards);

    const min = 10**(nDigits-1);
    const limit = 10**(nDigits);
    let prime;

    while ((prime = primeGen.next().value) && prime < limit) {
      if (prime < min)
        continue;
      const pDigits = digits(prime, false);
      const d = checkDigits(pDigits);
      if (d === false)
        continue;
      for (let i=0; i<wildcardCombi.length; i++) {
        // Skip non matching pattern
        if (!wildcardCombi[i].every(index => pDigits[index] == d))
          continue;
        // Create the prime family derived from that pattern.
        const pFam = primeFamily(prime, pDigits, wildcardCombi[i], d);
        if (pFam.length === familyLen) {
          eightPrimeFam = pFam;
          break Search;
        }
      }
    }

    // Reaching this point means no match with nDigits so try with one more.
    nDigits++;
  }

  return eightPrimeFam[0];
}

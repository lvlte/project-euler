/**
 * Problem 74 - Digit factorial chains
 *
 * @see {@link https://projecteuler.net/problem=74}
 *
 * The number 145 is well known for the property that the sum of the factorial
 * of its digits is equal to 145: 1! + 4! + 5! = 1 + 24 + 120 = 145
 *
 * Perhaps less well known is 169, in that it produces the longest chain of
 * numbers that link back to 169; it turns out that there are only three such
 * loops that exist:
 *
 *  169 → 363601 → 1454 → 169
 *  871 →  45361 →  871
 *  872 →  45362 →  872
 *
 * It is not difficult to prove that EVERY starting number will eventually get
 * stuck in a loop. For example,
 *
 *  69 → 363600 → 1454 → 169 → 363601 (→ 1454)
 *  78 → 45360 → 871 → 45361 (→ 871)
 *  540 → 145 (→ 145)
 *
 * Starting with 69 produces a chain of five non-repeating terms, but the
 * longest non-repeating chain with a starting number below one million is
 * sixty terms.
 *
 * How many chains, with a starting number below one million, contain exactly
 * sixty non-repeating terms?
 */

const { nkCombinations, permuteU } = require('../../lib/combinatorics');
const { sum, mfact } = require('../../lib/math');
const { digits, range } = require('../../lib/utils');

this.solve = function () {
  const limit = 1_000_000;
  const nrTerms = 60;

  // The idea is to think of a hash table where we could use all distinct digit
  // combinations of n for n < limit as keys, and the corresponding factorial
  // chain that follows as values.

  // By using the digits combinations of n, we avoid having to recompute chains
  // for which every members except n is the same, thanks to the commutative
  // property of our factorial sums (multiplication and addition), for example :
  //  for n = 169  :  169 → 363601 → 1454 → 169
  //  then for every permutation of n,
  //      p = P(n) :    p → 363601 → 1454 → 169
  //  eg. p = 916  :  916 → 363601 → 1454 → 169

  // We can also take advantage of the fact that 0! = 1! = 1 : it means that for
  // any n, zeros can be replaced by ones and conversely, it won't affect what
  // follows in the corresponding digit factorial chain. So we can replace all
  // zeros by ones in order to get more matches (less re-computation).

  // Actually with that in mind, instead of considering every n below the limit
  // for which we would check if its chain exists, or index it if not, we can
  // just build up the digit combinations of n and from there check which one(s)
  // yield a 60 non-repeating terms chain. So we won't even have to maintain a
  // hash map, just iterate over the combinations and build their respective
  // chains (ie. only once).

  // Now we need to build multi-combinations (repetition of the same digits is
  // allowed) given the set of digits [1 to 9], excluding the zero as explained
  // above. We will use nk combinations actually, with 1 <= k <= log10(limit),
  // k being the number of digits to consider.

  // Then, when one of these combinations yields a 60 non-repeating terms chain,
  // we just have to count the unique permutations of that combination to know
  // exactly how many n's produce the same chain, adding the count to the total.

  // Since we discard the 0's which are the same as 1 in factorial digit sums,
  // then if a matching combination contains 1's, we will also have to consider
  // the unique permutations of that combination after each possible "1 to 0"
  // replacements.

  // Returns the sum of the factorial of the given digits.
  const fSum = dd => sum(dd.map(d => mfact(+d)));

  // Fill the given chain until it loops on itself.
  const fillChain = (chain, n) => {
    do {
      chain.add(n);
      n = fSum(digits(n, false));
    }
    while (!chain.has(n));
  }

  let count = 0;
  const set = range(1, 10);

  for (let k=2; k<=Math.log10(limit); k++) {
    const combis = nkCombinations(set, k, true);

    for (let i=0; i<combis.length; i++) {
      const n = +combis[i].join('');
      const chain = new Set();
      fillChain(chain, n);

      if (chain.size != nrTerms)
        continue;

      let p = permuteU(combis[i]);
      count += p.length;

      for (let j=0; j<combis[i].length; j++) {
        if (combis[i][j] != 1)
          continue;

        combis[i][j] = 0;
        p = permuteU(combis[i]).filter(p => p[0] != 0);
        count += p.length;
      }
    }
  }

  return count;
}

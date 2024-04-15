/**
 * Problem 108 - Diophantine reciprocals I
 *
 * @see {@link https://projecteuler.net/problem=108}
 *
 * In the following equation x, y, and n are positive integers.
 *
 *      1/x + 1/y = 1/n
 *
 * For n = 4 there are exactly three distinct solutions:
 *
 *      1/5 + 1/20 = 1/4
 *      1/6 + 1/12 = 1/4
 *      1/8 + 1/8  = 1/4
 *
 * What is the least value of n for which the number of distinct solutions
 * exceeds one-thousand?
 *
 * NOTE: This problem is an easier version of Problem 110; it is strongly
 * advised that you solve this one first.
 */

const { logb, product } = require('../../lib/math');
const { getNPrimes, primeFactors } = require('../../lib/prime');
const { range, count } = require('../../lib/utils');

this.solve = function () {

  // Let a(n) the number of ways to write 1/n as a sum of exactly 2 unit
  // fractions. From the OEIS (https://oeis.org/A018892), we can read :
  //
  //  If n = (p1^a1)(p2^a2)...(pk^ak),
  //  a(n) = ((2*a1 + 1)(2*a2 + 1) ... (2*ak + 1) + 1) / 2.
  //
  // Nb. (2*a1 + 1)(2*a2 + 1) ... (2*ak + 1) corresponds to the number of
  // divisors of n², thus a(n) is also the number of divisors of n² less than
  // or equal to n (Vladeta Jovovic).

  // We can observe that a(n) depends solely on the exponents, not the primes
  // themselves. This means we can minimize n arbitrarily while preserving the
  // value of a(n), for example :
  //
  //    let n = 5² * 7⁴,
  //     a(n) = ((2*2 + 1)(2*4 + 1) + 1) / 2
  //
  //  -> There are two prime factors involved but their value doesn't matter for
  //     a(n), so instead of p1=5 and p2=7, we can use p1=2 and p2=3.
  //  -> Still, obviously 2⁴ * 3² < 2² * 3⁴, so we can reorder the exponents
  //     properly.
  //
  //     a(n) = ((2*4 + 1)(2*2 + 1) + 1) / 2
  //        n = 2⁴ * 3² << 5² * 7⁴
  //
  // More generally, this means the least value of n we are after must satisfy
  // n = (p1^a1)(p2^a2)...(pk^ak), with :
  //  -> [p1, ..., pk] the set of the first k prime numbers   (rule 1)
  //  -> a1 >= a2 >= a3 >= ... >= ak                          (rule 2)
  //  -> a(n) > target                                        (rule 3)

  // Now let's find an upper bound for k, that is, the maximum number of
  // distinct prime numbers we will need to use in the next steps.
  //
  //  Let n, product of k distinct primes whose exponents are all ones :
  //
  //          n = p1*p2*...*pk
  //       a(n) = ((2*1 + 1)(2*1 + 1) ... (2*1 + 1) + 1) / 2.
  //       a(n) = (3^k + 1) / 2.
  //
  //  We want a(n) > target, so the number of distinct prime factors required in
  //  this situation would be :
  //
  //          (3^k + 1) / 2 > target
  //                    3^k > 2*target - 1
  //                      k > log3(2*target - 1)
  //          k = ⌈log3(2*target - 1)⌉
  //
  // So with target = 1000, we got k = 7, and thus n = 2*3*5*7*11*13*17.

  // From there, we got the least value of n for k, that is the product of the
  // first k primes. So we will start with that set of k primes, along with a
  // set of exponents consisting of k ones.

  // The next step is to find smaller n satisfying the 3 rules. Starting from
  // the n value found above, we shall decrement the exponent of the largest
  // prime (which amount to remove pk from the set of primes in use and remove
  // its exponent ak from the set of exponents as well) and increment some of
  // the remaining exponents accordingly, eg. :
  //
  //  least n for k=7    | candidates for k-1
  // --------------------------------------------------------------------------
  //  (2*3*5*7*11*13)*17 > (2*3*5*7*11*13)*2  = 2²*3*5*7*11*13 (good candidate)
  //  (2*3*5*7*11*13)*17 > (2*3*5*7*11*13)*3  = 2*3²*5*7*11*13 (rule 2 broken)
  //  (2*3*5*7*11*13)*17 > (2*3*5*7*11*13)*2² = 2³*3*5*7*11*13 (good candidate)
  //  (2*3*5*7*11*13)*17 > (2*3*5*7*11*13)*5  = 2*3*5²*7*11*13 (rule 2 broken)
  //   ...
  //  and so on, replacing pk by any integer m such that 2 <= m < pk.
  //
  // For each value of m, we have one candidate satisfying the 1st rule, but not
  // necessarily the 2nd one, if it doesn't we will just skip it, in the other
  // case we have a good candidate that is smaller than the current value of n,
  // and (by starting with m=2 and incrementing it) that is also smaller than
  // all next candidates with k-1 primes, which means that if such candidate
  // satisfies the 3d rule, then we got the least value of n for k-1, we can
  // therefore break the m loop as early as possible and proceed to find better
  // by repeating these steps for k-2, and so on, until no more candidates can
  // be found.

  const target = 1000;
  const target2 = 2*target - 1;

  const k = Math.ceil(logb(target2, 3));
  const primes = getNPrimes(k);
  let n = product(primes);

  // Exponents keyed by their prime base {p1: ^a1, ...pk: ^ak}
  let exponents = primes.mapToObj(p => [p, 1]);

  // Values of m, 2 <= m < pk, mapped to their corresponding prime factorization
  // represented as : { m: {m_p1: ^m_a1, ...m_pk: ^m_ak} }.
  const M = range(2, primes.at(-1)).mapToObj(m => [m, count(primeFactors(m))]);

  // Sums the prime exponents from E1 and E2 while checking for the 2nd rule.
  const sumExp = (E1, E2) => {
    const E = {};
    let prev = Infinity;
    for (const p in E1) {
      E[p] = E1[p] + (E2[p] ?? 0);
      if (E[p] > prev) return false;
      prev = E[p];
    }
    return E;
  }

  // Checks whether the given set of prime^exponents E satisfies the 3d rule.
  //  a(n) > target <=> (2*a1 + 1)...(2*ak + 1) > 2*target - 1
  const check = (E) => product(Object.values(E).map(a => 2*a + 1)) > target2;

  // Finding the least value of n...
  while (primes.length > 1) {
    const pk = primes.pop();
    delete exponents[pk];
    for (let m=2; m<pk; m++) {
      const candidate = sumExp(exponents, M[m]);
      if (!candidate)
        continue;
      if (check(candidate)) {
        exponents = candidate;
        n = product(primes.map(p => p**exponents[p]));
        break;
      }
    }
  }

  return n;
}

/**
 * Problem 110 - Diophantine reciprocals II
 *
 * @see {@link https://projecteuler.net/problem=110}
 *
 * In the following equation x, y, and n are positive integers.
 *
 *      1/x + 1/y = 1/n
 *
 * It can be verified that when n = 1260, there are 113 distinct solutions and
 * this is the least value of n for which the total number of distinct solutions
 * exceeds one hundred.
 *
 * What is the least value of n for which the number of distinct solutions
 * exceeds four million?
 *
 * NOTE: This problem is a much more difficult version of Problem 108 and as it
 * is well beyond the limitations of a brute force approach it requires a clever
 * implementation.
 */

const { logb, product } = require('../../lib/math');
const { getNPrimes, primeFactors } = require('../../lib/prime');
const { range, count } = require('../../lib/utils');

this.solve = function () {

  // @see problem 108

  // Exact same solution as for problem 108, but using BigInt where necessary to
  // handle numbers greater than Number.MAX_SAFE_INTEGER (108 solution actually
  // works with 4_000_000 as target, the idea here is to be able to input even
  // bigger).

  const target = 4_000_000;
  const target2 = 2*target - 1;

  const k = Math.ceil(logb(target2, 3));
  const primes = getNPrimes(k).map(BigInt);
  let n = product(primes);

  let exponents = primes.mapToObj(p => [p, 1]);
  const M = range(2n, primes.at(-1)).mapToObj(m => [m, count(primeFactors(m))]);

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

  const check = (E) => product(Object.values(E).map(a => 2*a + 1)) > target2;

  while (primes.length > 1) {
    const pk = primes.pop();
    delete exponents[pk];
    for (let m=2n; m<pk; m++) {
      const candidate = sumExp(exponents, M[m]);
      if (!candidate)
        continue;
      if (check(candidate)) {
        exponents = candidate;
        n = product(primes.map(p => p**BigInt(exponents[p])));
        break;
      }
    }
  }

  return n;
}

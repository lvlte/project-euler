/**
 * Problem 123 - Prime square remainders
 *
 * @see {@link https://projecteuler.net/problem=123}
 *
 * Let pₙ be the nth prime: 2, 3, 5, 7, 11, ..., and let r be the remainder when
 * (pₙ−1)ⁿ + (pₙ+1)ⁿ is divided by pₙ².
 *
 * For example, when n = 3, p₃ = 5, and 4³ + 6³ = 280 ≡ 5 mod 25.
 *
 * The least value of n for which the remainder first exceeds 10⁹ is 7037.
 *
 * Find the least value of n for which the remainder first exceeds 10¹⁰.
 */

const { iterPrimes } = require('../../lib/prime');

this.solve = function () {

  // This is a variant of Problem 120 "Square Remainders" where we learnt that
  //
  //  -> for n odd  :  r = 2n*pₙ % pₙ²
  //  -> for n even :  r = 2
  //
  // So the value of n we are after must be odd.

  // Also, since 2n < pₙ for n > 4, then 2n*pₙ % pₙ² = 2n*pₙ for n > 4. Now we
  // have :
  //
  //  r = 2n * pₙ   for n odd and n > 4
  //
  // So we just want the least value of n for which 2n * pₙ > 10¹⁰.

  const limit = 10**10;
  const k = limit/2;

  const primeGen = iterPrimes();

  let n = 1;
  let pn = primeGen.next().value;

  do {
    n += 2;
    pn = primeGen.next() && primeGen.next().value;
  }
  while (n * pn <= k);

  // console.log(`n=${n}, pn=${pn}`);

  return n;
}

/**
 * Problem 97 - Large non-Mersenne prime
 *
 * @see {@link https://projecteuler.net/problem=97}
 *
 * The first known prime found to exceed one million digits was discovered in
 * 1999, and is a Mersenne prime of the form 2⁶⁹⁷²⁵⁹³−1; it contains exactly
 * 2,098,960 digits. Subsequently other Mersenne primes, of the form 2ᵖ-1, have
 * been found which contain more digits.
 *
 * However, in 2004 there was found a massive non-Mersenne prime which contains
 * 2,357,207 digits: 28433×2⁷⁸³⁰⁴⁵⁷+1.
 *
 * Find the last ten digits of this prime number.
 */

const { modPow } = require('../../lib/math');

this.solve = function () {

  // As seen in problem 48, we can use modular exponentiation to computes only
  // the digits of interest, and thus avoid having to handle numbers with more
  // than 10 digits (@see modPow() function).
  //
  //  n^k % m = (n * n * ...) % m
  //            = ((n % m) * (n % m) * ...) % m

  // We can also optimize the computation by taking advantage of the fact that
  // the powers of a positive integer can only take a finite number of different
  // values modulo n, and these values might follow a cyclic pattern :
  //
  //  For example if we observe the last digit of the powers of two,
  //
  //    2^k : 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, ...
  //
  //  we can see that starting with k=1, 2^k modulo 10 is periodic and follows
  //  the cycle (2, 4, 8, 6), of period 4.
  //
  //  In other words, 2^k % 10 = 2^x % 10, with x = (k-1) % 4 + 1.

  // More generally, the powers of 2 modulo 10^k follow a cyclic pattern for any
  // k>0, which starts at 2^k, and the period corresponds to the multiplicative
  // order of 2 modulo 5^k, which is given by Euler's totient function :
  //   φ(5^k) = 4 * 5^(k-1)

  // @see https://en.wikipedia.org/wiki/Power_of_two#Table_of_values
  // @see https://mathworld.wolfram.com/ModuloMultiplicationGroup.html
  // @see https://en.wikipedia.org/wiki/Multiplicative_group_of_integers_modulo_n
  // @see https://en.wikipedia.org/wiki/Multiplicative_order

  const k = 10;
  const n = 10**k;

  const len = 4*5**(k-1);
  const exp = (7830457-k) % len + k; // 17957

  return (28433 * modPow(2, exp, n) + 1) % n;
}

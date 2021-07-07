/**
 * Problem 35 - Circular primes
 *
 * @see {@link https://projecteuler.net/problem=35}
 *
 * The number, 197, is called a circular prime because all rotations of the
 * digits: 197, 971, and 719, are themselves prime.
 *
 * There are thirteen such primes below 100:
 *
 *        2, 3, 5, 7, 11, 13, 17, 31, 37, 71, 73, 79, 97
 *
 * How many circular primes are there below one million ?
 */

const { remZero } = require('../../lib/math');
const { isPrime } = require('../../lib/prime');
const { range } = require('../../lib/utils');

this.solve = function () {
  // We could generate all primes below the given limit and check whether they
  // are circular or not.
  // However, since any number containing at least one even digit can't be a
  // circular prime, except 2, we can improve the way we get to the limit by
  // adjusting the increment according to the number we are checking.

  const limit = 1_000_000;

  // Will go through odd numbers, odd tens, odd hundreds, etc. So the default
  // increment is 2, then the ajdustments we need are the powers of ten (for
  // example given n=199, n+2=201, then we need to add 10 + 100 to get 311).
  const len = Math.ceil(Math.log10(limit));
  const increments = range(len).map(i => 10**i);

  // The number of times an increment is used (mapped by index), mod 5 (10/2=5).
  let iCounter = Array(len).fill(0); // assuming n=1

  // Adjust increments and update n accordingly.
  const update = (n) => {
    let incr = 2;
    let i = 0;
    n += incr;
    while (remZero(++iCounter[i], 5)) {
      iCounter[i] = 0;          // reset
      incr = increments[++i];   // take next increment
      if (incr && n - incr > incr)
        n += incr;
      else
        break;
    }
    return n;
  }

  // Checks whether or not n is a circular prime.
  const isCircP = n => {
    if (!isPrime(n))
      return false;
    let N = (''+n).split('');
    let rotations = N.length-1;
    while (rotations-- > 0) {
      if (!isPrime(+N.rotate().join('')))
        return false;
    }
    return true
  };

  // How many circular primes (start with 1 because we will miss the 2).
  let circular = 1;
  let n = 1;

  while ((n = update(n)) < limit) {
    if (isCircP(n))
      circular++;
  }

  return circular;
}

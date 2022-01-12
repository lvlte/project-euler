/**
 * Problem 5 - Smallest multiple
 *
 * @see {@link https://projecteuler.net/problem=5}
 *
 * 2520 is the smallest number that can be divided by each of the numbers from
 * 1 to 10 without any remainder.
 *
 * What is the smallest positive number that is evenly divisible by all of the
 * numbers from 1 to 20?
 */
this.solve = function () {
  const factor = 2*3*5*7*11*13*17*19; // primes below 20.
  let evenlyDivisible = false;
  let n = 0;

  do {
    n += factor;
    for (let i=2; i<=20; i++) {
      if (!(evenlyDivisible = n % i === 0))
        break;
    }
  }
  while (!evenlyDivisible);

  return n;
}

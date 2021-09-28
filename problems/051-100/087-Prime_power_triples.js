/**
 * Problem 87 - Prime power triples
 *
 * @see {@link https://projecteuler.net/problem=87}
 *
 * The smallest number expressible as the sum of a prime square, prime cube, and
 * prime fourth power is 28. In fact, there are exactly four numbers below fifty
 * that can be expressed in such a way:
 *
 *            28 = 2^2 + 2^3 + 2^4
 *            33 = 3^2 + 2^3 + 2^4
 *            49 = 5^2 + 2^3 + 2^4
 *            47 = 2^2 + 3^3 + 2^4
 *
 * How many numbers below fifty million can be expressed as the sum of a prime
 * square, prime cube, and prime fourth power ?
 */

const { nthRoot } = require('../../lib/math');
const { getPrimes } = require('../../lib/prime');

this.solve = function () {
  // Lazy Brute force...

  // First we need to generate some prime numbers. The largest prime to be used,
  // let x that number, is defined such that its square added to the smallest
  // prime cube plus the smallest prime fourth does not exceed the limit :
  //  x^2 + 2^3 + 2^4 < limit, then x < √(limit-24)

  // We apply the same logic to find the maximum prime cube and prime fourth to
  // be used.

  const limit = 50e6;

  const max2 = Math.sqrt(limit-24);
  const max3 = Math.cbrt(limit-20);
  const max4 = nthRoot(limit-12, 4);

  const primes = getPrimes(max2);

  // Then from these primes, build prime squares, cubes, and fourth, that stays
  // below the limit.

  let P2 = primes.map(p => p**2);
  let P3 = [];
  let P4 = [];

  for (let i=0; i<primes.length; i++) {
    const p = primes[i];
    if (p < max4) {
      P3.push(p**3);
      P4.push(p**4);
    }
    else if (p < max3)
      P3.push(p**3);
    else
      break;
  }

  // Now we create triples from the three sets P2, P3 and P4, we don't store
  // them, but only the corresponding number yielded by addition.

  let numbers = new Set(); // we want only distinct numbers.

  for (let i=0; i<P2.length; i++) {
    for (let j=0; j<P3.length; j++) {
      const _n = P2[i] + P3[j];
      if (_n > limit)
        break;
      for (let k=0; k<P4.length; k++) {
        const n = _n + P4[k];
        if (n > limit)
          break;
        numbers.add(n);
      }
    }
  }

  return numbers.size;
}

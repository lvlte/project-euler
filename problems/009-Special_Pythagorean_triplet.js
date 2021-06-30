/**
 * Problem 9 - Special Pythagorean triplet
 *
 * @see {@link https://projecteuler.net/problem=9}
 *
 * A Pythagorean triplet is a set of three natural numbers, a < b < c, for
 * which
 *
 *    a² + b² = c²
 *
 * For example, 32 + 42 = 9 + 16 = 25 = 52.
 *
 * There exists exactly one Pythagorean triplet for which a + b + c = 1000.
 * Find the product abc.
 */

const { divisors } = require('../lib/utils.js');

this.solve = function () {
  // @see Euclid's m,n formula

  // Any two positive integers m > n for which (m²–n²)² + (2mn)² = (m²+n²)²
  // corresponds to a pythagorean triples abc :
  //  a = m² – n²
  //  b = 2mn
  //  c = m² + n²

  // We need to find a triple given the perimeter of the corresponding triangle,
  // that is, a + b + c = p, which translates to :
  //  m²–n² + 2mn + m²+n² = p
  //  2m² + 2mn = p
  //  m(m+n) = p/2

  // Actually we don't need to generate triples, since we are told that "there
  // exists exactly one triplet for which a + b + c = 1000", we just need to
  // find for which m,n the product m*(m+n) yields 500, with m > n and n > 0.

  // By pairing the divisors of 500, excluding 1, we have our m,n candidates :
  // divisors(500) -> [2, 4, 5, 10, 20, 25, 50, 100, 125, 250]
  //  pn = m *  x  = m * (m +  n ) with m+n > m and m > n
  //  p1 = 2 * 250 = 2 * (2 + 148) -> doesn't match, n is greater than m
  //  p2 = 4 * 125 = 4 * (4 + 121) -> same here
  //  ...

  // Once we got a matching m,n we can stop and directly compute a,b,c as we
  // know there is only one triple to find.

  const p = 1000;
  const div = divisors(p/2).sort((a, b) => a - b).slice(1);

  let a,b,c;

  for (let i=0; i<div.length/2; i++) {
    const [m, x] = [div[i], div[div.length-1-i]];
    const n = x - m;
    if (m > n) {
      [a, b, c] = [m**2-n**2, 2*m*n, m**2+n**2];
      break;
    }
  }

  return a*b*c;
}

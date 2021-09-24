/**
 * Provides functions related to triangles.
 *
 * @file triangle.js
 * @module lib/triangle.js
 * @author Eric Lavault {@link https://github.com/lvlte}
 * @license MIT
 */

const { cantorPairing, sum, remZero, quadratic } = require('./math');
const { coprime } = require('./prime');

let Triangle;
module.exports = Triangle = {

  /**
   * Maps an ordered pair (x,y) to an integer using Cantor's pairing function
   * value determining primitive Pythagorean triples, or 0 if there is no such
   * triple.
   *
   * For every ordered pair (x,y) such that 0 < x < y, x and y coprime and not
   * both odd, there exists a primitive Pythagorean triple (a, b, c) such that
   * a = y^2-x^2, b = 2xy, c = x^2+y^2.
   *
   * @see {@link https://oeis.org/A278147}
   *
   * @param {number} y
   * @param {number} x
   * @returns {number}
   */
  T(y, x) {
    if (x >= y || x < 1 || remZero(x+y, 2) || !coprime(x, y))
      return 0;
    return cantorPairing(x, y);
  },

  /**
   * Returns Primitive Pythagorean Triples (a, b, c) such that a < b < c.
   *
   * A `limit` must be set for the internal loop to complete.
   *
   * PPTs are not generated in a specific order, but can optionally be indexed
   * using T/Cantor pairing function in which case an object is returned instead
   * of an array.
   *
   * @param {number} [limit] Limit for generating (m,n) pairs.
   * @param {boolean} [index=false] Whether or not to index triples by T(m,n).
   * @param {function} [predicate=false] Can be used to filter PPTs.
   * @return {(array|Object)}
   *
   * @see {@link https://en.wikipedia.org/wiki/Pythagorean_triple}
   * @see {@link https://oeis.org/A277557}
   */
  PPT(limit, index=false, predicate=false) {
    // Generate m,n pairs corresponding to a triangle and use Euclid's formula
    // to retrieve the value of a, b, and c.
    let PPTs = index ? {} : [];
    const check = typeof predicate == 'function' ? predicate : () => true;
    const append = index ? (abc, T) => PPTs[T] = abc : (abc) => PPTs.push(abc);
    for (let n=1; n<limit; n++) {
      for (let m=n+1; m<limit; m++) {
        const t = Triangle.T(m, n);
        if (t > 0) {
          const [a, b, c] = [m**2-n**2, 2*m*n, m**2+n**2];
          check(a,b,c) && append(a < b ? [a, b, c] : [b, a, c], t);
        }
      }
    }
    return PPTs;
  },

  /**
   * Returns the N first primitive Pythagorean triples (a, b, c) ordered by
   * increasing c, and such that a < b < c.
   *
   * @param {number} [N=10]
   * @return {array}
   */
  PPTn(N=10) {
    // An aproximative value for c (the hypotenuse) is given by :
    //  a(n) ~ 2*Pi*n   @see https://oeis.org/A020882
    // Sorting by c = m²+n², and given N, we can set a limit x for m and n such
    // that 1²+x² = a(N) <=> x = sqrt(2*Pi*N-1)
    const limit = Math.ceil(Math.sqrt(2*Math.PI*N-1));
    return Triangle.PPT(limit).sort((a, b) => a[2]-b[2]).slice(0, N);
  },

  /**
   * Returns Pythagorean triples (a, b, c) for which a < b < c <= cMax.
   *
   * If `primitive` is true, then returns only primitive pythagorean triples.
   *
   * If `ordered` is true, then triples are ordered by increasing value of c,
   * the hypotenuse.
   *
   * If `indexed` is true, then returns an object with the value of c as key,
   * and the corresponding triple(s) (array of triples) as value, otherwise
   * returns an array of triples.
   *
   * @param {number} [cMax=300] The maximum value for c.
   * @param {boolean} [ordered=false] Whether or not to sort triples by c.
   * @param {boolean} [indexed=false] Whether or not to index triples by c.
   * @return {(array|Object)}
   */
  PTc(cMax=300, primitive=false, ordered=false, indexed=false) {
    // Given cMax and knowing that c = m²+n², with m > n, we can work out upper
    // bounds for m,n.

    // For n, we use the minimum value of m, relatively to n which is n+1 :
    //  (n+1)²+n² <= cMax, then we got the quadratic 2n² + 2n + 1 - cMax <= 0
    const [,nMax] = quadratic(2, 2, 1-cMax);

    // For m, we will need the actual value of n :
    //  m²+n² <= cMax, then mMax = ⌊√(cMax-n²)⌋  (resolved in m,n loop below)

    let PPTs = indexed ? {} : [];

    // Helper for collecting one or more triples from a primitive [a,b,c].
    const collect = primitive ? (a, b, c) => append(a, b, c) : (a, b, c) => {
      append(a, b, c);
      let m = 1;
      while (++m) {
        const [_a, _b, _c] = [a*m, b*m, c*m];
        if (_c > cMax)
          break;
        append(_a, _b, _c);
      }
    }

    // Helper for collecting one triple.
    const append = !indexed ? (a, b, c) => PPTs.push([a, b, c]) : (a, b, c) => {
      if (!(c in PPTs))
        PPTs[c] = [];
      PPTs[c].push([a, b, c]);
    }

    for (let n=1; n<=nMax; n++) {
      const mMax = Math.sqrt(cMax-n**2);
      const n2 = n*n;
      for (let m=n+1; m<=mMax; m++) {
        const t = Triangle.T(m, n);
        if (t > 0) {
          const [a, b, c] = [m*m-n2, 2*m*n, m*m+n2];
          a < b ? collect(a, b, c) : collect(b, a, c);
        }
      }
    }

    if (ordered === true && indexed === false)
      return PPTs.sort((a, b) => a[2]-b[2]);

    return PPTs;
  },

  PTp(pMax=300, primitive=false, ordered=false, indexed=false) {
    // Given pMax and knowing that the perimeter p = m²–n² + 2mn + m²+n², with
    // m > n, we can work out upper bounds for m,n.

    // For n, we use the minimum value of m relatively to n, which is n+1 :
    //  p = 2m² + 2mn
    //  p = 2(n+1)² + 2n(n+1)
    //  p = 2n²+4n+2 + 2n²+2n
    //  4n² + 6n + 2 - pMax <= 0
    const [,nMax] = quadratic(4, 6, 2-pMax);

    // For m, we will need the actual value of n, for each value we also obtain
    // a quadratic (resolved in the m,n loop below) of the form :
    //  2m² + 2nm - pMax <= 0

    let PPTs = indexed ? {} : [];

    // Helper for collecting one or more triples from a primitive [a,b,c].
    const collect = primitive ? (a, b, c) => append(a, b, c) : (a, b, c) => {
      append(a, b, c);
      let m = 1;
      while (++m) {
        const [_a, _b, _c] = [a*m, b*m, c*m];
        if (_a+_b+_c > pMax)
          break;
        append(_a, _b, _c);
      }
    }

    // Helper for collecting one triple.
    const append = !indexed ? (a, b, c) => PPTs.push([a, b, c]) : (a, b, c) => {
      const p = a+b+c;
      if (!(p in PPTs))
        PPTs[p] = [];
      PPTs[p].push([a, b, c]);
    }

    for (let n=1; n<=nMax; n++) {
      const [,mMax] = quadratic(2, 2*n, -pMax);
      const n2 = n*n;
      for (let m=n+1; m<=mMax; m++) {
        const t = Triangle.T(m, n);
        if (t > 0) {
          const [a, b, c] = [m*m-n2, 2*m*n, m*m+n2];
          a < b ? collect(a, b, c) : collect(b, a, c);
        }
      }
    }

    if (ordered === true && indexed === false)
      return PPTs.sort((a, b) => sum(a)-sum(b));

    return PPTs;
  }

}

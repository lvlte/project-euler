/**
 * Provides functions related to triangles.
 *
 * @file triangle.js
 * @module lib/triangle.js
 * @author Eric Lavault {@link https://github.com/lvlte}
 * @license MIT
 */

const { cantorPairing, sum, remZero } = require('./math');
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
    // An aproximative value for c (the hypothenuse) is given by :
    //  a(n) ~ 2*Pi*n   @see https://oeis.org/A020882
    // Sorting by c = m²+n², and given N, we can set a limit x for m and n such
    // that 1²+x² = a(N) <=> x = sqrt(2*Pi*N-1)
    const limit = Math.ceil(Math.sqrt(2*Math.PI*N-1));
    return Triangle.PPT(limit).sort((a, b) => a[2]-b[2]).slice(0, N);
  },

  /**
   * Returns primitive Pythagorean triples (a, b, c) for which a < b < c <= cMax
   * optionally ordered by increasing c.
   *
   * @param {number} [cMax=300]
   * @param {boolean} [ordered=false]
   * @return {array}
   */
  PPTc(cMax=300, ordered=false) {
    // Given cMax and knowing that c = m²+n², we got an upped bound x for m,n
    // such that 1+x² = cMax <=> x = sqrt(cMax-1)
    const limit = Math.ceil(Math.sqrt(cMax-1));
    if (ordered === true)
      return Triangle.PPT(limit).sort((a, b) => a[2]-b[2]);
    Triangle.PPT(limit);
  },

  /**
   * Returns primitive Pythagorean triples (a, b, c), such that a < b < c and
   * a + b + c <= pMax, optionally ordered by increasing perimeter.
   *
   * @param {number} [pMax=1000]
   * @param {boolean} [ordered=false]
   * @return {array}
   */
  PPTp(pMax=1000, ordered=false, indexed=false) {
    // Perimeter p = m²–n² + 2mn + m²+n²
    //           p = 2m² + 2mn
    // Given pMax we can set a limit x for m,n such that pMax = 2*x² + 2*x*1,
    // then we can express x in terms of pMax :
    //  2x² + 2x = pMax
    //         x = 1/2 (sqrt(2*pMax + 1) - 1)
    const limit = Math.ceil((Math.sqrt(2*pMax+1)-1)/2);
    const predicate = (a, b, c) => a+b+c <= pMax;
    if (ordered === true)
      return Triangle.PPT(limit, indexed, predicate).sort((a, b) => sum(a)-sum(b));
    return Triangle.PPT(limit, indexed, predicate);
  }

}

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
   * Maps an ordered pair (x,y) such that 0 < x < y to an integer using Cantor's
   * pairing function value determining primitive Pythagorean triples, or 0 if
   * there is no such triple.
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
   * Returns Pythagorean triples (a, b, c) for which a < b < c <= `cMax`.
   *
   * If `primitive` is `true`, then returns only primitive pythagorean triples.
   *
   * If `ordered` is `true`, then triples are ordered by increasing value of c,
   * the hypotenuse.
   *
   * If `ordered` is `true`, then triples are ordered by increasing value of c,
   * the hypotenuse, then b if hypotenuses coincide. Otherwise `ordered` will
   * be considered as `false` (default), meaning no specific order is applied.
   *
   * If `indexed` is `true`, then returns an object with the value of c as key,
   * and the corresponding triple(s) (array of triples) as value, in this case
   * `ordered` is omitted. Otherwise returns an array of triples.
   *
   * @param {number} [cMax=300] The maximum value for c.
   * @param {boolean} [primitive=false] Whether or not to return only primitive.
   * @param {boolean} [ordered=false] Whether or not to sort triples by c.
   * @param {boolean} [indexed=false] Whether or not to index triples by c.
   * @return {(array|Object)}
   */
  PTc(cMax=300, primitive=false, ordered=false, indexed=false) {
    // Generate m,n pairs corresponding to a triangle and use Euclid's formula
    // to retrieve the value of a, b, and c.

    // Given cMax and knowing that c = m²+n², with m > n, we can work out upper
    // bounds for m,n.

    // For n, we use the minimum value of m, relatively to n which is n+1 :
    //  (n+1)²+n² <= cMax, then we got the quadratic 2n² + 2n + 1 - cMax <= 0
    const [,nMax] = quadratic(2, 2, 1-cMax);

    // For m, we will need the actual value of n :
    //  m²+n² <= cMax, then mMax = ⌊√(cMax-n²)⌋  (resolved in m,n loop below)

    let triples = indexed ? {} : [];

    // Helper for collecting one or more triples from a primitive [a,b,c].
    const collect = primitive ? (a,b,c) => append(a,b,c) : (a,b,c) => {
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
    const append = !indexed ? (a,b,c) => triples.push([a,b,c]) : (a,b,c) => {
      if (!(c in triples))
        triples[c] = [];
      triples[c].push([a, b, c]);
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
      return triples.sort((a, b) => {
        const diff = a[2]-b[2];
        if (diff == 0)
          return a[1]-b[1];
        return diff;
      });

    return triples;
  },

  /**
   * All primitive Pythagorean triples can be generated from the (3, 4, 5)
   * triangle by using the linear transformations T1, T2, T3 below. Each one of
   * them has exactly three children, that is, one from each transformations or
   * branches (Berggren, B. (1934), "Pytagoreiska trianglar").
   */
  PPTChildT1 (a, b, c) {
    return [a - 2*b + 2*c, 2*a - b + 2*c, 2*a - 2*b + 3*c];
  },
  PPTChildT2 (a, b, c) {
    return [a + 2*b + 2*c, 2*a + b + 2*c, 2*a + 2*b + 3*c];
  },
  PPTChildT3 (a, b, c) {
    return [-a + 2*b + 2*c, -2*a + b + 2*c, -2*a + 2*b + 3*c];
  },

  /**
   * Returns all primitive pythagorean triples (a, b, c) such that c <= cMax.
   *
   * This function leverages the Berggren relationships (parent/child) and uses
   * recursion, meaning for big values (cMax > ~10^8) it may reach the max call
   * stack size and `PTc(cMax, true)` should be prefered (nb. the non-recursive
   * version of this function is slower than `PTc(cMax, true)`).
   *
   * @param {number} [cMax=100] hypotenuse maximum length
   * @return {array}
   */
  PPTc(cMax = 100) {
    let ppt = [];

    // Collect a, b, c and its children recursively
    function collect (a, b, c) {
      if (c > cMax)
        return;
      ppt.push([a, b, c]);
      collect(...Triangle.PPTChildT1(a, b, c));
      collect(...Triangle.PPTChildT2(a, b, c));
      collect(...Triangle.PPTChildT3(a, b, c));
    }

    // Starting from the root (3, 4, 5).
    collect(3, 4, 5);

    return ppt;
  },

  /**
   * Returns Pythagorean triples (a, b, c) for which the perimeter p is smaller
   * or equal to `pMax`.
   *
   * If `primitive` is `true`, then returns only primitive pythagorean triples.
   *
   * If `ordered` is `true`, then triples are ordered by increasing value of p,
   * and if perimeters coincide then increasing order of hypotenuse.
   *
   * If `indexed` is `true`, then returns an object with the value of p as key,
   * and the corresponding triple(s) (array of triples) as value, otherwise
   * returns an array of triples.
   *
   * @param {number} [pMax=300] Maximum perimeter.
   * @param {boolean} [primitive=false] Whether or not to return only primitive.
   * @param {boolean} [ordered=false] Whether or not to sort triples by p.
   * @param {boolean} [indexed=false] Whether or not to index triples by p.
   * @return {(array|Object)}
   */
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

    let triples = indexed ? {} : [];

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
    const append = !indexed ? (a, b, c) => triples.push([a, b, c]) : (a, b, c) => {
      const p = a+b+c;
      if (!(p in triples))
        triples[p] = [];
      triples[p].push([a, b, c]);
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
      return triples.sort((a, b) => {
        const diff = sum(a)-sum(b);
        if (diff == 0)
          return a[2]-b[2];
        return diff;
      });

    return triples;
  }

}

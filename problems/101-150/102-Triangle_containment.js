/**
 * Problem 102 - Triangle containment
 *
 * @see {@link https://projecteuler.net/problem=102}
 *
 * Three distinct points are plotted at random on a Cartesian plane, for which
 * -1000 ≤ x, y ≤ 1000, such that a triangle is formed.
 *
 * Consider the following two triangles:
 *
 *                    A(-340,495), B(-153,-910), C(835,-947)
 *                    X(-175, 41), Y(-421,-714), Z(574,-645)
 *
 * It can be verified that triangle ABC contains the origin, whereas triangle
 * XYZ does not.
 *
 * Using p102_triangles.txt, a 27K text file containing the co-ordinates of one
 * thousand "random" triangles, find the number of triangles for which the
 * interior contains the origin.
 *
 * NOTE: The first two examples in the file represent the triangles in the
 * example given above.
 */

const { area } = require('../../lib/triangle');
const { load } = require('../../lib/utils');
const triangles = load('p102_triangles.txt').map(l => l.split(',').map(Number));

this.solve = function () {
  // In order to determine if a point P is contained within a triangle ABC, we
  // can check the areas of the 3 triangles formed by joining A, B, C and P :
  // -> If P is inside ABC, then their sum must be equal to the area of ABC.
  // Otherwise the sum will be greater.

  // This is easy to see on paper by drawing ABC and arbitrary points inside and
  // outside the triangle : when P is inside, ABP, BCP, and CAP form 3 disjoints
  // subsets of ABC, whereas when P is outside, the three triangles overlap each
  // other and their union forms a shape with an area that is greater than that
  // of ABC.

  // Mathematically speaking, we need to determine for a given triangle if the
  // origin is a "barycentric coordinate" of the plane formed by that triangle.

  // In this context, barycentric coordinates are also called areal coordinates,
  // because the coordinates of P with respect to triangle ABC are equivalent to
  // the signed ratios of the areas of ABP, BCP, and CAP, to the area of ABC.
  // @see https://en.wikipedia.org/wiki/Barycentric_coordinate_system#Barycentric_coordinates_on_triangles

  // In other words, we can use them to express the position of P with respect
  // to ABC. To do that, we write P as a unique convex combination of the three
  // vertices A, B and C (assuming P is inside the triangle) :
  //
  //  P = uA + vB + wC
  //
  //  where u, v, and w are three real numbers such that : u + v + w = 1.
  //
  // -> The point P is within the triangle (A, B, C) iff 0 ≤ u,v,w ≤ 1.

  // So we just need to compute these areal coordinates and check if the convex
  // combination equation holds. We don't care about the sign of the ratios here
  // as the involved vertices are laid out on the cartesian plane (ie. not in an
  // Euclidean space) and the orientation of the triangles does not matter. So
  // given A(T), the area of a triangle T, we define u, v, and w as follows :
  //
  //  u = A(CAP) / A(ABC)
  //  v = A(ABP) / A(ABC)
  //  w = A(BCP) / A(ABC)
  //
  // -> P is within the triangle (A, B, C) iff 0 ≤ u,v,w ≤ 1 and w = 1 - u - v.

  function containsOrigin(x1, y1, x2, y2, x3, y3) {
    const [A, B, C] = [ [x1, y1], [x2, y2], [x3, y3] ];
    const aref = area(A, B, C);
    const P = [0, 0];

    const u = area(C, A, P) / aref;
    if (u > 1)
      return false;

    const v = area(A, B, P) / aref;
    if (v > 1)
      return false;

    const _w = 1 - u - v;
    if (_w < 0)
      return false;

    const w = area(B, C, P) / aref;

    // Prevent floating point rounding discrepancies
    return +(w).toFixed(12) === +(_w).toFixed(12);
  }

  let count = 0;

  for (let i=0; i<triangles.length; i++) {
    if (containsOrigin(...triangles[i]))
      count++;
  }

  return count;
}

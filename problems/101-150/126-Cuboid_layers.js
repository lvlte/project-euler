/**
 * Problem 126 - Cuboid Layers
 *
 * @see {@link https://projecteuler.net/problem=126}
 *
 * The minimum number of cubes to cover every visible face on a cuboid measuring
 * 3×2×1 is 22.
 *
 * If we then add a second layer to this solid it would require 46 cubes to
 * cover every visible face, the third layer would require 78 cubes, and the
 * fourth layer would require 118 cubes to cover every visible face.
 *
 * However, the first layer on a cuboid measuring 5×1×1 also requires 22 cubes;
 * similarly the first layer on cuboids measuring 5×3×1, 7×2×1, and 11×1×1 all
 * contain 46 cubes.
 *
 * We shall define C(n) to represent the number of cuboids that contain n cubes
 * in one of its layers. So,
 *
 *  C(22)  = 2
 *  C(46)  = 4
 *  C(78)  = 5
 *  C(118) = 8
 *
 * It turns out that 154 is the least value of n for which C(n) = 10.
 *
 * Find the least value of n for which C(n) = 1000.
 */

this.solve = function () {
  // Let l, w, h, l ≥ w ≥ h, the 3 integer dimensions of a given cuboid.

  // Adding the first layer requires :
  //
  // -> 2*l*w cubes (top/bottom)
  // -> 2*l*h cubes (front/back)
  // -> 2*w*h cubes (left/right)
  //
  // Which gives 2*(l*w + l*h + w*h) cubes.

  // For every layer after the first, in addition to those 2*(l*w + l*h + w*h)
  // cubes, we will need to :
  //
  //  1. Cover the "steps" left by the previous layer. There are 4*(layer-1)
  //     such steps in each direction or dimension, which gives :
  //
  //     4*(l+w+h)*(L-1) cubes to add up (L is the layer number).
  //
  //  2. Cover the extra voids left at corners (which appear as of layer 3) :
  //
  //     Layer 3 : 1 cube per corner, thats is, 8.
  //     Layer 4 : 1 cube per corner plus 2 cubes per corner, thats is, 8 + 8*2.
  //     Layer 5 : (1+2+3) cubes per corner, thats is, 8*(1+2+3).
  //     ...
  //
  //     Layer L : 8*sum[n=1, L-2](n) = 8*(n(n+1)/2) with n=L-2
  //                                  = 4*(L-2)(L-1)
  //
  // Which gives 4*(l+w+h + L-2)*(L-1) cubes to add up.

  // Returns the number of cubes needed to cover every visible face of a given
  // cuboid when adding layer L.
  function cover(l, w, h, L) {
    let cubes = 2*(l*w + l*h + w*h);
    if (L > 1) {
      cubes += 4*(l+w+h + L-2)*(L-1);
    }
    return cubes;
  }

  // We need to find the least value of n for which C(n) = 1000.
  const Cn = 1000;

  // We need an upper bound for n as we can't computes every possible cuboids,
  // maxN is the maximum number of cubes that will be considered.
  const maxN = 2e4;
  let C = {};

  // In each loop, incrementing the loop's variable amount to increasing n,
  // which is the number of cubes contained for the current layer. Doing this
  // in order with l>=w>=h and then incrementing layers allows to break each
  // loop as early as possible when n reaches the upper bound, so that we can
  // inspect other cuboids (which are not that big, those of interest) faster.
  // It looks a bit ugly though...
  for (let h=1; cover(1, 1, h, 1)<maxN; h++) {
    for (let w=h; cover(1, w, h, 1)<maxN; w++) {
      for (let l=w; cover(l, w, h, 1)<maxN; l++) {
        for (let n=0, layer=1; n<maxN; layer++) {
          n = cover(l, w, h, layer);
          if (!C[n]) {
            C[n] = 0;
          }
          C[n]++;
        }
      }
    }
  }

  const leastN = +Object.entries(C).find(([, value]) => value === Cn)[0];

  return leastN;
}

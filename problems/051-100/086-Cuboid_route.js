/**
 * Problem 86 - Cuboid route
 *
 * @see {@link https://projecteuler.net/problem=86}
 *
 * A spider, S, sits in one corner of a cuboid room, measuring 6 by 5 by 3, and
 * a fly, F, sits in the opposite corner. By travelling on the surfaces of the
 * room the shortest "straight line" distance from S to F is 10 and the path is
 * shown on the diagram.
 *
 * However, there are up to three "shortest" path candidates for any given
 * cuboid and the shortest route doesn't always have integer length.
 *
 * It can be shown that there are exactly 2060 distinct cuboids, ignoring
 * rotations, with integer dimensions, up to a maximum size of M by M by M,
 * for which the shortest route has integer length when M = 100. This is the
 * least value of M for which the number of solutions first exceeds 2000; the
 * number of solutions when M = 99 is 1975.
 *
 * Find the least value of M such that the number of solutions first exceeds
 * one million.
 */

const { PTp } = require('../../lib/triangle');

this.solve = function () {

  // We can vizualize such "straight lines" between S and F using a net :
  //
  //                           +———————————————————+
  //                           |                   |
  //                           |                   |
  //                           |                   |
  //                           |                   |
  //                           |                   |
  //                           |                   |
  //                           +———————————————————+ F
  //                           |                 / |
  //                           |               /   |
  //                    +——————+—————————————/—————+——————+ F'
  //                    |      |           /       | ¸.·´ |
  //                    |      |         /       ¸.·´     |
  //                    |      |       /     ¸.·´  |      |
  //                  y |      |     /   ¸.·´      |      |
  //                    |      |   / ¸.·´          |      |
  //                    |      | /.·´              |      |
  //                    +——————+———————————————————+——————+---------+
  //                         S |                   |   z            ┊
  //                           |                   |                ┊
  //                           +———————————————————+----------------+ F"
  //                                     x                  y

  // We oberve that :
  // - The spider must cross two contiguous faces to reach the opposite corner.
  // - Two contiguous faces of a cuboid lined up on the plane form a rectangle.
  // - The shortest path from S to F is one diagonal of such rectangle.
  // - Then it's also the hypotenuse of a right triangle.
  // - We can form three distinct rectangles (F appears in F, F' and F").
  // - Thus there are three paths or triangles to consider per cuboid.

  // Two of these paths are drawn, the third one (less obvious in the example
  // because of the choice of the net, and impossible to draw with text symbols)
  // is drawn by joining S to F".

  // Given the dimensions of a cuboid, x, y, z, the three path candidates are
  // given by the three right triangles (hypotenuse c) whose legs a,b,c are :
  //   a = x                a = x+z              a = x+y
  //   b = y+z              b = y                b = z
  //   c = √(x²+(y+z)²)     c = √((x+z)²+y²)     c = √((x+y)²+z²)

  // Now, instead of searching for solutions to the shortest path given some
  // cuboids of dimensions x*y*z, counting only those having integer solutions,
  // we can directly generate them, that is, generate pythagorean triples, and
  // get any matching cuboids dimensions from there.

  // Let a, b, c, the legs of a such triple, with a < b < c.
  // Let x, y, z the dimensions of the corresponding cuboids, with x >= y >= z
  // (avoiding duplicates and so that each cuboid xyz can be indexed by M = x).

  // Given a triple a,b,c, we need to consider two cases :

  // 1. When b > 2a : we can't produce cuboids for x = a, but only for x = b,
  //
  //   -> We can't set x = a because we would have y+z > 2x and one of y or z or
  //      both would have to be greater than x, so it can't hold as x >= y >= z.
  //
  //   -> We can set x = b, and y+z = a,
  //
  //        a < b, then x > y+z,
  //
  //        let n the maximum value of z : as z <= y and y = a-z, then n = ⌊a/2⌋
  //
  //        We can then produce the cuboids :    | eg. with (5, 12, 13) :
  //          c0 = (x=b, y=a-1, z=1)             |  c0 = (x=12, y=4, z=1)
  //          c1 = (x=b, y=a-2, z=2)             |  c1 = (x=12, y=3, z=2)
  //            ...                              |
  //          cn = (x=b, y=a-n, z=n)             |
  //
  //        There are n=⌊a/2⌋ such cuboids of rank M = x = b

  // 2. When b <= 2a : we can produce cuboids for x = a, and for x = b,
  //
  //   -> We can set x = a, and y+z = b, (3, 4, 5), (8, 15, 17)
  //       then since y <= x, y+z <= x+z, or b <= a+z, and z >= b-a.
  //
  //       let z0 the mininmum value of z : z0 = b-a,
  //       let z1 = z0+1, z2 = z0+2, etc.
  //       let zn the maximum value of z, as z <= y, zn <= b-zn, zn = ⌊b/2⌋,
  //
  //       We can then produce the cuboids :    | eg. with (3, 4, 5) :
  //         c0 = (x=a, y=b-z0, z=z0)           |  c0 = (x=3, y=3, z=1)
  //         c1 = (x=a, y=b-z1, z=z1)           |  c1 = (x=3, y=2, z=2)
  //           ...                              |
  //         cn = (x=a, y=b-zn, z=zn)           |
  //
  //       There are zn+1-z0 = ⌊b/2⌋+1-(b-a) such cuboids of rank M = x = a
  //
  //   -> We can also set x = b, and y+z = a, exactly as described above.
  //
  //       There are n=⌊a/2⌋ such cuboids of rank M = x = b
  //
  //       eg. with (3, 4, 5), we would obtain ⌊3/2⌋ = 1 cuboid :
  //         c0 = (x=4, y=2, z=1)

  // Then, since we are asked to find the least value of M, the problem is to
  // produce these cuboids in increasing order of M, which is not an easy task
  // starting with a set of pythagorean triples, and no disposable heap.

  // First, we will assume that the required number of solutions can be reached
  // using triples having a perimeter less than or equal to pMax.
  const pMax = 10_000;

  // Then, having a finite set of triangles we can now sort them. The thing is
  // that for some, M will take the value of b, but for the others, M will take
  // both the value of a and b. So should we sort them by increasing a or b ?

  // Well, we can do both, sorting by the minmimum value M can take : if M can
  // take the value of a and b (when b <= 2a), then we consider the value of a,
  // otherwise we consider the value of b.
  const compare = ([a1,b1,], [a2,b2,]) => {
    let x1 = b1 <= 2*a1 ? a1 : b1;
    let x2 = b2 <= 2*a2 ? a2 : b2;
    return x1-x2;
  };

  // Let's generate and sort all pythagorean triples with perimeter < pMax.
  const triples = PTp(pMax, false, false).sort(compare);

  // But we still have the issue of producing solutions with M growing by both
  // a and b while iterating the triples, so how to properly count the actual
  // number of solutions for M ?

  // First, we need to keep track of the actual count of cuboids for M :
  //  cuboids = { M : number of solutions for M = x >= y >= z },
  let cuboids = {};

  // Secondly, we also count separately the solutions made with M=a and those
  // made with M=b. We can then consider the number of solutions made with M=a
  // an absolute minimum, since a < b and the values of `a` in this context are
  // strictly increasing. When that minimum reaches the target number, we know
  // we can stop the process and use our cuboids object to get the actual number
  // of solutions by increasing values of M.

  // Returns the number of cuboids of rank M=a made from the given triple a,b,c,
  // and actualize the total number of cuboids of that rank.
  const cubAFromT = (a, b, c) => {
    const n = Math.floor(b/2)+1-b+a;
    cuboids[a] = (cuboids[a] || 0) + n;
    return n;
  };

  // Returns the number of cuboids of rank M=b made from the given triple a,b,c,
  // and actualize the total number of cuboids of that rank.
  const cubBFromT = (a, b, c) => {
    const n = Math.floor(a/2);
    cuboids[b] = (cuboids[b] || 0) + n;
    return n;
  };

  // Though, we can be more efficient using simple heuristics.

  // Let Ma the ordered set of solutions made with M=a, ranked by M.
  // Let Mb the ordered set of solutions made with M=b, ranked by M.

  // An hypothesis we can make by observation is that when counting all cuboids
  // that can be made from a set of triples sorted exactly as we did :
  // - Eventually there are always more than twice as many solutions from Mb
  //   as from Ma. In other words, when the length of Ma reaches N, the length
  //   of Mb is greater than 2N.
  // - At any point, the maximum rank M of the lower half of the solutions from
  //   Mb has been caught up by the actual value of `a` at that point.
  // - Then, when the length of Ma reaches half the target number of solutions,
  //   the lower half of Mb, of rank M <= a (won't change anymore), contains
  //   actually the other half or a bit more of the solutions of rank M <= a.

  // This means we can set a specific target for the number of cuboids made with
  // values of M taken from a, which is just the actual target divided by two.

  const target = 1_000_000;
  const targetA = target/2;

  // Number of cuboids made with M taking `a` values only (when a >= b/2).
  let cubA = 0;

  // Iterate triples until cubA reaches half the target.
  let reached = false;
  for (let i=0; i<triples.length; i++) {
    const [a, b, c] = triples[i];
    if (b <= 2*a) {
      cubA += cubAFromT(a, b, c);
      if (cubA > targetA) {
        reached = true;
        break;
      }
    }
    cubBFromT(a, b, c);
  }

  // Once `targetA` is reached, we just have to (re)count the actual number of
  // solutions by increasing order of M and find the least value of M such that
  // the number of solutions first exceeds `target` (we take advantage of the
  // natural index ordering of js objects).

  // If `cubA` doesn't reach its target, it means we need more triples so we
  // would just increase `pMax` until it does.
  if (!reached)
    return console.log('Need to increase pMax');

  let solutions = 0;
  let M;
  for (let m in cuboids) {
    solutions += cuboids[m];
    if (solutions > target) {
      M = +m;
      break;
    }
  }

  return M;
}

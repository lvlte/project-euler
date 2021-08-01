/**
 * Problem 68 - Magic 5-gon ring
 *
 * @see {@link https://projecteuler.net/problem=68}
 *
 * Consider the following "magic" 3-gon ring, filled with the numbers 1 to 6,
 * and each line adding to nine.
 *
 *                                4
 *                                 \
 *                                  3
 *                                 / \
 *                                1 — 2 — 6
 *                               /
 *                              5
 *
 * Working clockwise, and starting from the group of three with the numerically
 * lowest external node (4,3,2 in this example), each solution can be described
 * uniquely. For example, the above solution can be described by the set:
 *
 *          4,3,2; 6,2,1; 5,1,3.
 *
 * It is possible to complete the ring with four different totals: 9, 10, 11,
 * and 12. There are eight solutions in total.
 *
 *    Total	      Solution Set
 *       9	      4,2,3; 5,3,1; 6,1,2
 *       9	      4,3,2; 6,2,1; 5,1,3
 *      10	      2,3,5; 4,5,1; 6,1,3
 *      10	      2,5,3; 6,3,1; 4,1,5
 *      11	      1,4,6; 3,6,2; 5,2,4
 *      11	      1,6,4; 5,4,2; 3,2,6
 *      12	      1,5,6; 2,6,4; 3,4,5
 *      12	      1,6,5; 3,5,4; 2,4,6
 *
 * By concatenating each group it is possible to form 9-digit strings; the
 * maximum string for a 3-gon ring is 432621513.
 *
 * Using the numbers 1 to 10, and depending on arrangements, it is possible to
 * form 16- and 17-digit strings. What is the maximum 16-digit string for a
 * "magic" 5-gon ring?
 */

const { permute } = require('../../lib/combinatorics');
const { range } = require('../../lib/utils');

this.solve = function () {
  // There are 5 external nodes and 5 inner nodes. Each group (line) is made up
  // of 1 outer node and 2 inner nodes, and each solution contains 5 groups,
  // where the outer nodes are used once and the inner nodes twice.

  // We are searching for the maximum 16-digit string, and we know that the 1st
  // digit of such string corresponds to the 5-gon ring's lowest external node.

  // Since we are searching for a 16-digits string, the 10 has to be used only
  // once, and thus must lie along the outer nodes.

  // So let's assume the maximized string for a 5-gon corresponds to the two
  // disjoint subsets of length 5 made from the set of numbers 1 to 5*2 :
  //  S1 = {6,7,8,9,10}   -> outer nodes
  //  S2 = {1,2,3,4,5}    -> inner nodes

  // In the best configuration, the lowest outer node would be 6.

  // We will reduce the representation of an n-gon solution to the arrangement
  // of its numbers on the ring, eg. the 3-gon solution 4,3,2; 6,2,1; 5,1,3;
  // corresponds to the permutation [4,6,5,3,2,1] where the first number is the
  // lowest outer node, the next two are the next outer nodes going clockwise,
  // and, similarly, the next 3 numbers are the 3 inner nodes.

  // Picturing the 5-gon indexes :
  //
  //                            0
  //                             \
  //                              0     1
  //                            /   \  /
  //                          4       1
  //                        /  \     /
  //                      4     3 — 2 — 2
  //                             \
  //                              3

  // Outer and inner nodes are indexed separately so that given any index i in
  // range [0, 4], we can form any group of number a,b,c lying on the same line.
  //  -> a is the outer node at index i.
  //  -> b is the inner node at index i.
  //  -> c is the inner node at index (i+1)%5.

  // Now, we need to produce some permutations : there are 5*2=10 numbers to be
  // placed on a 5-gon ring, but instead of considering the whole set, since we
  // already identified which are the outer/inner nodes, we can consider S1 and
  // S2 separately, and combine their permutation (eg. with the 3-gon above the
  // permutation [4,6,5,3,2,1] corresponds to [4,6,5] paired with [3,2,1]).

  // So we will have 2 times 5! = 240 permutations to produce, and then after
  // pairing each with each, 120*120 = 14 400 permutations to check.

  // Actually, the lowest outer node being 6, the number of permutations can be
  // reduced to 4! = 24 for S1, so we got only 144 to create in total and thus,
  // once combined, only 120*24 = 2880 permutations to check.

  // Considering the whole set we would have had 10! = 3 628 800 permutations !

  const nGon = 5; // the logic actually works for 3, 5, 7, ...

  const lowest = nGon+1;
  const S1 = range(lowest+1, 2*nGon+1);
  const S2 = range(1, lowest);

  const P1 = permute(S1);
  const P2 = permute(S2);

  // Check whether or not the given ring is "magic", having all of its group or
  // line summing to the same total. Returns the string representation of the
  // ring if magic, false otherwise.
  const checkRing = (outer, inner) => {
    const sum = outer[0] + inner[0] + inner[1];
    let str = '' + outer[0] + inner[0] + inner[1];
    for (let i=1; i<nGon; i++) {
      const [a, b, c] = [ outer[i], inner[i], inner[(i+1)%nGon] ];
      if (a+b+c != sum)
        return false;
      str += ''+a+b+c;
    }
    return str;
  };

  // Combine permutations from P1 and P2 and check for solutions
  let solutions = [];
  let max = 0n;
  for (let i=0; i<P1.length; i++) {
    const outer = [lowest, ...P1[i]];
    for (let j=0; j<P2.length; j++) {
      let ring = checkRing(outer, P2[j]);
      if (!ring)
        continue;
      ring = BigInt(ring);
      solutions.push(ring);
      if (ring > max)
        max = ring;
    }
  }

  // console.log(solutions);

  return max;
}

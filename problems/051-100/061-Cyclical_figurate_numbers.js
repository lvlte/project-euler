/**
 * Problem 61 - Cyclical figurate numbers
 *
 * @see {@link https://projecteuler.net/problem=61}
 *
 * [...]
 *
 * The ordered set of three 4-digit numbers: 8128, 2882, 8281, has three
 * interesting properties.
 *
 *  - The set is cyclic, in that the last two digits of each number is the first
 *    two digits of the next number (including the last number with the first).
 *  - Each polygonal type: triangle (P3,127=8128), square (P4,91=8281), and
 *    pentagonal (P5,44=2882), is represented by a different number in the set.
 *  - This is the only set of 4-digit numbers with this property.
 *
 * Find the sum of the only ordered set of six cyclic 4-digit numbers for which
 * each polygonal type: triangle, square, pentagonal, hexagonal, heptagonal, and
 * octagonal, is represented by a different number in the set.
 */

const { triangular, pentagonal, hexagonal, heptagonal, octagonal } = require('../../lib/math');
const { triangRev, pentaRev, hexaRev, heptaRev, octaRev } = require('../../lib/math');
const { range } = require('../../lib/utils');
const { sum } = require('../../lib/math');

this.solve = function () {
  // There are fewer polygonals in a given range as we increase the polygon size
  // so we will start by taking octagonals which are fewer.

  // Let's call `prefix` the first two digits of a given number and `suffix` the
  // last two.

  // What we need is to link each octagonal having its suffix that matches the
  // prefix of another polygonal from a different set with that polygonal, thus
  // creating pairs.

  // By recursion, we will pair any existing pair with another matching number
  // from different set, creating triples. The process continues, discarding
  // invalid candidates or appending polygonals to the set until it reaches six
  // members.

  // First we need to create 4-digits polygonals...

  const min = 10**(3);
  const max = 10**(4)-1;

  // Map n-gonals to their respective functions.
  const nGonMap = [
    [3, triangular, triangRev],
    [4, n => n*n,   Math.sqrt],
    [5, pentagonal, pentaRev],
    [6, hexagonal,  hexaRev],
    [7, heptagonal, heptaRev],
    [8, octagonal,  octaRev]
  ];

  // Use the callback map to adjust the range of inputs used for the creation
  // of polygonals in order to get 4-digit numbers.
  const polygonals = nGonMap.mapToObj(([n, func, rev]) => {
    const nRange = [ Math.ceil(rev(min)), Math.ceil(rev(max)) ];
    const numbers = range(nRange[0], nRange[1]).map(func);
    return [n, numbers];
  });

  // Takes an octagonal and create ordered set(s) of six polygonals from it.
  function orderedSets(octa) {
    let sets = [];

    // Pair numbers from different polygon recursively until the given `set`
    // contains six members, in which case it is added to `sets`.
    (function recursivePairing(set, missing) {
      if (set.length == 6)
        return sets.push(set);
      const suffix = set.at(-1) % 100;
      for (const nGon of missing) {
        for (let i=0; i<polygonals[nGon].length; i++) {
          const n = polygonals[nGon][i];
          if (set.indexOf(n) !== -1)
            continue; // skip duplicates (ie. an hexagonal number is triangular)
          if ((n - n%100) / 100 != suffix)
            continue;
          let m = new Set(missing);
          m.delete(nGon);
          recursivePairing([...set, n], m);
        }
      }
    })([octa], new Set([7, 6, 5, 4, 3]));

    return sets;
  }

  // Let's create ordered sets, if one of them is cyclic then we can break since
  // we know there is only one such set.

  let octagonals = polygonals[8];
  let cyclicSet = [];

  Search:
  for (let i=0; i<octagonals.length; i++) {
    const n = octagonals[i];
    const sets = orderedSets(n);
    if (!sets.length)
      continue;
    const nPrefix = (n - n%100) / 100;
    for (let j=0; j<sets.length; j++) {
      if (nPrefix == sets[j].at(-1) % 100) {
        cyclicSet = sets[j];
        break Search;
      }
    }
  }

  // console.log(cyclicSet);

  return sum(cyclicSet);
}

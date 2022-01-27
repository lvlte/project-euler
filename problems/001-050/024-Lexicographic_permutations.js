/**
 * Problem 24 - Lexicographic permutations
 *
 * @see {@link https://projecteuler.net/problem=24}
 *
 * A permutation is an ordered arrangement of objects. For example, 3124 is one
 * possible permutation of the digits 1, 2, 3 and 4. If all of the permutations
 * are listed numerically or alphabetically, we call it lexicographic order.
 *
 * The lexicographic permutations of 0, 1 and 2 are:
 *
 *      012   021   102   120   201   210
 *
 * What is the millionth lexicographic permutation of the digits 0, 1, 2, 3, 4,
 * 5, 6, 7, 8 and 9?
 */

const { range } = require('../../lib/utils');
const { mfact } = require('../../lib/math');
const { permute, lehmerCode } = require('../../lib/combinatorics');

this.solve = function () {

  // Let's say we want the hundredth lexicographic permutation of the digits
  // {0, 1, 2, 3, 4}.

  // So we got a set S of length n = 5, made with the digits 0 to n-1, and we
  // would like P[n], a lexicographically sorted array of permutations of these
  // digits (actually the key is to avoid having to generate and sort all the
  // permutations, so we will just refer to P[n] as if it already exists).

  // We know a set of n elements has p(n) permutations, with p(n) = n * p(n-1).
  //  n = 1   p(n) = 1
  //  n = 2   p(n) = 2
  //  n = 3   p(n) = 6
  //  n = 4   p(n) = 24
  //  n = 5   p(n) = 120

  // Let's imagine how the first elements of P[5] would look like once sorted.
  // Obviously they begin with digit 0, 1, etc. but what's important to note is
  // that P[5] actually contains 5*p(4) = 5*24 permutations, and each group of
  // 24 begins respectively with digit 0 for the first group, 1 for the second,
  // etc.

  // With that in mind, we deduce that the hundredth permutations is part of the
  // fifth group, as ⌈100/24⌉ = 5, which means its first digit is a 4, so we can
  // now remove the 4 from S and work with smaller (sub-group) permutations.

  // Then, we got 100 % 24 = 4, so we want the fourth permutation of the set S.
  // We apply the same logic for n=4 :
  //  p(4) = 4*p(3) = 4*6, so we got 4 group of 6 permutations, and the fourth
  //  one is in the first group, as ⌈4/6⌉ = 1, which means its first digit is 0
  //  and we can remove 0 from S.

  // Now we've got the first two digits {4, 0}, and S = {1, 2, 3}. We continue
  // with 4 % 6 = 4, the fourth permutation of S elements, with n=3 :
  //  p(3) = 3*p(2) = 3*2, we got 3 group of 2 permutations and the fourth one
  //  is in the second group which means the next digit is 2.

  // We are left with S = {1, 3}, n=2. As 4 % 2 = 0, we consider the nth group
  // of permutations so we take the second digit, which is 3, and thus the last
  // one is 1.

  // So the hundredth lexicographic permutation of the digits {0, 1, 2, 3, 4}
  // is {4, 0, 2, 3, 1}.

  // p(n) returns the number of permutations we can make with n elements.
  const p = mfact;

  const S = new Set(range(10));
  const perm = [];
  let pos = 10**6;

  while (S.size > 0) {
    const pn = p(S.size-1);
    const group = Math.ceil(pos / pn);
    const digit = [...S][group-1];
    perm.push(digit);
    S.delete(digit);
    pos = pos % pn || S.size;
  }

  return +perm.join('');
}


this.solve2 = function () {
  // My first attempt was to generate all the permutations and index them on the
  // fly using Lehmer code. Indexing is fast but still, having to generate all
  // the permutations is not efficient.

  const set = range(10);
  const pos = 10**6;

  const p = permute(set);

  // Use Lehmer code to index permutations.
  let orderedP = Array(p.length);
  for (let i=0; i<p.length; i++) {
    // Convert code from mixed/factorial base to base 10
    const code = lehmerCode(p[i]);
    let index = 0;
    for (let j=0; j<code.length; j++) {
      index += code[j]*mfact(code.length - j - 1);
    }
    orderedP[index] = p[i];
  }

  return +orderedP[pos-1].join('');
}

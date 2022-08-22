/**
 * Problem 116 - Red, green or blue tiles
 *
 * @see {@link https://projecteuler.net/problem=116}
 *
 * A row of five grey square tiles is to have a number of its tiles replaced
 * with coloured oblong tiles chosen from red (length two), green (length three)
 * or blue (length four).
 *
 * If red tiles are chosen there are exactly seven ways this can be done.
 *
 *          |X·X| | | |      |X·X|X·X| |
 *          | |X·X| | |      | |X·X|X·X|
 *          | | |X·X| |      |X·X| |X·X|
 *          | | | |X·X|
 *
 * If green tiles are chosen there are three ways.
 *
 *          |X·X·X| | |
 *          | |X·X·X| |
 *          | | |X·X·X|
 *
 * And if blue tiles are chosen there are two ways.
 *
 *          |X·X·X·X| |
 *          | |X·X·X·X|
 *
 * Assuming that colours cannot be mixed there are 7 + 3 + 2 = 12 ways of
 * replacing the grey tiles in a row measuring five units in length.
 *
 * How many different ways can the grey tiles in a row measuring fifty units in
 * length be replaced if colours cannot be mixed and at least one coloured tile
 * must be used?
 *
 * NOTE: This is related to Problem 117.
 */

const { sum } = require('../../lib/math');

this.solve = function () {

  // Again, we can take the same approach as in problem 114 and 115.

  // The difference with the previous problems is that the arrangements of tiles
  // in a row measuring n units in length "directly" represents the compositions
  // of n (not n+1). The reason is that here, a row is drawn in such a way that
  // it allows to distinguish two consecutive oblong tiles from a single (twice
  // as long) one without having to place a grey tile between them.

  // For example, with a row measuring five units in length, the seven ways of
  // having grey tiles replaced with red ones correspond to the compositions of
  // five with allowed parts k ∈ {1, 2}, which can be represented as follows :
  //
  //      pb. 116/117              pb. 114/115
  //
  //      |X·X| | | |      <->      |X| | | |      <->      2 + 1 + 1 + 1
  //      | |X·X| | |      <->      | |X| | |      <->      1 + 2 + 1 + 1
  //      | | |X·X| |      <->      | | |X| |      <->      1 + 1 + 2 + 1
  //      | | | |X·X|      <->      | | | |X|      <->      1 + 1 + 1 + 2
  //      |X·X|X·X| |      <->      |X| |X| |      <->      2 + 2 + 1
  //      | |X·X|X·X|      <->      | |X| |X|      <->      1 + 2 + 2
  //      |X·X| |X·X|      <->      |X| | |X|      <->      2 + 1 + 2

  // So we shall just count the A-restricted compositions of 50, excluding the
  // composition consisting of only ones, since at least one coloured tile must
  // be used.

  // Colours cannot be mixed, so we have to count separately those compositions
  // with allowed parts {1, 2} for red tiles, {1, 3} for green tiles, and {1, 4}
  // for blue tiles.

  // In each case, the set of allowed parts takes the form A = {1, m}.

  // @see problem 114
  //
  // Now let's work out the generating function of the series Σ[k≥0](Σ[a∈A]xᵃ)ᵏ
  // for A = {1, m} :
  //
  //  Σ[a∈A]xᵃ = x + xᵐ
  //  Σ[k≥0]xᵏ = 1/(1-x)
  //
  //  Σ[k≥0](Σ[a∈A]xᵃ)ᵏ = 1 / (1 - x - xᵐ)
  //
  // Which gives the recurrence relation :
  //
  //  aₙ = aₙ₋₁ + aₙ₋ₘ , with initial conditions aₖ = 1 for 0 ≤ k < m.

  // Counts the number of compositions of n into allowable parts {1, m}.
  const c = (n, m)=> {
    const S = Array(m).fill(1);
    for (let i=m-1; i<n; i++) {
      S.push(S.at(-1) + S.at(-m));
    }
    return S[n];
  }

  const units = 50;
  const tileLen = [2, 3, 4];

  return sum(tileLen.map(m => c(units, m) - 1));
}

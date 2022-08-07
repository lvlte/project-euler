/**
 * Problem 115 - Counting block combinations II
 *
 * @see {@link https://projecteuler.net/problem=115}
 *
 * NOTE: This is a more difficult version of Problem 114.
 *
 * A row measuring n units in length has red blocks with a minimum length of m
 * units placed on it, such that any two red blocks (which are allowed to be
 * different lengths) are separated by at least one black square.
 *
 * Let the fill-count function, F(m, n), represent the number of ways that a row
 * can be filled.
 *
 * For example, F(3, 29) = 673135 and F(3, 30) = 1089155.
 *
 * That is, for m = 3, it can be seen that n = 30 is the smallest value for
 * which the fill-count function first exceeds one million.
 *
 * In the same way, for m = 10, it can be verified that F(10, 56) = 880711 and
 * F(10, 57) = 1148904, so n = 57 is the least value for which the fill-count
 * function first exceeds one million.
 *
 * For m = 50, find the least value of n for which the fill-count function first
 * exceeds one million.
 */

this.solve = function () {

  // Taking the same approach as in the previous problem, we will just generate
  // the sequence of A-restricted compositions of n until aₙ reaches the target.

  // Given that red blocks must have a minimum length of m units, the sequence
  // must satisfy the following recurrence :
  //
  //  aₙ = 2aₙ₋₁ − aₙ₋₂ + aₙ₋₍ₘ₊₁₎
  //
  // with initial conditions aₖ = 1 for all integer k in [0, m].

  const m = 51; // read m as m+1 directly.
  const target = 1_000_000;
  const S = Array(m).fill(1);

  do S.push(2*S.at(-1) - S.at(-2) + S.at(-m));
  while (S.at(-1) <= target);

  // The compositions of n correspond to the ways of filling, with at least one
  // grey square between red blocks, a (n-1)-unit row, so we return n-1, that is
  // the index before last.
  return S.length - 2;
}

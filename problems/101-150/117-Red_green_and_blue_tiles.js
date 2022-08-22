/**
 * Problem 117 - Red, green and blue tiles
 *
 * @see {@link https://projecteuler.net/problem=117}
 *
 * Using a combination of grey square tiles and oblong tiles chosen from: red
 * tiles (measuring two units), green tiles (measuring three units), and blue
 * tiles (measuring four units), it is possible to tile a row measuring five
 * units in length in exactly fifteen different ways.
 *
 *  [...]
 *
 * How many ways can a row measuring fifty units in length be tiled?
 *
 * NOTE: This is related to Problem 116.
 */

this.solve = function () {

  // Taking the same approach as in problem 116 (see also 114, 115), but this
  // time with mixed tile lengths, we count the compositions of n into allowable
  // parts ∈ A = {1, 2, 3, 4}, which satisifies the recurrence :
  //
  //  aₙ = aₙ₋₁ + aₙ₋₂ + aₙ₋₃ + aₙ₋₄
  //
  // Since we can write A = ℤ⁺ ∖ { n ∈ ℤ ∣ n ≥ 5}, we also got that :
  //
  //  Σ[a∈A]xᵃ = x/(1-x) - x⁵/(1-x)
  //
  //  Σ[k≥0](Σ[a∈A]xᵃ)ᵏ =   1   / (1 - (x-x⁵)/(1-x))
  //                    = (1-x) / (1 - x + x⁵)
  //
  // Which gives the recurrence :
  //
  //  aₙ = 2aₙ₋₁ - aₙ₋₅
  //
  // with initial conditions a₀ = 1 and aₖ = 2ᵏ⁻¹ for 0 < k < 5.

  const n = 50;
  const S = [1, 1, 2, 4, 8];

  for (let i=S.length-1; i<n; i++) {
    S.push(2*S.at(-1) - S.at(-5));
  }

  return S[n];
}

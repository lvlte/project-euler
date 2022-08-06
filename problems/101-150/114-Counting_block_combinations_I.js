/**
 * Problem 114 - Counting block combinations I
 *
 * @see {@link https://projecteuler.net/problem=114}
 *
 * A row measuring seven units in length has red blocks with a minimum length
 * of three units placed on it, such that any two red blocks (which are allowed
 * to be different lengths) are separated by at least one grey square. There are
 * exactly seventeen ways of doing this.
 *
 * [ ] = Grey
 * [X] = Red
 *
 *      [ ][ ][ ][ ][ ][ ][ ]
 *
 *      [X][X][X][ ][ ][ ][ ]
 *      [ ][X][X][X][ ][ ][ ]
 *      [ ][ ][X][X][X][ ][ ]
 *      [ ][ ][ ][X][X][X][ ]
 *      [ ][ ][ ][ ][X][X][X]
 *
 *      [X][X][X][ ][X][X][X]
 *
 *      [X][X][X][X][ ][ ][ ]
 *      [ ][X][X][X][X][ ][ ]
 *      [ ][ ][X][X][X][X][ ]
 *      [ ][ ][ ][X][X][X][X]
 *
 *      [X][X][X][X][X][ ][ ]
 *      [ ][X][X][X][X][X][ ]
 *      [ ][ ][X][X][X][X][X]
 *
 *      [X][X][X][X][X][X][ ]
 *      [ ][X][X][X][X][X][X]
 *
 *      [X][X][X][X][X][X][X]
 *
 * How many ways can a row measuring fifty units in length be filled?
 *
 * NOTE: Although the example above does not lend itself to the possibility, in
 * general it is permitted to mix block sizes. For example, on a row measuring
 * eight units in length you could use red (3), grey (1), and red (4).
 */

this.solve = function () {

  // At first glance, we could be tempted to translate grey squares into ones
  // and red blocks of length k into k (since k must be greater than one), so
  // that one way of filling a n-units row corresponds to a unique ordered
  // sequence of terms, which we can write as a sum that yields n, eg. :
  //
  //  [ ][ ][ ][ ][ ][ ][ ]   <->   1 + 1 + 1 + 1 + 1 + 1 + 1
  //  [X][X][X][ ][ ][ ][ ]   <->   3 + 1 + 1 + 1 + 1
  //  [ ][X][X][X][ ][ ][ ]   <->   1 + 3 + 1 + 1 + 1
  //  ...
  //
  // From there, we could find a way to count the integer partitions of n (their
  // unique permutations since the order matters) that satisfy the rules, which
  // means excluding partitions where the term 2 appears, and those permutations
  // having two consecutive terms greater than one. Well, excluding the two's is
  // feasible but the other rule is way harder to apply without producing all
  // the unique permuted partitions of n in the first place, which we want to
  // avoid. So it's not a good approach.

  // Still, this reasoning led me to search for "ordered integer partitions" and
  // discover "compositions". A composition of an integer n is a way of writing
  // n as the sum of a sequence of strictly positive integers. Two sequences
  // that differ in the order of their terms define different compositions of
  // their sum, while they are considered to define the same partition of that
  // number.
  // -> https://en.wikipedia.org/wiki/Composition_(combinatorics)

  // There are 2ⁿ⁻¹ compositions of n ≥ 1, which is highly reminiscent of the
  // number of possible binary strings of length n-1, or in our case, the ways
  // of filling a (n-1)-unit row in red (ie. unit=bit, grey=0, red=1) whatever
  // the red block length.

  // I realized then that, in order to properly map one way of filling a row to
  // the corresponding composition and conversely, we should focus not on the n
  // units but on the n+1 bars delimiting them : the k+1 bars delimiting a red
  // block of length k correspond to the term k+1, and "free" bars, those not
  // counted as part of (delimiting) a red block, each represent the term 1.
  // -> https://en.wikipedia.org/wiki/File:Compositions_of_6.svg

  // This eliminates the problem of compositions with consecutive terms greater
  // than one and allows to count ways of filling a row with red blocks of any
  // length if we want (in contrast to the original approach).

  // All this to say that each of the compositions of n+1 correspond to one
  // unique way of filling a n-units row.

  // Ways of filling a 7-units row with red blocks of minimum 3-units, and the
  // corresponding compositions of 8 :
  //
  //  | | | | | | | |   <->   1 + 1 + 1 + 1 + 1 + 1 + 1 + 1
  //
  //  |X|X|X| | | | |   <->   4 + 1 + 1 + 1 + 1
  //  | |X|X|X| | | |   <->   1 + 4 + 1 + 1 + 1
  //  | | |X|X|X| | |   <->   1 + 1 + 4 + 1 + 1
  //  | | | |X|X|X| |   <->   1 + 1 + 1 + 4 + 1
  //  | | | | |X|X|X|   <->   1 + 1 + 1 + 1 + 4
  //
  //  |X|X|X| |X|X|X|   <->   4 + 4
  //
  //  |X|X|X|X| | | |   <->   5 + 1 + 1 + 1
  //  | |X|X|X|X| | |   <->   1 + 5 + 1 + 1
  //  | | |X|X|X|X| |   <->   1 + 1 + 5 + 1
  //  | | | |X|X|X|X|   <->   1 + 1 + 1 + 5
  //
  //  |X|X|X|X|X| | |   <->   6 + 1 + 1
  //  | |X|X|X|X|X| |   <->   1 + 6 + 1
  //  | | |X|X|X|X|X|   <->   1 + 1 + 6
  //
  //  |X|X|X|X|X|X| |   <->   7 + 1
  //  | |X|X|X|X|X|X|   <->   1 + 7
  //
  //  |X|X|X|X|X|X|X|   <->   8

  // So we just have to count the "A-restricted" compositions of n+1, with
  //
  //  A = { 1, 2, ... , n+1 } ∖ {2, 3}
  //
  // that is, the set of positive integers less than or equal to n+1, minus the
  // set {2, 3} according the red block length rule.

  // The number of A-restricted compositions of n into exactly k parts is given
  // by the coefficient of xⁿ in the expansion of (Σ[a∈A]xᵃ)ᵏ.

  // Since we are interested in all possible number of parts, this applies for
  // any non-negative integer k, so we obtain the power series :
  //
  //  Σ[k≥0](Σ[a∈A]xᵃ)ᵏ
  //
  // The next step is to find the generating function of this series.
  // @see Discrete Mathematics, An Open Introduction - 5.1 Generating Functions
  // -> https://discrete.openmathbooks.org/dmoi2/section-27.html

  // A more readable version of what follows (with beautiful MathJax symbols but
  // slightly different restrictions) can be found here :
  // -> https://math.stackexchange.com/a/1306711/616080

  // Let's focus first on Σ[a∈A]xᵃ :
  //
  //  Σ[a∈A]xᵃ = x + Σ[a≥4]xᵃ
  //           = x + x⁴/(1-x)
  //
  // Now let X = Σ[a∈A]xᵃ to make what follows more obvious :
  //
  //  Σ[k≥0](Σ[a∈A]xᵃ)ᵏ = Σ[k≥0]Xᵏ
  //                    = 1/(1-X)
  //
  // After substitution, we finally obtain :
  //
  //  Σ[k≥0](Σ[a∈A]xᵃ)ᵏ =   1   / (1 - x - x⁴/(1-x))
  //                    = (1-x) / (1 - 2x + x² - x⁴)

  // Reading the denominator of the generating function, we got that the number
  // aₙ of A-restricted compositions of n we are after satisfies the recurrence
  // relation :
  //
  //  aₙ = 2aₙ₋₁ − aₙ₋₂ + aₙ₋₄ with initial conditions a₀ = a₁ = a₂ = a₃ = 1

  // Finally, the code. We just generate the sequence according to the given
  // recurrence. We could only keep track of the last four terms (shift&push),
  // but it's not necessary as the array won't grow that much (it could be with
  // greater n though).

  const n = 51;
  const S = Array(4).fill(1);

  for (let i=S.length-1; i<n; i++) {
    S.push(2*S.at(-1) - S.at(-2) + S.at(-4));
  }

  return S.at(-1);
}

/**
 * Problem 78 - Coin partitions
 *
 * @see {@link https://projecteuler.net/problem=78}
 *
 * Let p(n) represent the number of different ways in which n coins can be
 * separated into piles. For example, five coins can be separated into piles
 * in exactly seven different ways, so p(5)=7.
 *
 *                          OOOOO
 *                          OOOO  O
 *                          OOO  OO
 *                          OOO  O  O
 *                          OO  OO  O
 *                          OO  O  O  O
 *                          O  O  O  O  O
 *
 * Find the least value of n for which p(n) is divisible by one million.
 */

this.solve = function () {
  // Again we have to deal with unrestricted partitions of n.

  // We are asked to find the value of n for which p(n) yields a value that is
  // divisible by one million, which translates to finding n such that :
  //  p(n) ≡ 0 (mod 10^6)

  // The generating function for unrestricted partitions of n is given by the
  // Euler product expression : Π[i∈ℕ](1-x^i)^-1

  // Since p(n) has to be divisible by one million, the value of n is probably
  // large enough to make the computation of the generating function as an euler
  // product complicated (the sequence length will be much larger, and thus the
  // number of sequences to "multiply", this would require to handle big arrays
  // which at some point won't be efficient).

  // Instead, we will use Euler's pentagonal number theorem, which relates the
  // product and series representations of the Euler function. Also, unlike the
  // previous problem where we had to deal with the partitions of n restricted
  // to prime parts, here we need to consider the set of natural numbers.

  // The pentagonal number theorem states that :
  //  Π[i∈ℕ](1-x^i) = (1-x)(1-x²)(1-x³) ...
  //  Π[i∈ℕ](1-x^i) = 1 - x - x² + x⁵ + x⁷ - x¹² - x¹⁵ + x²² + x²⁶ - ...

  // .where the coefficient sequence corresponds to the generalized pentagonal
  // numbers sequence, which is given by the formula :
  //  aₖ = k(3k−1)/2, for k in { 1, −1, 2, −2, 3, -3, ... }

  // This implies a recurrence for calculating the number of partitions of n :
  //  p(n) = p(n-1) + p(n-2) - p(n-5) - p(n-7) + p(n-12) + p(n-12) - ...

  // So basically our algorithm will use Euler's method which is illustrated at
  // https://upload.wikimedia.org/wikipedia/commons/0/05/Euler_partition_function.svg

  const divBy = 10**6;

  // seems we can also use Ramanujan's congruences in rder to avoid having to
  // mod all p(n)'s as p(5k+4) ≡ 0 (mod 5) ....


}

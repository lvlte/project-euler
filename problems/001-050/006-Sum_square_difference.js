/**
 * Problem 6 - Sum square difference
 *
 * @see {@link https://projecteuler.net/problem=6}
 *
 * The sum of the squares of the first ten natural numbers is,
 *
 *    1² + 2² + ... + 10² = 385
 *
 * The square of the sum of the first ten natural numbers is,
 *
 *    (1 + 2 + ... + 10)² = 55² = 3025
 *
 * Hence the difference between the sum of the squares of the first ten natural
 * numbers and the square of the sum is  3025 - 385 = 2640
 *
 * Find the difference between the sum of the squares of the first one hundred
 * natural numbers and the square of the sum.
 */
this.solve = function () {
  const n = 100;

  // 1 + 2 + 3 + ... + n = n*(n+1)/2 (Gauss trick)
  // @see also https://brilliant.org/wiki/sum-of-n-n2-or-n3/

  const squareOfSum  = (n*(n+1)/2)**2;
  const sumOfSquares = (n/6)*(n+1)*(2*n+1);

  return squareOfSum - sumOfSquares;
}

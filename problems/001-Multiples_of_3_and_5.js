/**
 * Problem 1 - Multiples of 3 and 5
 * @see {@link https://projecteuler.net/problem=1}
 *
 * If we list all the natural numbers below 10 that are multiples of 3 or 5, we
 * get 3, 5, 6 and 9. The sum of these multiples is 23.
 *
 * Find the sum of all the multiples of 3 or 5 below 1000.
 */
this.solve = function (limit=1000) {
  let sum = 0;

  for (n=3; n<limit; n++) {
    if (n % 3 === 0 || n % 5 === 0) {
      sum += n;
    }
  }

  return sum;
}

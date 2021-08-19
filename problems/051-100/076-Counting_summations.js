/**
 * Problem 76 - Counting summations
 *
 * @see {@link https://projecteuler.net/problem=76}
 *
 * It is possible to write five as a sum in exactly six different ways:
 *
 *      4 + 1
 *      3 + 2
 *      3 + 1 + 1
 *      2 + 2 + 1
 *      2 + 1 + 1 + 1
 *      1 + 1 + 1 + 1 + 1
 *
 * How many different ways can one hundred be written as a sum of at least two
 * positive integers ?
 */

const { intPartition } = require('../../lib/combinatorics')

this.solve = function () {
  const n = 100;

  // This relates to Integer Partition.
  // Not to be confused with Set Partitions (cf. problem 32).

  // A partition of a positive integer n is a way of writing n as a sum of
  // positive integers, where the order of the summands does not matter.
  // @see https://en.wikipedia.org/wiki/Partition_(number_theory)
  //      https://mathworld.wolfram.com/PartitionFunctionP.html
  //      https://oeis.org/A000041

  // We already had to deal with (restricted) partition numbers (cf. problem 31
  // which is a tough one). Here, it is easier as we just have to count them and
  // exclude the one that contains only n.

  // The partition function p(n) represents the number of possible partitions
  // of a non-negative integer n :
  //  P(n) = 1/n*Σ[k=0,n-1]σ₁(n-k)*P(k)
  //  where σ₁(n) or sigma1(n) is the divisor function.

  return intPartition(n) - 1;
}

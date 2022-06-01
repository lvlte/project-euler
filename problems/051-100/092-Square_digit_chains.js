/**
 * Problem 92 - Square digit chains
 *
 * @see {@link https://projecteuler.net/problem=92}
 *
 * A number chain is created by continuously adding the square of the digits in
 * a number to form a new number until it has been seen before.
 *
 * For example,
 *               44 → 32 → 13 → 10 → 1 → 1
 *               85 → 89 → 145 → 42 → 20 → 4 → 16 → 37 → 58 → 89
 *
 * Therefore any chain that arrives at 1 or 89 will become stuck in an endless
 * loop. What is most amazing is that EVERY starting number will eventually
 * arrive at 1 or 89.
 *
 * How many starting numbers below ten million will arrive at 89 ?
 */

const { digits, range } = require('../../lib/utils');

this.solve = function () {
  const limit = 10_000_000;
  const squares = range(10).map(n => n**2);

  // We will map each starting number n to its final value.
  let chain = new Array(limit);
  chain[1] = 1;
  chain[89] = 89;

  // Returns the next number in chain, the sum of the square of the digits of n.
  const next = (n, s=0) => digits(n).forEach(d => s += squares[d]) || s;

  // Expand chain starting from n and until its final value is known, mapping
  // each number in between to that final value, 1 or 89.
  const expand = (chain, n) => {
    let added = [];
    while (chain[n] === undefined) {
      added.push(n);
      n = next(n);
    }
    added.forEach(_n => chain[_n] = chain[n]);
    return chain[n];
  };

  // Count how many starting n below limit arrive at 89
  let count = 0;
  let n = 1;
  while (++n < limit) {
    const end = chain[n] || expand(chain, n);
    if (end === 89)
      count++;
  }

  return count;
}

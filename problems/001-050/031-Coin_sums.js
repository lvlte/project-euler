/**
 * Problem 31 - Coin sums
 *
 * @see {@link https://projecteuler.net/problem=31}
 *
 * In England the currency is made up of pound, £, and pence, p, and there are
 * eight coins in general circulation :
 *
 * 1p, 2p, 5p, 10p, 20p, 50p, £1 (100p) and £2 (200p).
 *
 * It is possible to make £2 in the following way :
 *
 * 1×£1 + 1×50p + 2×20p + 1×5p + 1×2p + 3×1p
 *
 * How many different ways can £2 be made using any number of coins?
 *
 * HINT: Some products can be obtained in more than one way so be sure to only
 * include it once in your sum.
 */

this.solve = function () {
  const SUM = 200;
  const coins = [200, 100, 50, 20, 10, 5, 2, 1];

  // For each coin of value p, compute every products of n*p for 0 >= n >= 200
  // until it reaches 200, at which point we got a set of n's which are the
  // possible number of time this coin can be used in a sum yielding 200p.
  // For example :
  //  - for 200p, the possible values for n correspond to the set [0, 1]
  //  - for 50p, it would be the set [0, 1, 2, 3, 4].
  //  - for 1p, it would be [0, 1, ... , 199, 200].

  // So let each coin be assigned its set of n's, the whole compose our 'deck'.
  let deck = {};
  for (let i=0; i<coins.length; i++) {
    const coin = coins[i];
    let nSet = [0];
    for (let n=1; n<=SUM; n++) {
      const p = n * coin;
      if (p > SUM)
        break;
      nSet.unshift(n); // store the n's in descending order
    }
    deck[coin] = nSet;
  }

  // Now we can create combinations of the elements in our deck, retaining only
  // those yielding the target sum.

  // Actual combinations count
  let count = 0;

  // Recursive function that tries combinations given the current set of coins
  // and the current sum value, counting those yielding the target sum.
  function combine(coins, sum=0) {
    const coin = coins[0];
    let nSet = deck[coin];
    for (let i=0; i<nSet.length; i++) {
      const n = nSet[i];
      const s = sum + n*coin;
      if (s === SUM)
        count++;
      else if (s < SUM) {
        if (coins.length > 1)
          combine(coins.slice(1), s);
        else
          break; // next n is smaller
      }
    }
  };

  combine(coins);

  return count;

  // Actually we count the restricted partitions of n : given a restricted set
  // of coins, we count the ways to make n=200.
  // @see http://oeis.org/wiki/Restricted_partitions
  // @see http://oeis.org/wiki/Partitions
}

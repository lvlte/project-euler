/**
 * Problem 121 - Disc game prize fund
 *
 * @see {@link https://projecteuler.net/problem=121}
 *
 * A bag contains one red disc and one blue disc. In a game of chance a player
 * takes a disc at random and its colour is noted. After each turn the disc is
 * returned to the bag, an extra red disc is added, and another disc is taken at
 * random.
 *
 * The player £1and wins if they have taken more blue discs than
 * red discs at the end of the game.
 *
 * If the game is played for four turns, the probability of a player winning is
 * exactly 11/120, and so the maximum prize fund the banker should allocate for
 * winning in this game would be £10 before they would expect to incur a loss.
 * Note that any payout will be a whole number of pounds and also includes the
 * original £1 paid to play the game so in the example given the player actually
 * wins £9.
 *
 * Find the maximum prize fund that should be allocated to a single game in
 * which fifteen turns are played.
 */

const { nkCombinations } = require('../../lib/combinatorics');
const { product, factorial } = require('../../lib/math');
const { range } = require('../../lib/utils');

this.solve = function () {

  // Let p/q the probability of a player winning after n turns.

  // At each turn t, 1 ≤ t ≤ n, the bag contains t+1 discs (t red, 1 blue), and
  // the player has :
  //
  //        1/(t+1) chance  of picking a blue disc
  //        t/(t+1) chances of picking a red  disc

  // The game outcome is determined by a sequence of picks, and the probability
  // of a sequence is given by the product of the probabilities of each pick in
  // that sequence. And since any distinct sequence of picks having more blue
  // picks than red picks represents a distinct way to win, the probability of
  // winning the game is given by the sum of those sequence probabilities.

  // For example in a game with four turns, there are five winning sequences :
  // the one where we pick a blue disc at each turn, and four others where we
  // pick three blue discs and one red disc :
  //
  //  bbbb :  1/2 * 1/3 * 1/4 * 1/5 = 1/120
  //  rbbb :  1/2 * 1/3 * 1/4 * 1/5 = 1/120
  //  brbb :  1/2 * 2/3 * 1/4 * 1/5 = 2/120
  //  bbrb :  1/2 * 1/3 * 3/4 * 1/5 = 3/120
  //  bbbr :  1/2 * 1/3 * 1/4 * 4/5 = 4/120
  //
  // So the probability of winning after four turns is the sum of products :
  //
  //  p/q = 1/120 + 1/120 + 2/120 + 3/120 + 4/120
  //      = 11/120
  //
  // We can observe that the winning sequence products are actually determined
  // by the combinations of red picks allowed (here the combinations of zero or
  // one red picks) more than by the combinations of blue picks required, since
  // a blue pick amounts to multiply the numerator by one, ie. in the sequence
  // 'bbbr' only the 'r' and its position (4, which is the number of red discs
  // at turn 4) are relevant, as the '4' in the numerator of (1*1*1*4)/120.

  // So we have q := Π(t+1) for 1 ≤ t ≤ n
  //
  //  q = (1+1) * (2+1) * (3+1) ... * (n+1)
  //  q = (n+1)!
  //
  // And we can compute p from the k-combinations of "red picks allowed" to win
  // the game after n turns, that is, for 0 ≤ k < n/2 (combinations made of k
  // elements from the set of number of red discs in the bag at each turn).

  // With a probability of winning of p/q, the maximum prize fund should not
  // exceed ⌊q/p⌋.

  const n = 15;
  const R = range(1, n+1); // number of red discs in the bag at each turn
  const K = range(n/2);    // range of red picks allowed

  let p = 0;
  const q = factorial(n+1);

  for (const redpicks of nkCombinations(R, K)) {
    p += product(redpicks);
  }

  return Math.floor(q/p);
}

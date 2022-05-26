/**
 * Problem 112 - Bouncy numbers
 *
 * @see {@link https://projecteuler.net/problem=112}
 *
 * Working from left-to-right if no digit is exceeded by the digit to its left
 * it is called an increasing number; for example, 134468.
 *
 * Similarly if no digit is exceeded by the digit to its right it is called a
 * decreasing number; for example, 66420.
 *
 * We shall call a positive integer that is neither increasing nor decreasing a
 * "bouncy" number; for example, 155349.
 *
 * Clearly there cannot be any bouncy numbers below one-hundred, but just over
 * half of the numbers below one-thousand (525) are bouncy. In fact, the least
 * number for which the proportion of bouncy numbers first reaches 50% is 538.
 *
 * Surprisingly, bouncy numbers become more and more common and by the time we
 * reach 21780 the proportion of bouncy numbers is equal to 90%.
 *
 * Find the least number for which the proportion of bouncy numbers is exactly
 * 99%.
 */

const { signum } = require('../../lib/math');
const { digits } = require('../../lib/utils');

this.solve = function () {

  // This is a basic brute force approach... I hope to be able to get back to it
  // later with something better.

  let n = 21780;
  let r = 0.9;
  let count = n * r;

  const isBouncy = n => {
    const D = digits(n);
    let s1 = 0;
    for (let i=1; i<D.length; i++) {
      const s2 = signum(D[i] - D[i-1]);
      if (s1 == 0)
        s1 = s2;
      else if (s2 != 0 && s1 != s2)
        return true;
    }
    return false;
  }

  while (r != 0.99) {
    if (isBouncy(++n)) {
      r = ++count / n;
    }
  }

  return n;
}

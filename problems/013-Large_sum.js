/**
 * Problem 13 - Large sum
 *
 * @see {@link https://projecteuler.net/problem=13}
 *
 * Work out the first ten digits of the sum of the following one-hundred
 * 50-digit numbers.
 */

const { load } = require('../lib/utils');
const numbers = load('p013.txt').split(/\r\n|\n/).filter(l => l);

this.solve = function () {
  // Considering extreme case where all 100 numbers ends with 9 after the 10th
  // digits :
  //  xxxxxxxxxx9999999...
  // If we pick ^ each 11th and round it up to 10, then take p = 100*10 :
  //  xxxxxxxxxx9[999999...]
  // +         10[000000...]
  // +         10[000000...]
  // + ...                    <- one hundred times
  // ... then we have :
  //  xxxxxxxxxxx[...ignored] <- sum of the numbers truncated after 1st 10 digits.
  // +       1000[0000000...] <- max sum diff considering only truncated digits.
  // So here ^ we got the position of the "worst case' carry which is in 8th
  // position, we need to "push it forward" to the 11th position so that we can
  // work out the first ten digits without having to compute the whole number.

  // In other words, we only need to check the sum of the first 10 digits + the
  // next 3 digits (11-8) that would potentially affect the final result.

  const p = numbers.length*10;
  const nCheck = Math.ceil(Math.log10(p));
  let checked = 0;

  const N = 10;
  let firstN;
  let n = 0;

  while (firstN !== n && checked < nCheck) {
    firstN = n;
    n = 0;
    for (let i=0; i<numbers.length; i++) {
      n += parseInt(numbers[i].substr(0, N+1+checked));
    }
    n = parseInt((''+n).substr(0, N));
    checked++;
  }

  return firstN;
}

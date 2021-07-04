/**
 * Problem 16 - Power digit sum
 *
 * @see {@link https://projecteuler.net/problem=16}
 *
 * 2¹⁵ = 32768 and the sum of its digits is 3 + 2 + 7 + 6 + 8 = 26.
 *
 * What is the sum of the digits of the number 2¹⁰⁰⁰ ?
 */

const { sum } = require('../../lib/utils')

// Lazy solution
// this.solve = () => sum((''+2n**1000n).split(''));

this.solve = function () {
  const pow = 1000;
  const n = 2;

  // Consider each digit*10^exp separately, right-to-left ([ones, tens, ...]).
  let digits = [n];
  let p = 1;

  while (++p <= pow) {
    let carry = 0;
    for (let exp=0; exp<digits.length; exp++) {
      const prod = digits[exp]*n + carry;
      carry = Math.floor(prod/10);
      digits[exp] = prod % 10;
    }
    while (carry > 0) {
      digits.push(carry%10);
      carry = Math.floor(carry/10);
    }
  }

  const number = digits.reverse().join('');

  return sum((''+number).split(''));
}

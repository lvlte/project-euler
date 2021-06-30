/**
 * Problem 20 - Factorial digit sum
 *
 * @see {@link https://projecteuler.net/problem=20}
 *
 * n! means n × (n − 1) × ... × 3 × 2 × 1
 *
 * For example, 10! = 10 × 9 × ... × 3 × 2 × 1 = 3628800,
 * and the sum of the digits in the number 10! is 3 + 6 + 2 + 8 + 8 + 0 + 0 = 27
 *
 * Find the sum of the digits in the number 100!
 */

const { sum } = require('../lib/utils');

this.solve = function () {
  const n = 100;
  // const { bigFact } = require('../lib/utils');
  // const number = bigFact(n); huhu

  // Consider each digit*10^exp separately, right-to-left ([ones, tens, ...]).
  let digits = [1];
  for (let x=2; x<=n; x++) {
    let carry = 0;
    for (let exp=0; exp<digits.length; exp++) {
      const prod = digits[exp]*x + carry;
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

/**
 * Problem 34 - Digit factorials
 *
 * @see {@link https://projecteuler.net/problem=34}
 *
 * 145 is a curious number, as 1! + 4! + 5! = 1 + 24 + 120 = 145.
 *
 * Find the sum of all numbers which are equal to the sum of the factorial of
 * their digits.
 *
 * Note: As 1! = 1 and 2! = 2 are not sums they are not included.
 */

const { sum, mfact } = require('../../lib/math');

this.solve = function () {
  // Such curious numbers are called "factorions".
  // @see https://mathworld.wolfram.com/Factorion.html

  // The first thing is to find an upper limit above which we know there are no
  // factorion, in order to limit the search.

  // Let's say we got a n-digits factorion x represented in base 10 and composed
  // of digits a1, a2, ... an, such that x = a1! + a2! + ... + an! ;
  // then, x cannot exceed n*9! since 9 is the greatest digit we can use.

  // Now let's try to find out the maximum number of digits that can form a
  // factorion, or in other words, the largest possible sum of n factorials
  // which can yield an n-digit number :
  //  - with n=9, 9*9! = 3265920, got 7 digits which is less than n
  //  - with n=8, 8*9! = 2903040, got 7 digits which is less than n
  //  - with n=7, 7*9! = 2540160, number of digits matches n

  // So 7 is the maximum number of digits we will find in a factorion. Though,
  // it's still possible to reduce the limit given by x = 7*9! = 2540160 :
  //  - there can't be any factorion greater than 2540160,
  //  - therefore the greatest factorion can't have only 9's (9999999 > 2540160)
  //  - precisely, it may have at most six nines
  //  - the only number below 2540160 which has six nines is 1999999

  const limit = 1999999;
  let factorions = [];
  let n = 10;

  while (++n <= limit) {
    const digits = (''+n).split('').map(s => +s);
    let factDigSum = 0;
    for (let i=0; i<digits.length; i++) {
      factDigSum += mfact(digits[i]);
      if (factDigSum > n)
        break;
    }
    if (factDigSum === n)
      factorions.push(n);
  }

  return sum(factorions);
}

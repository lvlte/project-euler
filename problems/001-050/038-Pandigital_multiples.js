/**
 * Problem 38 - Pandigital multiples
 *
 * @see {@link https://projecteuler.net/problem=38}
 *
 * Take the number 192 and multiply it by each of 1, 2, and 3:
 *
 *    192 × 1 = 192
 *    192 × 2 = 384
 *    192 × 3 = 576
 *
 * By concatenating each product we get the 1 to 9 pandigital, 192384576. We
 * will call 192384576 the concatenated product of 192 and (1,2,3).
 *
 * The same can be achieved by starting with 9 and multiplying by 1, 2, 3, 4, 5,
 * giving the pandigital, 918273645, which is the concatenated product of 9 and
 * (1,2,3,4,5).
 *
 * What is the largest 1 to 9 pandigital 9-digit number that can be formed as
 * the concatenated product of an integer with (1,2, ... , n) where n > 1 ?
 */

this.solve = function () {
  // We can do some brute force : given a 5 digits number X=xxxxx, the smallest
  // concatenated product of xxxxx*n with n > 1 is xxxxx*(1,2), for example :
  //  11111*1 . 11111*2 = 1111122222 which is a ten digits number
  // Therefore, X can't have 5 or more digit.
  // Since we target 9-digit pandigital numbers and the minimum value of n is 2,
  // the max number of digits for X is ⌊9/2⌋ = 4, so X must be smaller than 10^4.

  const pandigitLen = 9; // 1 to 9 pandigital.
  const nMin = 2;        // n > 1
  const limit = 10**Math.floor(pandigitLen/nMin);

  // Returns whether or not nStr is 1 to 9 pandigital
  const isPandigital = nStr => {
    if (nStr.length != 9)
      return false;
    return [...new Set((nStr+'0').split(''))].length === 10;
  }

  let pandigitals = [];
  let x = 0;

  while (++x < limit) {
    let n = 0;      // multiplier
    let P = {};     // products
    let catP = '';  // concatenated product
    while (catP.length < pandigitLen) {
      const p = x*++n;
      P[n] = p;
      catP += p;
    }
    if (catP.length === pandigitLen && isPandigital(catP))
      pandigitals.push(+catP);
  }

  return Math.max(...pandigitals);
}


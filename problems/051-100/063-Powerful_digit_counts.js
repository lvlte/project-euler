/**
 * Problem 63 - Powerful digit counts
 *
 * @see {@link https://projecteuler.net/problem=63}
 *
 * The 5-digit number, 16807=7^5, is also a fifth power. Similarly, the 9-digit
 * number, 134217728=8^9, is a ninth power.
 *
 * How many n-digit positive integers exist which are also an nth power ?
 */

this.solve = function () {
  // 10^n has (n+1)-digit, so the range of positive integers to be raised to the
  // power of n in order to obtain the searched numbers is [b, 9], with b >= 1.

  // Regarding the exponent, we will start at one to get the 1-digit numbers,
  // then increment it until no base can produce an n-digit number when raised
  // to the corresponding power.

  // For exponents greater than one, we know the base must be greater than one
  // to yield more than one digit numbers. As the exponent grows, the base must
  // also grows to produce the corresponding number of digits.

  // We also know that the maximum base to be used in order to produce nth power
  // n-digit integers is nine, so we can break the search when the exponent
  // requires the base to be greater than nine, or in other words, when nine to
  // the power of n is less than n-digit.

  let exp = 0n;
  let nthPower = [];

  while (++exp) {
    if (exp > 1n && (''+9n**exp).length < exp)
      break;
    for (let base=1n; base<10n; base++) {
      const x = base**exp;
      if (exp == (''+x).length)
        nthPower.push({[base+'^'+exp]: x});
    }
  }

  // console.log(nthPower);

  return nthPower.length;
}

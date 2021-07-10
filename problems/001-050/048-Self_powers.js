/**
 * Problem 48 - Self powers
 *
 * @see {@link https://projecteuler.net/problem=48}
 *
 * The series, 1^1 + 2^2 + 3^3 + ... + 10^10 = 10405071317.
 *
 * Find the last ten digits of the series, 1^1 + 2^2 + 3^3 + ... + 1000^1000.
 */
this.solve = function () {
  const nDigit = 10;
  const mod = 10**nDigit;

  // -> Not using BigInt

  // We have a large sum and we need the last n digits so we can use modular
  // arithmetic to compute only the digits of interest, knowing that :
  //  (x+y) % n = ((x%n) + (y%n)) % n

  // Also the series grows fast, each member being a power of itself, so again
  // we use modular arithmetic to compute each member of the sum, knowing that :
  //  (x*y) % n = ((x%n) * (y%n)) % n

  // So for the modular exponentiation :
  //  n^k % mod = (n*n*...) % mod
  //            = ((n%mod) * (n%mod) * ...) % mod
  const modPow = (base, exp, mod) => {
    let r = 1;
    for (let i=1; i<=exp; i++)
      r = (r*(base%mod))%mod; // <- (X)%mod each time so that r stays "small"
    return r;                 // <- or we could have a (too) large r to mod here
  };

  let r = 0;
  for (let n=1; n<=1000; n++)
    r = (r+modPow(n, n, mod)%mod);

  return r%mod;
}

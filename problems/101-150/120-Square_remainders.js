/**
 * Problem 120 - Square remainders
 *
 * @see {@link https://projecteuler.net/problem=120}
 *
 * Let r be the remainder when (a−1)ⁿ + (a+1)ⁿ is divided by a².
 *
 * For example, if a = 7 and n = 3, then r = 42: 6³ + 8³ = 728 ≡ 42 mod 49. And
 * as n varies, so too will r, but for a = 7 it turns out that rₘₐₓ = 42.
 *
 * For 3 ≤ a ≤ 1000, find ∑ rₘₐₓ.
 */

this.solve = function () {

  // The first thing is that we have a sum of binomial powers (a−1)ⁿ + (a+1)ⁿ.
  // If we expand them, we can observe that one out of two terms is cancelled
  // out in the resulting sum :
  //
  //       n :  1  |      2      |      3            |      4
  //  -------|-----|-------------|-------------------|-------------------------
  //  (a−1)ⁿ | a−1 | a² - 2a + 1 | a³ - 3a² + 3a - 1 | a⁴ - 4a³ + 6a² - 4a + 1
  //  (a+1)ⁿ | a+1 | a² + 2a + 1 | a³ + 3a² + 3a + 1 | a⁴ + 4a³ + 6a² + 4a + 1
  //
  //  -> for n odd  : the even powers cancel out.
  //  -> for n even : the odd  powers cancel out.
  //
  //  n=1 :  (a−1)¹ + (a+1)¹  =  2a
  //  n=2 :  (a−1)² + (a+1)²  =  2a² + 2
  //  n=3 :  (a−1)³ + (a+1)³  =  2a³ + 6a
  //  n=4 :  (a−1)⁴ + (a+1)⁴  =  2a⁴ + 12a² + 2
  //  n=5 :  (a−1)⁵ + (a+1)⁵  =  2a⁵ + 20a³ + 10a
  //  n=6 :  (a−1)⁶ + (a+1)⁶  =  2a⁶ + 30a⁴ + 30a² + 2

  // The second thing is that all terms in each sum take the form c*aᵖ, and we
  // are interested in the remainder of these sums when divided by a². Modular
  // arithmetic tells us that (x+y) % n = (x%n + y%n) % n, and we know that for
  // any integer p ≥ 2, c*aᵖ ≡ 0 mod a², so it simplify things :
  //
  //  n=1 : ( 2a                    ) % a²  =  2a  %  a²
  //  n=2 : ( 2a² + 2               ) % a²  =  2   %  a²
  //  n=3 : ( 2a³ + 6a              ) % a²  =  6a  %  a²
  //  n=4 : ( 2a⁴ + 12a² + 2        ) % a²  =  2   %  a²
  //  n=5 : ( 2a⁵ + 20a³ + 10a      ) % a²  =  10a %  a²
  //  n=6 : ( 2a⁶ + 30a⁴ + 30a² + 2 ) % a²  =  2   %  a²
  //
  // The coefficient c in the term of c*a¹ is two times the binomial coefficient
  // (n choose 1), that is, 2*n. So the remainder r can only take one of two
  // forms, given that a ≥ 3 :
  //
  //  -> for n odd  :  r = 2n*a % a²
  //  -> for n even :  r = 2

  // Now as we want to maximize r, we can discard the case when n is even and
  // consider only the maximum value of r for odd n, for which we can write :
  //
  //  r = 2n*a % a²
  //    = a(2n % a)

  // Which means we want to maximize (2n % a). The maximum remainder of the
  // euclidean division (2n by a) is either a-1 for a odd, or a-2 for a even.
  // The fact n must be odd is not a problem, but we can still check that there
  // always exists some odd n for which the maximum residue can be obtained :
  //
  //  -> for a odd, (a-1)/2 odd  : n = (a-1)/2,     2n % a =  (a-1) % a = a-1
  //  -> for a odd, (a-1)/2 even : n = a + (a-1)/2, 2n % a = (3a-1) % a = a-1
  //  -> for a even :              n = a-1,         2n % a = (2a-2) % a = a-2
  //
  // So we got rₘₐₓ = a(a-1) for a odd, or a(a-2) for a even.

  let rmaxSum = 0;

  for (let a=3; a<=1000; a++) {
    rmaxSum +=   a*(a-1); // a is odd
    rmaxSum += ++a*(a-2); // a is even
  }

  return rmaxSum;
}

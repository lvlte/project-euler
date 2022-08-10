/**
 * Problem 78 - Coin partitions
 *
 * @see {@link https://projecteuler.net/problem=78}
 *
 * Let p(n) represent the number of different ways in which n coins can be
 * separated into piles. For example, five coins can be separated into piles
 * in exactly seven different ways, so p(5)=7.
 *
 *                          OOOOO
 *                          OOOO  O
 *                          OOO  OO
 *                          OOO  O  O
 *                          OO  OO  O
 *                          OO  O  O  O
 *                          O  O  O  O  O
 *
 * Find the least value of n for which p(n) is divisible by one million.
 */

this.solve = function () {
  // Again we have to deal with unrestricted partitions of n.

  // We are asked to find the value of n for which p(n) yields a value that is
  // divisible by one million, which translates to finding n such that :
  //  p(n) ≡ 0 (mod 10^6)

  // The generating function for unrestricted partitions of n is given by the
  // Euler product expression : Π[i∈ℕ](1-x^i)^-1

  // Since p(n) has to be divisible by one million, the value of n is probably
  // large enough to make the computation of the generating function as an euler
  // product complicated (the sequence length will be much larger, and thus the
  // number of sequences to "multiply", this would require to handle big arrays
  // which at some point won't be efficient).

  // Instead, we will use Euler's pentagonal number theorem, which relates the
  // product and series representations of the Euler function. Also, unlike the
  // previous problem where we had to deal with the partitions of n restricted
  // to prime parts, here we need to consider the set of natural numbers.

  // The pentagonal number theorem states that :
  //  Π[i∈ℕ](1-x^i) = (1-x)(1-x²)(1-x³) ...
  //  Π[i∈ℕ](1-x^i) = 1 - x - x² + x⁵ + x⁷ - x¹² - x¹⁵ + x²² + x²⁶ - ...

  // where the sequence of exponents 0, 1, 2, 5, 7, 12, ... corresponds to the
  // generalized pentagonal numbers sequence, which is given by the formula :
  //  aₖ = k(3k−1)/2, for k in { 1, −1, 2, −2, 3, -3, ... }

  // This implies a recurrence for calculating the number of partitions of n :
  //  p(n) = p(n-1) + p(n-2) - p(n-5) - p(n-7) + p(n-12) + p(n-15) - ...

  // So basically our algorithm will use Euler's method which is illustrated at
  // https://upload.wikimedia.org/wikipedia/commons/0/05/Euler_partition_function.svg

  // It's likely that p(n) will grow over Number.MAX_SAFE_INTEGER, but since we
  // only have to find the value of n for which p(n) is divisible by one million
  // and as we deal with a series (addition), we can use modular arithmetic to
  // compute only the digits of interest and thus avoid having to rely on bigint
  // knowing that :
  //  (x+y) % n = ((x%n) + (y%n)) % n

  // So instead of handling all the partition numbers, we will only keep track
  // of the remainders of p(n) modulo 10^6.

  const modulus = 10**6;

  // Generalized pentagonal numbers generator
  const pentaGen = function * () {
    let k = 0;
    while (++k) {
      yield pentagonal(k);
      yield pentagonal(-k);
    }
  }();

  let n = 0;
  let pnRem = [1]; // remainders of p(n) % modulus, p(0) = 1
  let pentagonals = [];

  do {
    pnRem[++n] = 0;
    if (n > pentagonals.length)
      pentagonals.push(pentaGen.next().value);
    for (let i=0, m=-1; pentagonals[i] <= n; i++) {
      const k = pentagonals[i];
      m = (i & 1) ? m : -m;
      pnRem[n] += m*pnRem[n-k];
    }
    pnRem[n] %= modulus;
  }
  while (pnRem[n] !== 0);

  return n;
}

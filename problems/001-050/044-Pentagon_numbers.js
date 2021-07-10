/**
 * Problem 44 - Pentagon numbers
 *
 * @see {@link https://projecteuler.net/problem=44}
 *
 * Pentagonal numbers are generated by the formula, Pn=n(3n−1)/2.
 * The first ten pentagonal numbers are:
 *
 *        1, 5, 12, 22, 35, 51, 70, 92, 117, 145, ...
 *
 * It can be seen that P4 + P7 = 22 + 70 = 92 = P8. However, their difference,
 * 70 − 22 = 48, is not pentagonal.
 *
 * Find the pair of pentagonal numbers, Pj and Pk, for which their sum and
 * difference are pentagonal and D = |Pk − Pj| is minimised;
 *
 * What is the value of D ?
 */
this.solve = function () {
  // Pentagonal numbers function
  const P = n => n*(3*n-1)/2;

  let pentaHT = {};
  let pentagonals = {};

  // Check whether the given pair of pentagonal numbers have both their sum and
  // difference pentagonals.
  const pairIsPenta = (Pj,Pk) => (Pj+Pk) in pentaHT && (Pk-Pj) in pentaHT;

  // First we generate some pentagonal numbers. The limit is set arbitrarily so
  // that we can get some pairs in a reasonable time (cheating a bit).
  const maxPn = 10**8; // p(n) = n(3n−1)/2 ⟹ 3n² − n − 2p(n) = 0
  const limit = Math.ceil((1+Math.sqrt(1+24*maxPn))/6);

  for (let n=1; n<limit; n++) {
    const Pn = P(n);
    pentaHT[Pn] = Pn;
    pentagonals[n] = Pn;
  }

  // Finding pairs of pentagonal numbers for which sum and diff are pentagonal
  let minD = Infinity;
  for (let j=1; j<limit; j++) {
    const Pj = pentagonals[j];
    for (let k=j+1; k<limit; k++) {
      const Pk = pentagonals[k];
      if (pairIsPenta(Pj, Pk)) {
        const D = Pk-Pj;
        minD = Math.min(minD, D);
      }
    }
  }

  return minD;
}

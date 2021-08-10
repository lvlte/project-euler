/**
 * Problem 70 - Totient permutation
 *
 * @see {@link https://projecteuler.net/problem=70}
 *
 * Euler's Totient function, φ(n) [sometimes called the phi function], is used
 * to determine the number of positive numbers less than or equal to n which
 * are relatively prime to n. For example, as 1, 2, 4, 5, 7, and 8, are all
 * less than nine and relatively prime to nine, φ(9)=6.
 *
 * The number 1 is considered to be relatively prime to every positive number,
 * so φ(1)=1.
 *
 * Interestingly, φ(87109)=79180, and it can be seen that 87109 is a permutation
 * of 79180.
 *
 * Find the value of n, 1 < n < 10^7, for which φ(n) is a permutation of n and
 * the ratio n/φ(n) produces a minimum.
 */

const { isPermutation } = require('../../lib/combinatorics');
const { getPrimes } = require('../../lib/prime');

this.solve = function () {
  const nMax = 10**7;

  // Similarly to the previous problem, finding a minimum for n/φ(n), n <= nMax,
  // translates to finding a maximum for Xn :
  //  n/φ(n) = n/(n*∏[p|n](1-1/p))
  //         = 1/∏[p|n](1-1/p)
  //         = 1/Xn                    let Xn = ∏[p|n](1-1/p)

  // Xn = (1-1/p1)(1-1/p2)...(1-1/pk)

  // We saw that the more distinct prime factors we have and the smaller they
  // are, the faster Xn decreases.

  // Therefore, the best n candidates should have no "small" prime factors, and
  // as few as possible.

  // Actually the best candidates could have been primes themselves, but they
  // won't fit the permutation requirement : knowing that if n is a prime then
  // φ(n) = n - 1, we would have two consecutive numbers, and two consecutive
  // numbers can't be permutation of one another (except in base 2).

  // So valid n candidates have at least 2 distinct prime factors as big as
  // possible, which implies that n might be quite "big", or rather close to
  // nMax (if we don't consider permutations).

  // By pairing distinct prime numbers (p1, p2), starting with those ones close
  // to sqrt(nMax), we "should" find the best n candidates for which the ratio
  // n/φ(n) produces a minimum, which "should" allow us to break the search as
  // soon as the permutation requirement is met.

  // -> "should" because it will depend on how we increase the gap between p1
  // and p2 and how their product evolves. Also, we don't know yet if there do
  // exist solution satisfying that requirement for n having two distinct prime
  // factors, what if we need three of them ? Or what if the best solution that
  // exists for n having two prime factors is worse (with a greater ratio) than
  // the best one for other n having three ?

  // Well, we can precompute what would be the the minimum ratio of n/φ(n) for
  // prime set of length 3 without considering permutations. This will allow us
  // later to figure out when we can break the search without making assumption.

  // For computing the ratios, knowing that if m and n are relatively prime then
  // φ(mn) = φ(m)φ(n), and since we will only use primes (m,n are primes), then
  // φ(mn) = (m-1)(n-1)

  // Actually instead of computing the exact minimum ratio, we will approximate
  // it, because we want to avoid having to create the k-combinations of primes
  // for sets of length k, and because we only need some values to compare with
  // later. So we will use the kth-root of n instead of k distinct primes.

  // Let consider the function a(n,k) ~= φ(n), a(n,k) > φ(n) :
  //       n = p1*p2*...*pk
  //    φ(n) = (p1-1)(p2-1)...(pk-1)
  //  a(n,k) = (krt(n)-1)^k                (krt is the kth root of n)
  const a = (n, k) => (n**(1/k) - 1)**k;

  // We will compute a(nMax,3) to produce a minimum ratio which we know is out
  // of reach given a real set of 3 distinct prime factors, but it's not really
  // an issue as we will just compare the actual best solution for k=2 with the
  // min value obtained for k=3 : if a solution is found and produce a smaller
  // ratio, then we know with absolute certitude that we can't do better with
  // more than 2 primes. If not, this means we will have to deal with two or
  // more primes which would be much more complicated (in this case, we would
  // have to handle pairs and triples and compute a(nMax,4) to get the minimum
  // ratio to refer to for knowing when to break or when to add the sets of 4
  // primes to compete with the others, etc.).

  //  k: minimum ratio approximation
  //  2: 1.0006327556585748
  //  3: 1.0140550395901490
  //  4: 1.0744095246358945
  //  5: 1.2252246575595067

  // Now we need to find a way to produce ratios in a way that allow us to break
  // as early as possible once a solution is found.

  // Since we consider only n's which are a product of two distinct primes for
  // now, we can use a(n,2) and observe that :
  // -> as n increases, n/a(n,2) is strictly decreasing
  // (@see figures 1 & 2 in ../ref/ directory)

  // This means that when we find a solution, we can also find the minimum value
  // of n for which and below which no lower ratio can be obtained :
  //  Say we got r1 = n/φ(n) and φ(n) is a permutation of n, from there we can
  //  compute r0 = n/a(n,2), r0 < r1.
  //  Then the minimum value of n that can(not) be used for beating r1 can be
  //  found by decreasing n until r0 reaches r1, such that nMin/a(nMin,2) = r1

  // Returns the value of n for which and below which n/φ(n) can't be smaller
  // than r1.
  const findNmin = (r1, n) => {
    let r0 = 0;
    while (r0 < r1 && --n)
      r0 = n/a(n,2);
    return n;
  };

  // Considering the gap between p1 and p2 and its impact on the ratio r=n/φ(n),
  // we can use another function for this, say b(n,gap), to examine φ(n) given
  // some gap by using "virtual" primes such that p1 + gap = p2 and p1 * p2 = n,
  // sort of an analytic continuation of φ(n) where most of the outputs don't
  // exist (eg. like those with no gaps, where b(n,0) = a(n,2)).
  // We can observe that for any n, r grows exponentially as the gap increases,
  // and also that the smaller n, the higher r and the faster it expands (@see
  // figure 3).

  // The second observation is that if we find a permutation for r=n/φ(n), then
  // we can find the maximum gap x that can be used with nMax to beat that ratio
  // by drawing an horizontal line y=r which at some point x=gap intersects the
  // curve of the function nMax/b(nMax,gap).

  // Helper for b(n,gap). Given n and some gap k, returns [p1, p2] such that
  // p1*p2 = n and p1 + k = p2.
  const p1p2 = (n, k) => {
    // let x, y, x > 0, y >0, and n=(√n+x)*(√n-y) :
    //  n = (√n+x)*(√n-k+x)
    //  n = (√n+x)² - k*(√n+x)
    //  n = n + 2*√n*x + x² - k*√n - k*x
    //  x² + (2*√n-k)*x - k*√n = 0
    //  ax² + bx + c = 0 ⟹ x = (−b ± √(b² − 4ac)) / 2a
    const rt = Math.sqrt(n);
    if (k == 0)
      return [rt, rt];
    const b = 2*rt-k;
    const x = (-b + Math.sqrt(b*b+4*k*rt))/2;
    const y = k-x;
    return [rt-y, rt+x];
  };

  // Continuation of φ(n) for n (product of two primes) given an arbitrary gap.
  const b = (n, gap) => {
    const [rt1, rt2] = p1p2(n, gap);
    return (rt1 - 1)*(rt2 - 1);
  };

  // Find the maximum gap that can be used with nMax to beat the given ratio r.
  const findGap = (r, gap=0) => {
    let r1;
    do r1 = nMax/b(nMax, gap+=2);
    while (r1 < r);
    return gap;
  }

  // Search minimum ratios of n/φ(n) for nMin < n < nMax.
  const search = (nMin) => {
    let rNmin = nMin/a(nMin, 2);  // min ratio reference for nMin
    let gapMax = findGap(rNmin);  // gap for nMax to produce the same ratio

    const [pMin, pMax] = p1p2(nMax, gapMax).map(Math.floor);
    const primes = getPrimes([pMin, pMax+1]);

    let minimum = {n:null, phi:null, r:null};

    for (let i=0, j=primes.length-1, n; i<primes.length; i++) {
      const p1 = primes[i];
      do n = p1 * primes[j];
      while (n > nMax && --j);
      if (p1 >= primes[j])
        break;
      let k = j+1;
      while ((n = p1*primes[--k]) > nMin) {
        if (p1 >= primes[k])
          continue;
        const p2 = primes[k];
        const phi = (p1-1)*(p2-1);
        if (isPermutation(n, phi)) {
          const r = n/phi;
          if (!minimum.r || r < minimum.r)
            minimum = {n, phi, r};
        }
      }
    }

    return minimum;
  }

  // Now, we can finally use arbitrary values to restrict the search, knowing
  // that we are now able to adjust these values depending on found solutions,
  // by doing a second pass we can be sure we won't miss smaller ratios (except
  // in the case the smallest ratio found is greater than nMax/a(nMax, 3)), or
  // if the 2nd pass find a lower ratio, then another adjustment is required as
  // well as an additional pass (which indicates that we can also adjust the
  // input values for the 1st pass).

  // We know the best n candidates are those close to nMax, let's assume we got
  // a solution for n > nMax*8/10.

  const r3 = nMax/a(nMax, 3);
  let rMin = r3;
  let nMin = (8*nMax)/10;
  let minimum;

  while (true) {
    minimum = search(nMin);
    if (!minimum.r || minimum.r >= rMin)
      break;
    rMin = minimum.r;
    nMin = findNmin(minimum.r, minimum.n);
  }

  if (!minimum.r)
    return console.log('-> Need to decrease initial value of nMin');

  if (minimum.r >= r3)
    return console.log('-> Need to bring triples into the mix :/');

  return minimum.n;
}

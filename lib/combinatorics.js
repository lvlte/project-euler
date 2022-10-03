/**
 * Provides math functions related to combinatorics.
 *
 * @file combinatorics.js
 * @module lib/combinatorics.js
 * @author Eric Lavault {@link https://github.com/lvlte}
 * @license MIT
 */

const { factorial, binomialCoef } = require('./math.js');
const { range, memoize, type, isScalar, count, rangeGen } = require('./utils.js');

/**
 * Helper function for making combinations with respect to the type of `set`.
 *
 * @param {*} set
 * @returns {Array}
 */
const _setHelper = (set) => {
  const T = type(set);

  //  make[T](C) returns the combination C in the appropriate [T]ype.
  const make = {
    'Array': C => C,
    'Set': C => new Set(C),
    'String': C => C.join('')
  };

  if (!(T in make))
    throw new TypeError('Invalid argument `set`');

  // append[T].call(C, x) appends x to the combination C.
  const append = {
    'Array': function(x) { this.push(x) },
    'Set': function(x) { this.add(x) },
    // Strings in JS are immutable, use the parent collection for referencing.
    'String': function(x, ref, i) { ref[i] = this + x }
  };

  return [set instanceof Set ? set.size : set.length, make[T], append[T]];
};

let Comb;
module.exports = Comb = {

  /**
   * The number of k-combinations that can be made from a set of n elements.
   *
   * In other words, the number of ways to choose an (unordered) subset of k
   * elements (or k-combinations) from a fixed set of n elements.
   *
   * Also known as the Binomial Coefficient, which is the coefficient of the x^k
   * term in the polynomial expansion of the binomial power (1 + x)^n.
   *
   * @see binomialCoef from math.js
   *
   * @param {(number|bigint)} n
   * @param {(number|bigint)} k
   * @returns {(number|bigint)}
   */
  nChooseK(n, k) {
    return binomialCoef(n, k);
  },

  /**
   * The number of k-multicombinations (k-combinations with repetitions, or
   * multisets of length k) that can be made from a set of n elements.
   *
   * It also corresponds to the multinomial coefficient (n-1, k)!.
   *
   * @param {(number|bigint)} n
   * @param {(number|bigint)} k
   * @returns {(number|bigint)}
   */
  nMultichooseK(n, k) {
    const ONE = globalThis[type(n)](1);
    return Comb.nChooseK(n + k - ONE, k);
  },

  /**
   * Returns combinations of elements from the given set.
   *
   * The output is an array whose elements (the combinations) inherit the type
   * of the input set and are sorted in lexicographic order.
   *
   * If k is a non-negative integer, returns only combinations of length k. If
   * an array or a set of integers, returns k-combinations for every integer k
   * in that collection. If undefined or null, all integers k for 0 ≤ k ≤ |set|
   * are considered (default). Throws otherwise.
   *
   * If multi is true, returns multicombinations (combinations with repetitions
   * allowed).
   *
   * Nb. Combinations are built recursively without positional weighting and are
   * therefore not sorted by size/k but lexicographically (with respect to the
   * input set, ie. ordering of elements in the set matters since it represents
   * the alphabet).
   *
   * @see combinations() Generator producing combinations by order of k/size.
   *
   * @param {(Array|string|Set)} set
   * @param {(number|Iterable<number>)} k
   * @param {boolean} [multi=false]
   * @returns {Array}
   */
  nkCombinations(set, k, multi=false) {
    const [n, make] = _setHelper(set);

    let K = Number.isInteger(k) ? [k] : [...k ?? range(n+1)];
    if (!K.length || K.some(k => !Number.isInteger(k) || k < 0))
      throw new TypeError('Invalid argument `k`');

    K = new Set(multi ? K : K.filter(k => k <= n));

    if (!K.size)
      return [];

    if (n === 0)
      return K.has(0) ? [ make([]) ] : [];

    // In order to prevent a condition test for each combination, we test them
    // up front once for each k, 0 ≤ k < kmax, and build a reversed call stack
    // made of specific calls : instead of one single recursive function, we use
    // two functions to expand the combinations, calling themselves directly or
    // mutually by referring to which is next in the stack, and a third function
    // which is used only for k=kmax, where the recursion ends. This way we only
    // have `kmax` condition tests instead of `nCk₀ + nCk₁ + ... + nCkmax`.

    const C = [];
    const S = [...set];
    const m = multi ? 0 : 1;

    // Add + Expand - Add the given combination to the output and expand it.
    const nckexp = (combi, i) => {
      C.push(make(combi));
      for (let j=i+m, k=combi.length+1; j<n; j++)
        stack[k]([...combi, S[j]], j);
    }

    // Expand only.
    const exp = (combi, i) => {
      for (let j=i+m, k=combi.length+1; j<n; j++)
        stack[k]([...combi, S[j]], j);
    }

    // Add only.
    let nck = combi => C.push(make(combi));

    // When repetition is not allowed, we know nCn has one trivial combination,
    // so if n is member of K we remove it in order to reduce the value of kmax
    // and thus reduce the recursion depth to the second maximum in K, if any.
    if (multi === false && K.delete(n)) {
      if (!K.size)
        return [ make(S) ];
      // The nCn combination must be added at the right (lexicographic) place in
      // the output, so we use a "one-shot" override of nck() on its first call.
      const _nck = nck;
      nck = c => C.push(make(c), make(S)) && (stack[c.length] = _nck);
    }

    const kmax = Math.max(...K);
    const stack = [...range(kmax).map(k => K.has(k) ? nckexp : exp), nck];

    // Initial call, starting with the empty combination (k=0).
    stack[0]([], -m);

    return C;
  },

  /**
   * Generates combinations of elements from the given `set`.
   *
   * Combinations inherit the type of the input set and are ordered by size/k,
   * those of the same size are sorted lexicographically (with respect to the
   * input set, ie. ordering of elements in the set matters since it represents
   * the alphabet).
   *
   * If k is a non-negative integer, yields only combinations of length k. If
   * an array or a set of integers, yields k-combinations for every integer k
   * in that collection. If undefined or null, all integers k for 0 ≤ k ≤ |set|
   * are considered (default). Throws otherwise.
   *
   * If multi is true, yields multicombinations (combinations with repetitions
   * allowed).
   *
   * @see nkCombinations which returns combinations sorted lexicographically.
   *
   * @param {(Array|string|Set)} set
   * @param {(number|Iterable<number>)} k
   * @param {boolean} [multi=false]
   * @yields {(Array|string|Set)}
   */
  * combinations(set, k, multi=false) {
    const [n, make] = _setHelper(set);

    let K = Number.isInteger(k) ? [k] : [...k ?? range(n+1)];
    if (K.some(k => !Number.isInteger(k) || k < 0))
      throw new TypeError('Invalid argument `k`');

    K = new Set(multi ? K : K.filter(k => k <= n));

    if (n === 0) {
      if (K.has(0))
        yield make([]);
      return;
    }

    // Iterative approach using combinations of indexes (not elements). Starting
    // from an initial combination of k indexes, those are shifted/incremented
    // in-place in order to obtain the next combination of length k, and so on.

    const S = [...set];
    const m = multi ? 0 : 1;

    // Helper that returns the first combination of length k.
    const init = multi ? k => Array(k).fill(0) : k => range(k);

    // Shift combi indexes to make it the next k-combination. Return true if
    // successful, false otherwise (when there is no next of that length).
    const next = (combi, i) => {
      if (++combi[i] < n)
        return true;
      let limit = n;
      while (i > 0) {
        if (++combi[--i] < (limit -= m)) {
          let idx = combi[i];
          while (++i < combi.length)
            combi[i] = (idx += m);
          return true;
        }
      }
      return false;
    };

    // Generate combinations according to the order of elements in K.
    for (const k of K) {
      const combi = init(k);
      const i = k-1;
      do yield make(combi.map(i => S[i]));
      while (next(combi, i));
    }
  },

  /**
   * Generates disjoint subset pair combinations from the given set.
   *
   * @param {(Array|string|Set)} set
   * @yields {Array<(Array|string|Set)>}
   */
  * disjointPairs(set) {
    // There are 2^n combinations of a set with n elements, so we can represent
    // each combination with a unique binary number|string of n bits, with each
    // bit indicating whether or not (1 or 0) the corresponding element in the
    // set is present (I call this the "Attendance Sheet" technique, because
    // every binary string is used as an attendance sheet of the members of the
    // set, the combinations are all the possible attendance sheets).

    // This way, we can make the disjoint checks faster : given x and y, two
    // positive integers less than 2^n and such that x < y, we just need to
    // check that (x & y) == 0.

    const [n, make] = _setHelper(set);
    const Cn = 2**n;

    // Reverse the set so that each element has its index i matches the 2^i bit.
    const S = [...set].reverse();

    // Create the combination that corresponds to the binary digits of x.
    const combiFrom = memoize(x => {
      const X = [];
      const A = x.toString(2).padStart(n, '0'); // attendance sheet
      for (let i=0; i<n; i++) {
        (A[i] & 1) && X.unshift(S[i]);
      }
      return make(X);
    });

    // Make disjoint subset pair combinations by checking binary digits of (x&y)
    for (let x=1; x<Cn; x++) {
      for (let y=x+1; y<Cn; y++) {
        if ((x & y) == 0) {
          yield [combiFrom(x), combiFrom(y)];
        }
      }
    }
  },

  /**
   * Generates every permutations of the given set elements.
   * This function uses Heap's algorithm to generate permutations recursively.
   *
   * Basically, in order to produce every possible permutation of the elements
   * exactly once, we perform the following repeatedly from i=[0 to n] (n being
   * the length of the set) :
   *
   * - Recursively generate the (n−1)! permutations of the first n−1 elements,
   *   adjoining the last element to each of these, generating all permutations
   *   that end with the last element.
   *
   * - Then if n is  odd, we switch the first element and the last one,
   *        if n is even, we switch the  i-th element and the last one.
   *
   * @param {array} set
   * @returns {array}
   */
  permute(set) {
    let perm = Array(factorial(set.length));
    let n = set.length;
    let index = 0;
    const _permute = function (n, set, perm) {
      if (n === 1)
        return (perm[index++] = [...set]);
      for (let i=0; i<n; i++) {
        _permute(n - 1, set, perm);
        n % 2 && set.swap(0, n-1) || set.swap(i, n-1);
      }
    }
    _permute(n, set, perm);
    return perm;
  },

  /**
   * Generates only unique permutations of the given set elements (ie. use this
   * function when the set contains multiple occurrences of the same element).
   *
   * @param {array} set
   * @returns {array}
   */
  permuteU(set) {
    let perm = {};
    let n = set.length;
    const _permute = function (n, set, perm) {
      if (n === 1) {
        const p = [...set];
        perm[p.join('')] = p;
        return;
      }
      for (let i=0; i<n; i++) {
        _permute(n - 1, set, perm);
        n % 2 && set.swap(0, n-1) || set.swap(i, n-1);
      }
    }
    _permute(n, set, perm);
    return Object.values(perm);
  },

  /**
   * Returns the number of permutations of the given set S, that is, the number
   * of possible rearrangement of the elements of the ordered list S into a one-
   * to-one correspondence with S itself.
   *
   * If S is a multiset, `distinct` can be set to `true` to count only for the
   * distinct permutations of S.
   *
   * @param {(array|string)} S
   * @param {boolean} [distinct=false]
   * @returns
   */
  nPermutations(S, distinct=false) {
    const p = factorial(S.length);
    if (!distinct || S.length == new Set(S).size)
      return p;
    // Count the number of occurences (or repetitions) of each distinct element,
    // and compute the product of their factorial values (ie. their respective
    // number of permutations, which are identical and need to be cancelled).
    const r = Object.values(count(S));
    const q = r.reduce((prod, n) => prod * factorial(n), 1);
    return p/q;
  },

  /**
   * Returns `true` if x is a permutation of y, `false` otherwise.
   *
   * @param {*} x
   * @param {*} y
   * @returns {boolean}
   */
  isPermutation(x, y) {
    x = [...(isScalar(x) ? ''+x : x)];
    y = [...(isScalar(y) ? ''+y : y)];
    if (x.length != y.length)
      return false;
    return x.sort((a, b) => a-b).join(',') == y.sort((a, b) => a-b).join(',');
  },

  /**
   * Lehmer code purpose is to encode each possible permutation of a sequence
   * of n numbers. It is useful in combinatorics as it provides a scheme for
   * indexing permutations lexicographically by creating and counting inversions
   * (ie. the inversion of a permutation measure how much a sequence is out of
   * its natural order).
   *
   * Returns the lehmer code of the given sequence (which also corresponds to
   * the right inversion count) as an array.
   *
   * @see {@link https://en.wikipedia.org/wiki/Lehmer_code}
   *
   * @param {array<number>} seq
   * @return {array}
   */
  lehmerCode(seq) {
    let code = [...seq];
    for (let i=0; i<code.length; i++) {
      const x = code[i];
      for (let j=i+1; j<code.length; j++) {
        code[j] > x && code[j]--;
      }
    }
    return code;
  },

  /**
   * Stirling number of the second kind / Stirling partition number.
   *
   * Counts the number of ways to partition a set of n objects into exactly k
   * non-empty subsets.
   *
   * @param {number} n
   * @param {number} k
   * @returns {number}
   */
  stirling2(n, k) {
    if (k === 1 || n === k)
      return 1;
    if (k === 0)
      return 0;
    return Comb.stirling2(n-1, k-1) + k*Comb.stirling2(n-1, k);
  },

  /**
   * Associated Stirling number of the second kind.
   *
   * Counts the number of ways to partition a set of n objects into k subsets,
   * with each subset containing at least r elements. It is denoted by Sᵣ(n,k).
   *
   * For example, the 3-associated Stirling number (L. Comtet) or the Stirling
   * number of order 3 (M.Fekete) is the number of partitions of a set with n
   * objects into k blocks, all of cardinality greater than or equal to 3, and
   * is denoted S₃(n,k).
   *
   * @param {number} n
   * @param {number} k
   * @param {number} r
   * @returns {number}
   */
  stirling2A(n, k, r) {
    if (r*k > n)
      return 0;
    if (n == 0 && k == 0)
      return 1;
    return k*Comb.stirling2A(n-1, k, r) + Comb.nChooseK(n-1, r-1) * Comb.stirling2A(n-r, k-1, r);
  },

  /**
   * Bell number
   *
   * The Bell number Bn counts the number of different ways to partition a set
   * of n objects, which is also the number of equivalence relations on it.
   *
   * @param {number} n
   * @returns {number}
   */
  bell(n) {
    let Bn = 0;
    for (let k=0; k<=n; k++)
      Bn += Comb.stirling2(n, k);
    return Bn;
  },

  /**
   * Given n, returns the n-th Catalan number.
   *
   * In combinatorial mathematics, the Catalan numbers are a sequence of natural
   * numbers that occur in various counting problems often involving recursively
   * defined objects. They are commonly denoted Cₙ or C(n).
   *
   * The first Catalan numbers for n = 0, 1, 2, 3, ... are :
   *
   *   1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862, 16796, 58786, ...
   *
   * @see {@link : https://oeis.org/A000108 }
   *
   * @param {number} n
   * @returns {number}
   */
  catalan(n) {
    return factorial(2*n) / (factorial(n+1) * factorial(n));
  },

  /**
   * Generates restrited growth strings in lexicographic order.
   *
   * Used for creating partitions of sets containing n elements.
   *
   * Nb. They are called "strings" but each string is represented as an array.
   *
   * @see {@link : The Art Of Computer Programming - pre-fascicle 3b.pdf}
   *
   * @param {number} n
   * @returns {array}
   */
  growthStr: memoize(function(n) {
    // Based on "Algorithm H" (The Art Of Computer Programming pdf, page 26).
    if (n < 0)
      throw new RangeError('n must be a positive integer');
    if (n === 1)
      return [[0]];
    const S = [];
    const A = Comb.growthStr(n-1);
    // Foreach string from inner iteration, compute m, then for each integer j
    // in [0, m] append j to the string and append the string to the output.
    for (let i=0; i<A.length; i++) {
      let a = A[i];
      let m = 1 + Math.max(...a.slice(0, n-1));
      for (let j=0; j<=m; j++)
        S.push([...a, j]);
    }
    return S;
  }),

  /**
   * Generates the partitions of the given set, that is the grouping of its
   * elements into non-empty disjoint subsets (in such a way that every element
   * is included in exactly one subset).
   *
   * If k is set, generates only partitions with k non-empty subsets.
   *
   * @see {@link : The Art Of Computer Programming - pre-fascicle 3b.pdf}
   *
   * @param {(Array|Set)} set
   * @param {(boolean|number)} k
   * @yields {Array}
   */
  * setPartitions (set, k=false) {
    // @see The Art Of Computer Programming - pre-fascicle 3b.pdf
    // -> `7.2.1.5. Generating all set partitions`

    const [n, make, append] = _setHelper(set);
    if (!n) {
      return;
    }

    const S = [...set];

    if (k !== false) {
      if (!Number.isInteger(k) || k < 0)
        throw new RangeError('`k` must be a positive integer');

      // We don't need growth strings for trivial cases
      if (k === 0 || k > n)
        return;

      if (k === 1) {
        yield [ make(S) ]
        return;
      }

      if (k === n) {
        yield S.map(n => make([n]));
        return;
      }
    }

    // The restricted growth string for a set of n elements is the n-characters
    // string which defines the partition of a set, where each i-th character
    // defines the set block i-th element of a set belongs to.
    let RGS = Comb.growthStr(n);

    if (k) {
      // Keep only partitions with k subsets, that is from the restricted growth
      // strings list generated, keep only those where each digit satisfies the
      // inequality `aᵢ < k` and where at least one digit statisfies `a = k-1`.

      // Create or reuse internal cache (growthStr() is memoized, but filtering
      // can also be costly).
      const key = [n, k].join(',');
      Comb.setPartitions.cache = Comb.setPartitions.cache || {};
      if (!(key in Comb.setPartitions.cache)) {
        const byK = s => s.indexOf(k) === -1 && s.indexOf(k-1) !== -1;
        Comb.setPartitions.cache[key] = RGS.filter(byK);
      }
      RGS = Comb.setPartitions.cache[key];
    }

    // Translate each string to the corresponding partition.
    for (const str of RGS) {
      const P = Array.from(Array(k || Math.max(...str) + 1), () => make([]));
      for (let i=0; i<S.length; i++)
        append.call(P[str[i]], S[i], P, str[i]);
      yield P;
    }
  },

  /**
   * The partition function represents the number of possible partitions of a
   * non-negative integer n, or the number of ways of writing n as a sum of
   * positive integers, where the order of the summands does not matter.
   *
   * Restricted partitions (nb. the function cannot handle both restrictions at
   * the same time: when the number of parts is restricted using `k`, allowed
   * parts are assumed to be unrestricted, whatever the value of `parts`) :
   * - Use parameter `k` to count only for partitions of n into exactly k parts.
   * - OR, use parameter `parts` to restrict the set of summands allowed.
   *
   * The type of the returned value is determined from the type of `n`.
   *
   * @param {(Number|BigInt)} n A non-negative integer.
   * @param {Number} [k] A non-negative integer (or `undefined` or `null`).
   * @param {Iterable<(Number|BigInt)>} [parts] Set of summands to use.
   * @returns {(Number|BigInt)}
   */
  intPartition(n, k, parts) {
    // The idea is to consider the recursive function q(n, x) which corresponds
    // to the sum of the number of partitions of n-x made of parts less than or
    // equal to min(n-x, x), for each part x ∈ S (S is the set of summands to be
    // used), and p(n) as the sum of the q(n, x)'s. We write this as follows (s₁
    // refers to the smallest part in S) :
    //
    //       p(n) = Σ[x∈S]q(n, x)
    //    q(n, x) = Σ[k=s₁,min(n-x,x)]q(n-x, k) for 0 < x < n
    //    q(n, x) = p(0) = 1                    for x = n
    //
    // For example, let's say we want the number of unrestricted partitions of
    // 5, that is, for S = {1, 2, 3, 4, 5}. We have :
    //
    //    p(5) = q(5, 1) + q(5, 2) + q(5, 3) + q(5, 4) + q(5, 5)
    //
    //    q(5, 1) = 1, the partition corresponding to that of q(4, 1) which is
    //    made of four 1's and to which we add up 1 :
    //      (1+1+1+1) + 1
    //
    //    q(5, 2) = 2, partitions corresponding to that of q(3, 1) and q(3, 2),
    //    adding up to 3, and to which we add up 2 :
    //      (1+1+1) + 2
    //        (2+1) + 2
    //
    //    q(5, 3) = 2, partitions corresponding to that of q(2, 1) and q(2, 2),
    //    adding up to 2, and to which we add up 3 :
    //      (1+1) + 3
    //        (2) + 3
    //
    //    q(5, 4) = 1, the partition corresponding to that of q(1, 1) which is
    //    made of 1, and to which we add up 4 :
    //      (1) + 4
    //
    //    q(5, 5) = 1, it corresponds to the empty partition to which we add 5.
    //
    // So we got p(5) = 1 + 2 + 2 + 1 + 1 = 7

    // Instead of proceeding recursively, we can use a dynamic programming
    // approach by going bottom-up :
    //
    //  Let an array P of length n+1.
    //  We set P[0] = 1 and P[i] = 0 for 0 < i <= n
    //
    //  For each part x (the parts must be iterated in ascending order), we add
    //  up to each P[i] for x <= i <= n the value of P[i-x], that is, the number
    //  of restricted partitions of i-x that are made of parts less than / equal
    //  to min(i-x, x), computed in a previous iteration (or corresponding to
    //  P[0]).
    //
    //  At the end of the (x,i) loops, P[i] contains the number of partitions
    //  of i, for 0 <= i <= n (which is not the case for restricted partitions
    //  of n into exactly k parts, @see below).

    // -> Restricted partitions of n into exactly k parts
    //
    // By taking conjugates, the number pₖ(n) of partitions of n into exactly k
    // parts is equal to the number of partitions of n in which the largest part
    // has size k.
    //
    // This means we can do merely the same iterations as described above for
    // computing p(n), breaking as soon as x reaches k. In this case only P[n-k]
    // adds up to P[n], at the end of the loop (ie. from the example above and
    // with k=2, we would only consider q(5, 2), where the largest part has size
    // 2, and which corresponds to the conjugates of 4+1 and 3+2).
    //
    // Nb. The drawback (using conjugates) is that we can compute pₖ(n) only if
    // the set of parts to be used is unrestricted.

    const T = globalThis[type(n)];

    if (T != Number && T != BigInt)
       throw TypeError('intPartition() : invalid argument `n`');

    if (T === Number && !T.isInteger(n) || !Number.isInteger(k ?? 0))
      throw Error('intPartition() : received a non-integer');

    // Type promotion based on n.
    k = Number.isInteger(k) ? T(k) : undefined;
    const zero = T(0);
    const one = T(1);

    if (n < zero || k < zero || k > n || n === zero ^ k === zero)
      return zero;

    if (n === zero && !k || n > zero && (k === one || k === n || k === n-one))
      return one;

    const P = Array(Number(n+one)).fill(zero);
    P[0] = one;

    if (k) {
      const m = n-one;
      for (const x of rangeGen(one, k+one)) {
        for (let i=x; i<=m; i++) {
          P[i] += P[i-x];
        }
      }
      return P[n-k];
    }

    parts = parts ?? rangeGen(one, n+one);
    for (const x of parts) {
      for (let i=x; i<=n; i++) {
        P[i] += P[i-x];
      }
    }

    return P[n];
  }

}

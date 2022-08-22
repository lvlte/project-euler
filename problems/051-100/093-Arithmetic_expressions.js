/**
 * Problem 93 - Arithmetic expressions
 *
 * @see {@link https://projecteuler.net/problem=93}
 *
 * By using each of the digits from the set, {1, 2, 3, 4}, exactly once, and
 * making use of the four arithmetic operations (+, −, *, /) and brackets or
 * parentheses, it is possible to form different positive integer targets.
 *
 * For example,
 *                8 = (4 * (1 + 3)) / 2
 *                14 = 4 * (3 + 1 / 2)
 *                19 = 4 * (2 + 3) − 1
 *                36 = 3 * 4 * (2 + 1)
 *
 * Note that concatenations of the digits, like 12 + 34, are not allowed.
 *
 * Using the set, {1, 2, 3, 4}, it is possible to obtain thirty-one different
 * target numbers of which 36 is the maximum, and each of the numbers 1 to 28
 * can be obtained before encountering the first non-expressible number.
 *
 * Find the set of four distinct digits, a < b < c < d, for which the longest
 * set of consecutive positive integers, 1 to n, can be obtained, giving your
 * answer as a string: abcd.
 */

const { nkCombinations, permute, permuteU } = require('../../lib/combinatorics');
const { range } = require('../../lib/utils');

this.solve = function () {
  // We need to generate 4-digits combinations from the set of digits [1, 9].
  const k = 4;
  const digits = range(1, 10);
  const sets = nkCombinations(digits, k);

  // Permutation keys for the sets of digits, will be used to permute the order
  // of a,b,c,d from every set of digits without calling permute() each time.
  const abcdKeys = permute(range(k));

  // Permutations (order matters) of the different operator combinations.
  const operators = ['+', '-', '*', '/'];
  const operations = nkCombinations(operators, k - 1, true).flatMap(permuteU);

  // Map operator strings to their respective function so that we can then use
  // normal Polish notation (prefix), for example : f['+'](a, b) = a + b
  const f = {
    '+': (x, y) => x + y,
    '-': (x, y) => x - y,
    '*': (x, y) => x * y,
    '/': (x, y) => x / y
  };

  // Check the result x of an expression and store it in the passed-in object
  // if x is a positive integer.
  const check = (x, res) => {
    if (Number.isInteger(x) && x > 0)
      res[x] = x;
  };

  // Consider the following expressions ("." represents any operator) :
  //  (1): ((a . b) . c) . d
  //  (2): (a . (b . c)) . d
  //  (3): a . ((b . c) . d)
  //  (4): a . (b . (c . d))
  //  (5): (a . b) . (c . d)

  // Evaluates all expressions that can be made from the given set of numbers
  // and the given array of operators, adding positive integer result to `res`.
  // Note: Using eval() with a,b,c,d as strings plus brackets is way too slow.
  const compute = (abcd, op, res) => {
    const [a, b, c, d] = abcd;
    const [f1, f2, f3] = [ f[op[0]], f[op[1]], f[op[2]] ];
    check( f3(f2(f1(a, b), c), d), res );       // (1): ((a . b) . c) . d
    if (op.every(o => o == '+' || o == '*')) {
      // If all operators are commuting, since we consider all permutations of
      // the digits abcd and operators, we just need to check (5) except if all
      // operators are the same.
      if (!op.every(o => o == op[0]))
        check( f2(f1(a, b), f3(c, d)), res );   // (5): (a . b) . (c . d)
      return;
    }
    // Otherwise, check the other expressions
    check( f3(f1(a, f2(b, c)), d), res );       // (2): (a . (b . c)) . d
    check( f1(a, f3(f2(b, c), d)), res );       // (3): a . ((b . c) . d)
    check( f1(a, f2(b, f3(c, d))), res );       // (4): a . (b . (c . d))
    check( f2(f1(a, b), f3(c, d)), res );       // (5): (a . b) . (c . d)
  };

  // Will keep track of the best set of digits found so far.
  let best = {
    set: [],
    maxConsecutive: 0
  };

  // For each permutation of the digit combinations, and for each permutation of
  // the different operator combinations, we compute all the expressions that
  // can be made.
  sets.forEach(set => {
    // Store integer results in an object to benefit from the index ordering.
    let results = {};
    abcdKeys.forEach(permKeys => {
      // Permute the set of digits from the precomputed keys.
      const abcd = permKeys.map(key => set[key]);
      operations.forEach(op => compute(abcd, op, results));
    });
    // Count the max number of consecutive integers, 1 to n.
    results = Object.values(results);
    let maxConsecutive = results.length;
    for (let p=0; p<results.length; p++) {
      if (results[p] !== p+1) {
        maxConsecutive = p;
        break;
      }
    }
    if (maxConsecutive > best.maxConsecutive)
      best = { set, maxConsecutive };
  });

  return +best.set.join('');
}

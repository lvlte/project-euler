/**
 * Problem 98 - Anagramic squares
 *
 * @see {@link https://projecteuler.net/problem=98}
 *
 * By replacing each of the letters in the word CARE with 1, 2, 9, and 6
 * respectively, we form a square number: 1296 = 36². What is remarkable is
 * that, by using the same digital substitutions, the anagram, RACE, also forms
 * a square number: 9216 = 96². We shall call CARE (and RACE) a square anagram
 * word pair and specify further that leading zeroes are not permitted, neither
 * may a different letter have the same digital value as another letter.
 *
 * Using p098_words.txt, a 16K text file containing nearly two-thousand common
 * English words, find all the square anagram word pairs (a palindromic word is
 * NOT considered to be an anagram of itself).
 *
 * What is the largest square number formed by any member of such a pair?
 *
 * NOTE: All anagrams formed must be contained in the given text file.
 */

const { nkCombinations } = require('../../lib/combinatorics');
const { load } = require('../../lib/utils');
const words = load('p098_words.txt', false).replace(/"/g, '').split(',');

this.solve = function () {
  // In order to create anagram word pairs, we will first group words by length.
  // Since we need to find the largest square number formed in such pair, we can
  // inspect the group with the longest length first, and if one or more pair is
  // found, then the next groups (with lower word length) can be ignored as they
  // will necessarily produce smaller numbers (ie. with less digits).

  // Then, to find anagramic squares matching a given anagram word pair, we will
  // use restricted growth strings (as used in setPartitions() function). This
  // way, we won't have to create every possible digital substitutions given a
  // pair of words, but only to create a set of squares that match the growth
  // strings of that pair, and, knowing how one word maps to the other, check if
  // the same mapping can transform one square from the set to another one.

  // For example, let's take the word pair ('CARE', 'RACE'). We first need a set
  // of four-digits squares matching one of the pair's restricted growth strings
  // (here both strings are '0123', there is no repetition), and then we can
  // observe the following :
  //
  //   'CARE' is to 'RACE' as '0123' is to '2103'.
  //
  // Then for each square s matching the rgs '0123', we find n such that :
  //
  //   '0123' is to '2103' as s is to n.
  //
  // eg. with s=1296, n=9216 because '0123' is to '2103' as '1296' is to '9216',
  // and (s, n) is an anagramic square pair respectively to ('CARE', 'RACE').
  //

  // Helper for identifying anagrams (words that share the same key are anagrams
  // of one another).
  const wordKey = w => [...w].sort((a, b) => b.charCodeAt(0) - a.charCodeAt(0));

  // Find anagram word pairs given an array of words of the same length.
  const anagramPairs = words => {
    const pairs = [];
    const candidates = {};
    words.forEach(word => {
      const key = wordKey(word);
      candidates[key] = candidates[key] || [];
      candidates[key].push(word);
    });
    for (const key in candidates) {
      if (candidates[key].length > 1)
        pairs.push(...nkCombinations(candidates[key], 2))
    }
    return pairs;
  };

  // Cache mapping words/squares to their respective restricted growth string.
  let RGS = {};
  //  RGS[element] = {
  //    toKey,    -> object mapping digits/characters to their respective keys
  //    fromKey,  -> reverse mapping
  //    str       -> the restricted growth string
  //  }

  // Returns the restricted growth string object of the given element.
  const rGrowthStr = element => {
    if (RGS[element])
      return RGS[element];
    let i = 0;
    let toKey = {};
    const set = [...element];
    const str = set.map(c => {
      if (!(c in toKey))
        toKey[c] = i++;
      return toKey[c];
    }).join('');
    const fromKey = toKey.map((k, v) => [v, k]);
    RGS[element] = { toKey, fromKey, str };
    return RGS[element];
  };

  // Returns the squares in the range [rtMin², rtMax²] matching rgs1 or rgs2.
  const squareMatch = (rgs1, rgs2, rtMin, rtMax) => {
    const matches = new Set();
    let rt = rtMax;
    while (rt >= rtMin) {
      const square = rt*rt;
      const rgs = rGrowthStr(''+square);
      if (rgs.str === rgs1.str || rgs.str === rgs2.str) {
        matches.add(square);
      }
      rt--;
    }
    return matches;
  };

  // Describe how word1 maps to word2 using growth string keys.
  const w1Tow2 = (w1, w2) => {
    const rs1 = rGrowthStr(w1);
    return [...w2].map(c => rs1.toKey[c]);
  };

  // Permute the digits of `square` according to the given growth string `keys`.
  const transform = (square, keys) => {
    const rs1 = rGrowthStr(''+square);
    const t = keys.map(key => rs1.fromKey[key]);
    return Number(t.join(''));
  }

  // Anagramic squares found, pair(s) found are indexed by their highest member.
  let A = {};

  // Find anagramic squares matching the given word pair, and store them in A.
  const anagramicSquare = (pair, rtMin, rtMax) => {
    const [w1, w2] = pair;
    const [rgs1, rgs2] = [rGrowthStr(w1), rGrowthStr(w2)];
    const matches = squareMatch(rgs1, rgs2, rtMin, rtMax);
    if (matches.size > 1) {
      const keys = w1Tow2(w1, w2);
      for (const n1 of matches) {
        const n2 = transform(n1, keys);
        if (matches.has(n2)) {
          const sqmax = Math.max(n1, n2);
          A[sqmax] = A[sqmax] || [];
          A[sqmax].push({ [w1]: n1, [w2]: n2 });
        }
      }
    }
  };

  // 1. Group words by length.
  const groups = {};
  words.forEach(word => {
    groups[word.length] = groups[word.length] || [];
    groups[word.length].push(word);
  });

  // 2. Iterate by word length in descending order so that we can break as soon
  // as a batch of words produces anagramic square pair.
  const lengths = Object.keys(groups);
  for (let i=lengths.length-1; i>=0; i--) {
    const len = lengths[i];
    const rtMax = Math.floor(Math.sqrt(10**len));
    const rtMin = Math.ceil(Math.sqrt(10**(len-1)));
    const pairs = anagramPairs(groups[lengths[i]]);
    for (let j=0; j<pairs.length; j++)
      anagramicSquare(pairs[j], rtMin, rtMax);
    if (Object.values(A).length)
      break;
  }

  // As we use integer keys for A, which are the largest square candidates, they
  // are enumerated in ascending order.
  return +Object.keys(A).last();
}

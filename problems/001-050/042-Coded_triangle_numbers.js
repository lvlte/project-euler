/**
 * Problem 42 - Coded triangle numbers
 *
 * @see {@link https://projecteuler.net/problem=42}
 *
 * The nth term of the sequence of triangle numbers is given by, tn = ½n(n+1);
 * so the first ten triangle numbers are:
 *
 *                  1, 3, 6, 10, 15, 21, 28, 36, 45, 55, ...
 *
 * By converting each letter in a word to a number corresponding to its
 * alphabetical position and adding these values we form a word value. For
 * example, the word value for SKY is 19 + 11 + 25 = 55 = t10. If the word
 * value is a triangle number then we shall call the word a triangle word.
 *
 * Using words.txt (right click and 'Save Link/Target As...'), a 16K text file
 * containing nearly two-thousand common English words, how many are triangle
 * words ?
 */

const { sum } = require('../../lib/math');
const { load } = require('../../lib/utils');
const words = load('p042_words.txt').replace(/"/g, '').split(',');

this.solve = function () {

  // Define t(n)
  const t = n => (n/2)*(n+1);

  // Returns a letter value (the given file contains only uppercased words).
  const offset = 'A'.charCodeAt(0) - 1;
  const letterVal = c => c.charCodeAt(0)-offset;

  // Returns a word's value, summing its letter values.
  const wordVal = word => sum(word.split('').map(c => letterVal(c)));

  // We need to generate triangle numbers, for that we assume the highest word
  // value is 30 times the value of "z" like zzzzzzzzzzzzzzzzzzzzzzz...

  const limit = 30*letterVal('Z');
  let triangles = {};

  let n = 0;
  let tn = 0;
  while (++n && tn < limit) {
    tn = t(n);
    triangles[tn] = tn;
  }

  // Returns whether or not the given word is a triangle word.
  const isTriangle = word => wordVal(word) in triangles;

  // How many words from the list are triangle words.
  let count = 0;
  words.forEach(word => isTriangle(word) && count++);

  return count;
}

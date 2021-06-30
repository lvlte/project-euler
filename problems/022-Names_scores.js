/**
 * Problem 22 - Names scores
 *
 * @see {@link https://projecteuler.net/problem=22}
 *
 * Using names.txt, a 46K text file containing over five-thousand first names,
 * begin by sorting it into alphabetical order. Then working out the alphabetical
 * value for each name, multiply this value by its alphabetical position in the
 * list to obtain a name score.
 *
 * For example, when the list is sorted into alphabetical order, COLIN, which
 * is worth 3 + 15 + 12 + 9 + 14 = 53, is the 938th name in the list. So, COLIN
 * would obtain a score of 938 × 53 = 49714.
 *
 * What is the total of all the name scores in the file?
 */

const { load, sum } = require('../lib/utils');
const names = load('p022_names.txt').replace(/"/g, '').split(',');

this.solve = function () {
  const offset = 'A'.charCodeAt(0) - 1;

  const alphaValue = (char) => char.charCodeAt(0)-offset;
  const score = (name, pos) => pos * sum(name.split('').map(alphaValue));

  const list = names.sort((a, b) => a.localeCompare(b));
  let total = 0;

  for (let i=0; i<list.length; i++) {
    total += score(list[i], i+1);
  }

  return total;
}

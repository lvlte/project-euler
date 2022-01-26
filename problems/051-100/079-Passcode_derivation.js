/**
 * Problem 79 - Passcode derivation
 *
 * @see {@link https://projecteuler.net/problem=79}
 *
 * A common security method used for online banking is to ask the user for three
 * random characters from a passcode. For example, if the passcode was 531278,
 * they may ask for the 2nd, 3rd, and 5th characters; the expected reply would
 * be: 317.
 *
 * The text file, keylog.txt, contains fifty successful login attempts.
 *
 * Given that the three characters are always asked for in order, analyse the
 * file so as to determine the shortest possible secret passcode of unknown
 * length.
 */

const { load, digits, range } = require('../../lib/utils');
let keys = load('p079_keylog.txt');

this.solve = function () {
  // The file contains digits only, with each key having different digits, so
  // it is most likely that the passcode has no repeating digits, which is a
  // common security restriction (even if it actually makes the problem easier
  // here!).
  // So let's assume there are no repeating digits in the passcode....

  // Initialize digits indexes by mapping [0-9] digits range to index -1
  let indexes = range(10).mapToObj(d => [d, -1]);

  // First pass - assign the minimum index (0, 1 or 2) to the digits in use.
  for (let i=0; i<keys.length; i++) {
    keys[i] = digits(keys[i], false);
    keys[i].forEach((digit, index) => {
      indexes[digit] = Math.max(indexes[digit], index);
    });
  }

  // Second pass - adjust indexes according to each ordered key.
  for (const [a, b, c] of keys) {
    if (indexes[a] >= indexes[b])
      indexes[b] = indexes[a] + 1;
    if (indexes[b] >= indexes[c])
      indexes[c] = indexes[b] + 1;
  }

  // Retrieve passcode from digits indexes
  let passcode = [];
  for (const digit in indexes) {
    if (indexes[digit] != -1)
      passcode[indexes[digit]] = digit;
  }

  return +passcode.join('');
}

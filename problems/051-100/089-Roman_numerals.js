/**
 * Problem 89 - Roman numerals
 *
 * @see {@link https://projecteuler.net/problem=89}
 *
 * For a number written in Roman numerals to be considered valid there are basic
 * rules which must be followed. Even though the rules allow some numbers to be
 * expressed in more than one way there is always a "best" way of writing a
 * particular number.
 *
 * For example, it would appear that there are at least six ways of writing the
 * number sixteen:
 *
 *            IIIIIIIIIIIIIIII
 *            VIIIIIIIIIII
 *            VVIIIIII
 *            XIIIIII
 *            VVVI
 *            XVI
 *
 * However, according to the rules only XIIIIII and XVI are valid, and the last
 * example is considered to be the most efficient, as it uses the least number
 * of numerals.
 *
 * The 11K text file, p089_roman.txt contains one thousand numbers written in
 * valid, but not necessarily minimal, Roman numerals;
 * see https://projecteuler.net/about=roman_numerals for the definitive rules
 * for this problem.
 *
 * Find the number of characters saved by writing each of these in their minimal
 * form.
 *
 * Note: You can assume that all the Roman numerals in the file contain no more
 * than four consecutive identical units.
 */

const { load } = require('../../lib/utils');
const romanNumerals = load('p089_roman.txt');

this.solve = function () {
  // In order for a number written in Roman numerals to be considered valid,
  // there are 3 basic rules which must be followed :
  // -> Numerals must be arranged in descending order of size.
  // -> M, C, and X cannot be equalled or exceeded by smaller denominations.
  // -> D, L, and V can each only appear once.

  // The "descending size" rule was introduced to allow the use of subtractive
  // combinations.

  // By medieval times it had become standard practice to avoid more than 3
  // consecutive identical numerals by taking advantage of the more compact
  // subtractive combinations. That is, IV would be written instead of IIII,
  // IX would be used instead of IIIIIIIII or VIIII, and so on.

  // In addition to the 3 rules given above, if subtractive combinations are
  // used then the following 4 rules must be followed :
  // -> Only one I, X, and C can be used as the leading numeral in part of a
  // subtractive pair.
  // -> I can only be placed before V and X.
  // -> X can only be placed before L and C.
  // -> C can only be placed before D and M.

  // Knowing that, we don't need to convert anything but just replace sequences
  // of numerals with more than three consecutive occurences with the proper
  // substractive pairs.

  // Also, it is stated that all the roman numerals in the file are valid and
  // contain no more than four consecutive identical units, which actually makes
  // the problem easier to solve.

  // The numerals allowed to appear more than once are those that can be used as
  // the leading part of a subtractive pair (we map them to the numerals allowed
  // as the trailing part).
  const substrativePairs = {
    I: ['V', 'X'],
    X: ['L', 'C'],
    C: ['D', 'M']
  };

  // Helper that return the given roman numeral number in its minimal form by
  // replacing consecutive numerals with subtractive pairs where possible.
  const minForm = number => {
    // Units occuring more than 3 times consecutively (ignore 'M' since there
    // is no greater value for subtractive pairing).
    const units = number.maxConsecutive().filter((k, v) => v > 3 && k != 'M');

    for (const r in units) {
      // The sequence of r to replace and its index in the given numeral.
      const seq = r.repeat(units[r]);
      const i = number.indexOf(seq);

      const [r1, r2] = substrativePairs[r];

      // Here we know there are 4 consecutive units of r, by default we replace
      // them with the smallest substractive pair.
      let [pattern, replacement] = [seq, r + r1];

      // Except in case where the numeral placed before r is r1 (which cannot be
      // used more than once), then we replace r1+4*r with r2-r.
      if (i > 0 && number[i-1] === r1) {
        [pattern, replacement] = [r1 + seq, r + r2];
      }

      number = number.replace(pattern, replacement);
    }

    return number;
  }

  // Finding the number of characters saved.
  let nCharSaved = 0;
  romanNumerals.forEach(n => nCharSaved += n.length - minForm(n).length);

  return nCharSaved;
}

/**
 * Problem 17 - Number letter counts
 *
 * @see {@link https://projecteuler.net/problem=17}
 *
 * If the numbers 1 to 5 are written out in words: one, two, three, four, five,
 * then there are 3 + 3 + 5 + 4 + 4 = 19 letters used in total.
 *
 * If all the numbers from 1 to 1000 (one thousand) inclusive were written out
 * in words, how many letters would be used?
 *
 * NOTE: Do not count spaces or hyphens. For example, 342 (three hundred and
 * forty-two) contains 23 letters and 115 (one hundred and fifteen) contains
 * 20 letters. The use of "and" when writing out numbers is in compliance with
 * British usage.
 */

this.solve = function () {
  const max = 1000;

  const units = [1,
    'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
    'seventeen', 'eighteen', 'nineteen'
  ];

  const tens = [10,
    'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty',
    'ninety'
  ];

  const hund = [100, n => units[n] + ' hundred'];
  const thou = [1000, n => units[n] + ' thousand'];

  // Maps a base 10 exponent (index) to the corresponding words.
  const map = [units, tens, hund, thou];

  // Maps a base 10 exponent (index) to a linking word.
  const links  = [, '-' , ' and ', ' ' ];

  // Returns n in words
  const words = function (n) {
    if (units[n])
      return units[n];

    const digits = (''+n).split('').map(d => +d);
    let str = '';
    let link;

    for (let i=0; i<digits.length; i++) {
      if (digits[i] === 0)
        continue;

      const digit = digits[i];
      const exp = digits.length-1 - i;

      if (link)
        str += link;
      link = links[exp];

      if (exp === 1 && digit === 1) {
        str += units[ '' + digit + digits[i+1] ];
        break;
      }
      else {
        str += typeof map[exp][1] == 'function' ? map[exp][1](digit) : map[exp][digit];
      }
    }

    return str;
  };

  let n = 0;
  let letterCount = 0;

  while (++n <= max) {
    letterCount += words(n).replace(/\s+|-/g, '').length;
  }

  return letterCount;
}

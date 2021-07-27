/**
 * Problem 59 - XOR decryption
 *
 * @see {@link https://projecteuler.net/problem=}
 *
 * [...]
 *
 * Your task has been made easy, as the encryption key consists of three lower
 * case characters. Using p059_cipher.txt, a file containing the encrypted
 * ASCII codes, and the knowledge that the plain text must contain common
 * English words, decrypt the message and find the sum of the ASCII values
 * in the original text.
 */

const { nkCombinations, permute } = require('../../lib/combinatorics');
const { sum } = require('../../lib/math');
const { load, range } = require('../../lib/utils');

const message = load('p059_cipher.txt').split(',').map(code => +code);

this.solve = function () {
  // Since the key is only made up of three lower case letters, we can decrypt
  // the message by brute force.

  // We just need to generate all possible cipher keys and try each one, then
  // check whether the 'decrypted' message is 'readable' or not.

  // In order to determine if a given string is a valid english text, we will
  // we will use known statistics about the language, particularly the letter
  // distribution (@see http://www.macfreek.nl/memory/Letter_Distribution).

  // The cipher key length
  const k = 3;

  // Will use these char codes
  const space = ' '.charCodeAt(0);
  const a = 'a'.charCodeAt(0);
  const e = 'e'.charCodeAt(0);
  const q = 'q'.charCodeAt(0);
  const z = 'z'.charCodeAt(0);

  // ASCII charset (printable characters)
  const ascii = range(space, 127).mapToObj();

  // Lower case characters
  const alphaLower = range(a, z+1);

  // Generate cipher keys (unique permutations of the k-multicombinations made
  // from the lower case charset).
  let cipherKeys = {};
  nkCombinations(alphaLower, k, true).forEach(combi => {
    permute(combi).forEach(p => cipherKeys[p.join('')] = p);
  });

  // Set min/max ratios according to letter frequencies found in common
  // english text corpus, adding some tolerence.
  const minSpace = 0.15; // 0.1828846265
  const minE = 0.07;     // 0.1026665037
  const maxQ = 0.01;     // 0.0008367550
  const maxZ = 0.01;     // 0.0005128469

  // Allowed characters for letter frequency check
  const allowedChar = c => c == space || c >= a && c <= z;

  // Checks if the given string contains non-printable character.
  const isPrintable = str => {
    for (let i=0; i<str.length; i++) {
      if (!(str[i] in ascii))
        return false;
    }
    return true;
  };

  // Determines whether or not the given str (ascii codes) is readable
  const isReadable = str => {
    if (!isPrintable(str))
      return false;
    // Check letter frequency (lowercased)
    const letters = str.map(c => c|32).filter(allowedChar);
    const freq = letters.occurrences();
    if (freq[space]/str.length < minSpace || freq[e]/str.length < minE)
      return false;
    if ((freq[q] || 0)/str.length > maxQ || (freq[z] || 0)/str.length > maxZ)
      return false;
    return true;
  }

  // XOR decryption using the given cipher key
  const decipher = (msg, key) => msg.map((byte, i) => byte ^ key[i%k]);

  // Brute force...
  let result = 'not found';
  for (const id in cipherKeys) {
    const key = cipherKeys[id];
    const str = decipher(message, key);
    if (isReadable(str)) {
      // console.log({
      //   Key: key.map(c => String.fromCharCode(c)).join(''),
      //   Text: str.map(c => String.fromCharCode(c)).join('')
      // });
      result = sum(str);
      break;
    }
  }

  return result;
}

/**
 * Problem 16 - Power digit sum
 *
 * @see {@link https://projecteuler.net/problem=16}
 *
 * 2¹⁵ = 32768 and the sum of its digits is 3 + 2 + 7 + 6 + 8 = 26.
 *
 * What is the sum of the digits of the number 2¹⁰⁰⁰ ?
 */

const { sum } = require('../lib/utils')

this.solve = () => sum((''+2n**1000n).split('').map(digit => +digit));

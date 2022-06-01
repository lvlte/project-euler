/**
 * Problem 113 - Non-bouncy numbers
 *
 * @see {@link https://projecteuler.net/problem=113}
 *
 * Working from left-to-right if no digit is exceeded by the digit to its left
 * it is called an increasing number; for example, 134468.
 *
 * Similarly if no digit is exceeded by the digit to its right it is called a
 * decreasing number; for example, 66420.
 *
 * We shall call a positive integer that is neither increasing nor decreasing a
 * "bouncy" number; for example, 155349.
 *
 * As n increases, the proportion of bouncy numbers below n increases such that
 * there are only 12951 numbers below one-million that are not bouncy and only
 * 277032 non-bouncy numbers below 10¹⁰.
 *
 * How many numbers below a googol (10¹⁰⁰) are not bouncy?
 */

const { nMultichooseK } = require('../../lib/combinatorics');

this.solve = function () {

  // Let's consider non-bouncy numbers below 1000.

  // We know from the previous problem that there are 525 bouncy and thus 475
  // non-bouncy numbers from 0 to 999.

  // 1. Increasing numbers
  //
  // If we focus on the increasing numbers, we can see they correspond to all
  // k-multicombinations of the set of digits [ 0 to 9 ], with k=3. The key is
  // to consider each number as a unique multi-combination (with repetition
  // allowed) of k digits, including leading zeros. So the number of increasing
  // numbers below one-thousand is ((n; k)), read "n multichoose k", with n=10
  // and k=3, which gives us 220.
  //
  //  `nkCombinations('0123456789', 3, true)` outputs these numbers as 3-digits
  //  strings, in ascending order.
  //
  // To picture the thing, we can format the increasing numbers less than 100 as
  // a right triangle, as follows :
  //
  //    '000', '001', '002', '003', '004', '005', '006', '007', '008', '009'
  //           '011', '012', '013', '014', '015', '016', '017', '018', '019'
  //                  '022', '023', '024', '025', '026', '027', '028', '029'
  //                         '033', '034', '035', '036', '037', '038', '039'
  //                                '044', '045', '046', '047', '048', '049'
  //                                       '055', '056', '057', '058', '059'
  //                                              '066', '067', '068', '069'
  //                                                     '077', '078', '079'
  //                                                            '088', '089'
  //                                                                   '099'
  // '010' is not present as it is a permutation of '001'.
  // '020' and '021' are the permutations of respectively '002' and '021', etc.
  //
  // The second triangle goes as follows :
  //
  //           '111', '112', '113', '114', '115', '116', '117', '118', '119'
  //                  '122', '123', '124', '125', '126', '127', '128', '129'
  //                         '133', '134', '135', '136', '137', '138', '139'
  //                                '144', '145', '146', '147', '148', '149'
  //                                       '155', '156', '157', '158', '159'
  //                                              '166', '167', '168', '169'
  //                                                     '177', '178', '179'
  //                                                            '188', '189'
  //                                                                   '199'
  //
  // The same goes for the 2-to-9 hundreds, with smaller and smaller triangles.
  // The last two are :
  //
  //                                                            '888', '889'
  //                                                                   '899'
  //  and
  //                                                                   '999'

  // 2. Decreasing numbers
  //
  // Now let's consider the decreasing numbers. One might think that there are
  // as many decreasing numbers as there are increasing numbers, since we can
  // reverse any increasing numbers like '123' to get its decreasing counterpart
  // '321', which corresponds to output `nkCombinations('9876543210', 3, true)`.
  // For example if we flip our 000-to-099 triangle, we got :
  //
  //  '900', '800', '700', '600', '500', '400', '300', '200', '100', '000'
  //  '910', '810', '710', '610', '510', '410', '310', '210', '110'
  //  '920', '820', '720', '620', '520', '420', '320', '220'
  //  '930', '830', '730', '630', '530', '430', '330'
  //  '940', '840', '740', '640', '540', '440'
  //  '950', '850', '750', '650', '550'
  //  '960', '860', '760', '660'
  //  '970', '870', '770'
  //  '980', '880'
  //  '990'
  //
  // It works, but we will miss all decreasing numbers with less than k-digits,
  // that is, those corresponding to a k-digits string having leading zero(s),
  // except '000', like :
  //
  //   '010',                (permutation of '100')
  //   '020', '021',         (permutation of '200', '210)
  //   '030', '031', '032',  (permutation of '300', '310', '320')
  //    ... etc.
  //   and the strings with two leading zeros corresponding to numbers from 1
  //   to 9, which should also be considered as decreasing.
  //
  // The trick is to add another zero to our reversed set of digits, or, to
  // prevent any confusion, a character that represent a leading zero, like 'x'.
  //
  // So we shall use the set [x, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].
  //
  //  `nkCombinations('x9876543210', 3, true)` outputs these numbers as 3-digits
  //  strings, in descending order (the function do things in a lexicographic
  //  way, with respect to the order of the input set, the alphabet).
  //
  // The triangle that were missing goes as follows :
  //
  // 'xxx', 'xx9', 'xx8', 'xx7', 'xx6', 'xx5', 'xx4', 'xx3', 'xx2', 'xx1', 'xx0'
  //        'x99', 'x98', 'x97', 'x96', 'x95', 'x94', 'x93', 'x92', 'x91', 'x90'
  //               'x88', 'x87', 'x86', 'x85', 'x84', 'x83', 'x82', 'x81', 'x80'
  //                      'x77', 'x76', 'x75', 'x74', 'x73', 'x72', 'x71', 'x70'
  //                             'x66', 'x65', 'x64', 'x63', 'x62', 'x61', 'x60'
  //                                    'x55', 'x54', 'x53', 'x52', 'x51', 'x50'
  //                                           'x44', 'x43', 'x42', 'x41', 'x40'
  //                                                  'x33', 'x32', 'x31', 'x30'
  //                                                         'x22', 'x21', 'x20'
  //                                                                'x11', 'x10'
  //                                                                       'x00'
  //
  // This means that we will have some extra combinations to discard, that is,
  // the combinations corresponding to the number 0 (already counted as '000')
  // consisting of x's and zeros that don't contain any other (non-zero) digits,
  // eg. for k=3 : 'xxx', 'xx0', 'x00'. There will be k of them, whatever k.
  //
  // So, the number of decreasing numbers below one-thousand is ((n; k)) - k,
  // with n=11 and k=3, which gives us 286 - 3 = 283.

  // 3. Non-bouncy numbers
  //
  // We have formulas for counting increasing and decreasing numbers below 10^k.
  // But numbers consisting of one digit, repeated 1 to k times, are considered
  // both increasing and decreasing, so by summing the counts, we will add them
  // up twice, so we need to figure out how many such numbers are.
  //
  // For k=3, these numbers are :
  //
  //   0,   1,   2,   3,   4,   5,   6,   7,   8,   9,
  //       11,  22,  33,  44,  55,  66,  77,  88,  99,
  //      111, 222, 333, 444, 555, 666, 777, 888, 999.
  //
  // The pattern is pretty obvious, there are 9*k + 1 of them.
  //
  // Finally, we got that the number of non-bouncy numbers below 10^k is equal
  // to :
  //
  //  ((10; k)) + ((11; k)) - k - (9*k + 1)

  // Last thing, the problem states that there are only 12951 numbers below
  // one-million that are not bouncy, and 277032 non-bouncy numbers below 10¹⁰,
  // which offset the count given by the formula above by 1, so they obviously
  // doesn't count the number 0 as non-bouncy and we need to substract an extra
  // one to get the correct answer.

  const n = 10n;
  const k = 100n;

  const increasing = nMultichooseK(n, k);
  const decreasing = nMultichooseK(n+1n, k) - k;
  const both = (n-1n)*k + 1n;

  return increasing + decreasing - both - 1n;
}

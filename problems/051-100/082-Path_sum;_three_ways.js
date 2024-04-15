/**
 * Problem 82 - Path sum: three ways
 *
 * @see {@link https://projecteuler.net/problem=82}
 *
 * NOTE: This problem is a more challenging version of Problem 81.
 *
 * The minimal path sum in the 5 by 5 matrix below, by starting in any cell in
 * the left column and finishing in any cell in the right column, and only
 * moving up, down, and right, is indicated between <>, the sum is equal to 994.
 *
 *       131   673  <234> <103> < 18>
 *      <201> < 96> <342>  965   150
 *       630   803   746   422   111
 *       537   699   497   121   956
 *       805   732   524    37   331
 *
 * Find the minimal path sum from the left column to the right column in file
 * p082_matrix.txt, a 31K text file containing an 80 by 80 matrix.
 */

const { load } = require('../../lib/utils');
const data = load('p082_matrix.txt');
const matrix = data.map(r => r.split(',').map(n => +n));

this.solve = function () {
/**
 * We can still use dynamic programming here :
 * - If we were given only one column we would just take the cell that contains
 *   the minimum number, easy. This has to be the last step.
 * - So we need to break down the problem by columns so that in the end we have
 *   reduced all of them to a single one containing the minimum path sums.
 * - The problem now is to "merge" two columns into one repeatedly, starting
 *   from the last ones.
 *
 * So let's consider only the two last colums from the example and let's say we
 * are only allowed horizontal moves to simplify :
 *
 *        103  |   18    ->    121
 *        965  |  150    ->   1115
 *        422  |  111    ->    533
 *        121  |  956    ->   1077
 *         37  |  331    ->    368
 *
 * For example, moving through the cell <121> will cost 121+956 in the end so we
 * just update the value of that cell accordingly, easy.
 *
 * Now if were also allowed to go down, we would have to consider the fact that
 * <121+956> is actually greater than <121+37+331>, then the minimum cost of
 * moving through the cell <121> would become <121+37+331=489>.
 *
 * One important thing to note is that we can only evaluate the cost of moving
 * in two directions from a given cell at one time (ie. a vertical move goes
 * either up or down, it makes no sense to go back), so we will have to run two
 * passes for each column, one for right/up moves and the other for right/down
 * moves. The tricky part is then to consider both of them.
 *
 * For that, we will need a "working column", initialized with values from the
 * right one. At the end of the two passes, the left column is replaced with the
 * minimum path sums computed so far, and the right one can be discarded.
 *
 * The second thing is that when checking down moves, we need to go from the
 * bottom up, and conversely, so that at each step we consider updated values,
 * as we do for columns (this is what dynamic programming is all about).
 *
 * 1. Right/Up moves (traversing column down) :
 *
 *    Starting with cell <103> we can only go horizontally to <18>, which will
 *    eventually cost 103+18=121, then we replace <103> by <121> in the working
 *    column :
 *
 *     <103> |   18    ->   <121>
 *
 *    Then, from <965> we can go up to <103> or right to <150>. We already know
 *    that the minimum path sum going through <103> is <121>, so we just need to
 *    compare vertical vs horizontal sums and update the cell with the minimum,
 *    here the vertical move (v) is better :
 *
 *      121  |  ...    ->     121
 *     <965> |  150    ->   <1086>     (v) 121 < 150,  965 + 121 = 1086
 *
 *    Continuing with <422>, we got :
 *
 *     1086  |  ...    ->    1086
 *     <422> |  111    ->    <533>     (h) 111 < 1086, 422 + 111 = 533
 *
 *    And so on... at the end of the first pass, our working column is updated
 *    with the (intermediary) minimum path sums :
 *
 *      103  |   18    ->     121      (h)              103 +  18 = 121
 *      965  |  150    ->    1086      (v) 121 < 150 ,  965 + 121 = 1086
 *      422  |  111    ->     533      (h) 111 < 1086,  422 + 111 = 533
 *      121  |  956    ->     654      (v) 533 < 956 ,  121 + 533 = 654
 *       37  |  331    ->     368      (h) 331 < 654 ,   37 + 331 = 368
 *
 * 2. Right/Down moves (traversing column up) :
 *
 *    For this step, the right column can be ignored since our working column
 *    already contains the minimum path sums that take account of horizontal
 *    moves. All we need is to compare values from the left column (in its
 *    original state) with those from our working column (on the right).
 *
 *    Starting with cell <37> we can only go horizontally to <331>, the path sum
 *    is already computed in the corresponding cell of the working column. We
 *    can now update the cell of our left column with its final value (368) :
 *
 *     <37>  |  368    ->    <368>
 *
 *    Then, from <121> we can go down to <37> which will eventually cost <368>
 *    as we just saw, or we can do an up/right move for which the minimum path
 *    is somehow already computed in our working column, here the v-down (v)
 *    move is better than the other move previously tested (p) :
 *
 *     <121> |  654    ->    <489>    (v) 121 + 368 = 489 < 654 = 121 + 533
 *      368  |  ...
 *
 *    Continuing with <422>, we got :
 *
 *     <422> |  533    ->    <533>    (p) 422 + 489 > 533
 *      489  |  ...
 *
 *    And so on... at the end of the second pass, our left column is updated
 *    with the minimum path sums :
 *
 *      103  |  121    ->     121     (p) 103 + 1086 > 121
 *      965  | 1086    ->    1086     (p) 965 + 533 > 1086
 *      422  |  533    ->     533     (p) 422 + 489 > 533
 *      121  |  654    ->     489     (v) 121 + 368 = 489 < 654
 *       37  |  368    ->     368     (p)
 *
 * Now we can discard the right column and repeat the process with the updated
 * column and its left neighbour :
 *
 *                      v     v                      v     v
 *   131   673   234   103    18   ->   131   673   234   121   xxx
 *   201    96   342   965   150   ->   201    96   342  1086   xxx
 *   630   803   746   422   111   ->   630   803   746   533   xxx
 *   537   699   497   121   956   ->   537   699   497   489   xxx
 *   805   732   524    37   331   ->   805   732   524   368   xxx
 */

  // Init (working column) path sums with values from the last column.
  let pathSums = matrix.map(r => r.at(-1));

  // Start with column before last.
  for (let i=matrix.length-2; i>=0; i--) {

    // 1. Traverse down
    pathSums[0] += matrix[0][i];
    for (let j=1; j<matrix.length; j++) {
      const h = matrix[j][i] + pathSums[j];
      const v = matrix[j][i] + pathSums[j-1];
      pathSums[j] = Math.min(h, v);
    }

    // 2. Traverse up
    for (let j=matrix.length-2; j>=0; j--) {
      const v = matrix[j][i] + pathSums[j+1];
      pathSums[j] = Math.min(pathSums[j], v);
    }
  }

  return Math.min(...pathSums);
}

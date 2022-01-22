/**
 * SuDoku solver.
 *
 * @file sudoku.js
 * @module lib/sudoku.js
 * @author Eric Lavault {@link https://github.com/lvlte}
 * @license MIT
 */

module.exports = class Sudoku {

  static set = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  constructor (grid) {
    this.inputGrid = grid;

    this.rows = [...grid];
    this.cols = Sudoku.set.map(() => Array(9));
    this.boxs = Sudoku.set.map(() => Array(9));

    for (let i=0; i<9; i++) {
      for (let j=0; j<9; j++) {
        this.cols[j][i] = grid[i][j];
        this.getBox(i, j)[this.innerIdx(i, j)] = grid[i][j];
      }
    }

    // Reference
    this.grid = this.rows;

    this.candidates = {};
    this.solved = false;
  }

  /**
   * Static helper. Returns the difference between set A and B, all the entries
   * from A that are not present in B.
   */
  static diff (A, B) {
    return A.filter(x => B.indexOf(x) === -1);
  }

  /**
   * Returns the elements of the box to which the number grid[i][j] belongs to.
   */
  getBox (i, j) {
    const k = Math.floor(j/3) + Math.floor(i/3)*3;
    return this.boxs[k];
  }

  /**
   * Returns the (box) inner index of the number grid[i][j].
   */
  innerIdx (i, j) {
    return (i%3)*3 + j%3;
  }

  /**
   * Returns the possible number candidates that could fit in grid[i][j].
   */
  findCandidates (i, j) {
    return Sudoku.diff(
      Sudoku.diff( Sudoku.diff(Sudoku.set, this.rows[i]), this.cols[j] ),
      this.getBox(i,j)
    );
  }

  /**
   * Assign the number n into the grid and the working rows/columns/box at the
   * given index.
   */
  update (i, j, n) {
    this.rows[i][j] = n;
    this.cols[j][i] = n;
    this.getBox(i, j)[this.innerIdx(i, j)] = n;
  }

  /**
   * Return the grid solved, or false if unsolvable.
   */
  solve () {
    // First passes (no guessing)
    let found;
    do { found = this.firstPass() }
    while (found === true);

    if (!this.solved)
      this.guess();

    return this.solved && this.grid;
  }

  /**
   * Fill the gaps where possible, with no guessing, and return a boolean which
   * indicates whether or not one or more number were found.
   */
  firstPass () {
    let foundSome = false;
    let missedSome = false;

    for (let i=0; i<9; i++) {
      for (let j=0; j<9; j++) {
        if (this.grid[i][j] > 0)
          continue;
        const candidates = this.findCandidates(i, j);
        if (candidates.length === 1) {
          this.update(i, j, candidates[0]);
          foundSome = true;
        }
        else missedSome = true;
      }
    }

    if (missedSome === false)
      this.solved = true;

    return foundSome;
  }

  /**
   * Guess and try possible number candidates recursively (backtracking).
   * Returns true if successful, false otherwise.
   */
  guess (istart=0, jstart=0)  {
    let grid = this.rows;

    // Iterate each cell reading left to right, top to bottom.
    for (let i=istart; i<9; i++) {
      for (let j=jstart; j<9; j++) {
        if (grid[i][j] > 0)
          continue;

        let candidates = this.findCandidates(i, j);
        if (candidates.length === 0)
          return false; // the chain of candidates is wrong, or grid unsolvable.

        // Let's try each candidates
        for (let k=0; k<candidates.length; k++) {
          // This is like creating a branch in a tree of possibilities.
          this.update(i, j, candidates[k]);
          // Try to solve recursively within this branch, using candidates[k].
          if (this.guess(i, j)) {
            // That branch reached the end of the grid with all guesses true.
            return true;
          }
          // else we are in the wrong branch, try next candidate.
        }

        // Reaching this point means no candidate fit in that branch, so the
        // parent candidate is wrong, or the grid is unsolvable if root call.
        this.update(i, j, 0);
        return false;
      }

      // Reset j index start for next rows.
      jstart = 0;
    }

    // Reaching this point means the grid is solved.
    this.solved = true;

    return true;
  }
}

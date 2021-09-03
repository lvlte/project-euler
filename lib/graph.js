/**
 * Provides functions related to graph theory.
 *
 * @file graph.js
 * @module lib/graph.js
 * @author Eric Lavault {@link https://github.com/lvlte}
 * @license MIT
 */

let Graph;
module.exports = Graph = {

  /**
   * Helper that transforms the given grid into an adjacency list graph, such
   * that each cell becomes a vertex connected to its neigbour cells (up, down,
   * left, or right, ie. no diagonal) by edges whose weights correspond to the
   * values of these cells in the grid.
   *
   * Returns the adjacency list graph along with its distance matrix.
   *
   * Nb: The distance matrix is not a square matrix but has the same structure
   * as the graph to avoid unnecessary space use. Given two connected vertices
   * v1 and v2, the corresponding edge weight can be retrieved in the distance
   * matrix at index v1,v2 (DistanceMatrix[v1][v2]).
   *
   * @param {array} grid
   * @returns {array} [ AdjacencyList, DistanceMatrix ]
   */
  adjListFromGrid(grid) {
    const size = grid.length;

    let graph = Array(size*size);
    let distMx = Array(size*size);

    // For each vertex v (index=i*j), store an array of all the vertices
    // adjacent to it.

    // Index i,j start at 1 and stop before last to prevent 4 conditions in loop
    // so we will need to populate 1st and last rows/columns.
    for (let i=1, k=size-1; i<k; i++) {
      for (let j=1; j<k; j++) {
        // Adjacent vertices [ up, left, down, right ] at current index.
        const index = i*size + j;
        graph[index] = [index-size, index-1, index+size, index+1];
        distMx[index] = [grid[i-1][j], grid[i][j-1], grid[i+1][j], grid[i][j+1]];
      }
    }

    // Populates 1st/last rows and columns, except corners.
    for (let i=1, k=size-1, index; i<k; i++) {
      // 1st row
      graph[i] = [i-1, i+size, i+1]; // [ left, down, right ]
      distMx[i] = [grid[0][i-1], grid[1][i], grid[0][i+1]];

      // last row
      index = size*k+i;
      graph[index] = [index-1, index-size, index+1]; //  [ left, up, right ]
      distMx[index] = [grid[k][i-1], grid[k-1][i], grid[k][i+1]];

      // 1st column
      index = i*size;
      graph[index] = [index-size, index+size, index+1]; //  [ up, down, right ]
      distMx[index] = [grid[i-1][0], grid[i+1][0], grid[i][1]];

      // last column
      index += size-1;
      graph[index] = [index-1, index-size, index+size]; // [ left, up, down ]
      distMx[index] = [grid[i][k-1], grid[i-1][k], grid[i+1][k]];
    }

    // Now populates corner vertices
    let index;
    const k = size-1;

    // First vertex (0,0), up/left corner : adj. [ right, down ]
    graph[0] = [1, size];
    distMx[0] = [grid[0][1], grid[1][0]];

    // up/right corner : adj. [ left, down ]
    graph[k] = [k-1, k+size];
    distMx[k] = [grid[0][k-1], grid[1][k]];

    // down/left corner : adj. [ up, right ]
    index = size*k;
    graph[index] = [index-size, index+1];
    distMx[index] = [grid[k-1][0], grid[k][1]];

    // down/right corner : adj. [ left, up ]
    index = size*size -1;
    graph[index] = [index-1, index-size];
    distMx[index] = [grid[k][k-1], grid[k-1][k]];

    return [graph, distMx];
  },


}



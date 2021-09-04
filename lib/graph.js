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
        const dist = [grid[i-1][j], grid[i][j-1], grid[i+1][j], grid[i][j+1]];
        distMx[index] = graph[index].mapToObj((i, j) => [i, dist[j]]);
      }
    }

    // Populates 1st/last rows and columns, except corners.
    for (let i=1, k=size-1, index, dist; i<k; i++) {
      // 1st row
      graph[i] = [i-1, i+size, i+1]; // [ left, down, right ]
      dist = [grid[0][i-1], grid[1][i], grid[0][i+1]];
      distMx[i] = graph[i].mapToObj((i, j) => [i, dist[j]]);

      // last row
      index = size*k+i;
      graph[index] = [index-1, index-size, index+1]; //  [ left, up, right ]
      dist = [grid[k][i-1], grid[k-1][i], grid[k][i+1]];
      distMx[index] = graph[index].mapToObj((i, j) => [i, dist[j]]);

      // 1st column
      index = i*size;
      graph[index] = [index-size, index+size, index+1]; //  [ up, down, right ]
      dist = [grid[i-1][0], grid[i+1][0], grid[i][1]];
      distMx[index] = graph[index].mapToObj((i, j) => [i, dist[j]]);

      // last column
      index += size-1;
      graph[index] = [index-1, index-size, index+size]; // [ left, up, down ]
      dist = [grid[i][k-1], grid[i-1][k], grid[i+1][k]];
      distMx[index] = graph[index].mapToObj((i, j) => [i, dist[j]]);
    }

    // Now populates corner vertices
    let index, dist;
    const k = size-1;

    // First vertex (0,0), up/left corner : adj. [ right, down ]
    graph[0] = [1, size];
    dist = [grid[0][1], grid[1][0]];
    distMx[0] = graph[0].mapToObj((i, j) => [i, dist[j]]);

    // up/right corner : adj. [ left, down ]
    graph[k] = [k-1, k+size];
    dist = [grid[0][k-1], grid[1][k]];
    distMx[k] = graph[k].mapToObj((i, j) => [i, dist[j]]);

    // down/left corner : adj. [ up, right ]
    index = size*k;
    graph[index] = [index-size, index+1];
    dist = [grid[k-1][0], grid[k][1]];
    distMx[index] = graph[index].mapToObj((i, j) => [i, dist[j]]);

    // down/right corner : adj. [ left, up ]
    index = size*size -1;
    graph[index] = [index-1, index-size];
    dist = [grid[k][k-1], grid[k-1][k]];
    distMx[index] = graph[index].mapToObj((i, j) => [i, dist[j]]);

    return [graph, distMx];
  },

  /**
   * Dijkstra's algorithm implementation.
   *
   * Finds the shortest path between source and target nodes in the given graph.
   *
   * The graph structure is expected to be an array of adjacency lists, whose
   * indexes represent node incremental identifiers and such that each vertex
   * is mapped to an array containing all the vertices (identifiers) adjacent
   * to it.
   *
   * A function callback must be provided for computing the tentative distance
   * to vertex v2 through vextex v1, given v1, v2 and the distance currently
   * assigned to v1.
   *
   * Returns an array [dist, path], with `dist` an array of the distance path
   * sums (from initial to total distance), and `path` an array that can be
   * traversed by reverse iteration to read the shortest path from source to
   * target.
   *
   * @see Graph_Representations: https://www.khanacademy.org/computing/computer-science/algorithms/graph-representation/a/representing-graphs
   *
   * @param {array} graph Graph to search for shortest path.
   * @param {number} source (index/id of the) source node.
   * @param {number} target (index/id of the) target node.
   * @param {function} distance Tentative distance function callback.
   * @param {number} [initD = 0] Initial distance.
   * @return {array} An array containing [dist, path] as described above.
   */
  dijkstra (graph, source, target, distance, initD=0) {
    let dist = [];
    let path = [];

    // We use two different structures to track unvisited nodes in order to
    // optimize findMin() a little (we would need to implement some heap or
    // priority queue to do better).
    let unvisited = []; // the set of unvisited nodes
    let unvisDist = {}; // map unvisited to their current tentative distance

    // Returns the unvisited node having the smallest tentative distance.
    const findMin = (U, D) => U[D.indexOf(Math.min(...D))];

    for (let vertex=0; vertex<graph.length; vertex++) {
      // Initial distance and path values.
      dist[vertex] = Infinity;
      path[vertex] = null;

      // Mark all nodes as unvisited.
      unvisited[vertex] = vertex;
      unvisDist[vertex] = dist[vertex];
    }

    // Initial node distance
    dist[source] = initD;
    unvisDist[source] = initD;

    // The current node
    let v1 = source;

    while (unvisDist[v1] < Infinity && v1 !== target) {
      // Foreach unvisited adjacent vertices of vertex v1
      graph[v1].filter(v2 => v2 in unvisDist).forEach(v2 => {
        // Tentative distance to v2 through v1 (update if smaller than current)
        const d = distance(v1, v2, dist[v1]);
        if (d < dist[v2]) {
          dist[v2] = d;
          unvisDist[v2] = d;
          path[v2] = v1;    // coming to v2 from v1
        }
      });

      // Remove v1 from unvisited (a visited node will never be checked again)
      unvisited.splice(unvisited.indexOf(v1), 1);
      delete unvisDist[v1];

      // Select the unvisited node that is marked with the smallest tentative
      // distance for the next iteration.
      v1 = findMin(unvisited, Object.values(unvisDist));
    }

    return [dist, path];
  },


}



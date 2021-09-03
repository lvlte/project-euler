/**
 * Problem 83 - Path sum: four ways
 *
 * @see {@link https://projecteuler.net/problem=83}
 *
 * In the 5 by 5 matrix below, the minimal path sum from the top left to the
 * bottom right, by moving left, right, up, and down, is indicated in between
 * < > and is equal to 2297.
 *
 *      <131>  673  <234> <103> < 18>
 *      <201> < 96> <342>  965  <150>
 *       630   803   746  <422> <111>
 *       537   699   497  <121>  956
 *       805   732   524  < 37> <331>
 *
 * Find the minimal path sum from the top left to the bottom right by moving
 * left, right, up, and down in p083_matrix.txt, a 31K text file containing an
 * 80 by 80 matrix.
 */

const { adjListFromGrid } = require('../../lib/graph');
const { load } = require('../../lib/utils');
const data = load('p083_matrix.txt').split(/\r\n|\n/);
// const matrix = data.filter(l => l).map(r => r.split(',').map(n => +n));

this.solve = function () {
  // This is known as a "Shortest path problem".
  // @see https://en.wikipedia.org/wiki/Shortest_path_problem

  // In graph theory, the shortest path problem is the problem of finding a path
  // between two vertices (or nodes) in a graph such that the sum of the weights
  // of its constituent edges is minimized.

  // In graph-theoretic applications, the elements are more often referred to as
  // points, nodes or vertices. Other common terms :
  //  - intersection = vertex
  //  - road         = edge
  //  - map          = graph

  // We need to transform our matrix into a graph such that each cell becomes a
  // vertex and has an edge to the cell above, below, and to the right.

  // Then we can use a shortest path algorithm, the most commonly used are :
  // - Dijkstra's original algorithm
  //    https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
  // - A* search algorithm (basically Dijkstra's with an heuristic function)
  //    http://csis.pace.edu/~benjamin/teaching/cs627/webfiles/Astar.pdf

  // How to represent graph ?
  // https://www.khanacademy.org/computing/computer-science/algorithms/graph-representation/a/representing-graphs

  // We will represent our graph as an adjacency list, such that each vertex v
  // is mapped to a list of all the vertices adjacent to it.

  const matrix = [
    [131, 673, 234, 103, 18],
    [201, 96, 342, 965, 150],
    [630, 803, 746, 422, 111],
    [537, 699, 497, 121, 956],
    [805, 732, 524, 37, 331]
  ];

  const [graph, distMx] = adjListFromGrid(matrix);

  console.log(graph);
  console.log(graph.length);

  console.log(distMx);
  console.log(distMx.length);
}

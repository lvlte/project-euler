/**
 * Problem 107 - Minimal network
 *
 * @see {@link https://projecteuler.net/problem=107}
 *
 * The following undirected network consists of seven vertices and twelve edges
 * with a total weight of 243.
 *
 *                         20
 *                    B ------- E
 *                   / \       / \
 *                16/   \17 18/   \11
 *                 /     \   /     \
 *                /  21   \ /   23  \
 *               A ------- D ------- G
 *                \       / \       /
 *               12\   28/   \19   /27
 *                  \   /     \   /
 *                   \ /       \ /
 *                    C ------- F
 *                         31
 *
 * The same network can be represented by the matrix below:
 *
 *               A   B   C   D   E   F   G
 *           A  -   16  12  21  -   -   -
 *           B  16  -   -   17  20  -   -
 *           C  12  -   -   28  -   31  -
 *           D  21  17  28  -   18  19  23
 *           E  -   20  -   18  -   -   11
 *           F  -   -   31  19  -   -   27
 *           G  -   -   -   23  11  27  -
 *
 * However, it is possible to optimise the network by removing some edges and
 * still ensure that all points on the network remain connected. The network
 * which achieves the maximum saving is shown below. It has a weight of 93,
 * representing a saving of 243 − 93 = 150 from the original network.
 *
 *                    B         E
 *                   / \       / \
 *                16/   \     /   \11
 *                 /   17\   /18   \
 *                /       \ /       \
 *               A         D         G
 *                \         \
 *               12\         \19
 *                  \         \
 *                   \         \
 *                    C         F
 *
 * Using p107_network.txt, a 6K text file containing a network with 40 vertices,
 * and given in matrix form, find the maximum saving which can be achieved by
 * removing redundant edges whilst ensuring that the network remains connected.
 */

const { MST } = require('../../lib/graph');
const { load } = require('../../lib/utils');

this.solve = function () {
  const M = load('p107_network.txt').map(line => line.split(',').map(Number));

  // What we are trying to find is a Minimum Spanning Tree, that is a subset of
  // the edges of a connected, edge-weighted undirected graph that connects all
  // the vertices together, without any cycles and with the minimum possible
  // total edge weight.

  // Several MST Algorithms :
  // - Jarník (or Prim–Jarník, Prim–Dijkstra, DJP)
  // - Kruskal (seems the simplest to understand and implement)
  // - Boruvka (cross between Prim's and Kruskal's)
  // - Chazelle (best one, requires Chazelle soft heap)

  // Using Kruskal's algorithm.
  const T = MST(M, true);
  const saving = T.inputWeight - T.minWeight;

  return saving;
}

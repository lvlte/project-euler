/**
 * Problem 84 - Monopoly odds
 *
 * @see {@link https://projecteuler.net/problem=84}
 *
 * In the game, Monopoly, [...]
 *
 * A player starts on the GO square and adds the scores on two 6-sided dice to
 * determine the number of squares they advance in a clockwise direction.
 *
 * Without any further rules we would expect to visit each square with equal
 * probability: 2.5%. However, landing on G2J (Go To Jail), CC (community chest)
 * and CH (chance) changes this distribution.
 *
 * In addition to G2J, and one card from each of CC and CH, that orders the
 * player to go directly to jail, if a player rolls three consecutive doubles,
 * they do not advance the result of their 3rd roll. Instead they proceed
 * directly to jail.
 *
 * At the beginning of the game, the CC and CH cards are shuffled. When a player
 * lands on CC or CH they take a card from the top of the respective pile and,
 * after following the instructions, it is returned to the bottom of the pile.
 * There are sixteen cards in each pile, but for the purpose of this problem we
 * are only concerned with cards that order a movement; any instruction not
 * concerned with movement will be ignored and the player will remain on the
 * CC/CH square.
 *
 * - Community Chest (2/16 cards)
 *    1. Advance to GO
 *    2. Go to JAIL
 *
 * - Chance (10/16 cards)
 *    1. Advance to GO
 *    2. Go to JAIL
 *    3. Go to C1
 *    4. Go to E3
 *    5. Go to H2
 *    6. Go to R1
 *    7. Go to next R (railway company)
 *    8. Go to next R
 *    9. Go to next U (utility company)
 *   10. Go back 3 squares.
 *
 * The heart of this problem concerns the likelihood of visiting a particular
 * square. That is, the probability of finishing at that square after a roll.
 * For this reason it should be clear that, with the exception of G2J for which
 * the probability of finishing on it is zero, the CH squares will have the
 * lowest probabilities, as 5/8 request a movement to another square, and it
 * is the final square that the player finishes at on each roll that we are
 * interested in.
 *
 * We shall make no distinction between "Just Visiting" and being sent to JAIL,
 * and we shall also ignore the rule about requiring a double to get out of jail
 * assuming that they pay to get out on their next turn.
 *
 * By starting at GO and numbering the squares sequentially from 00 to 39 we can
 * concatenate these two-digit numbers to produce strings that correspond with
 * sets of squares.
 *
 * Statistically it can be shown that the three most popular squares, in order,
 * are :
 *  1. JAIL (6.24%) = Square 10
 *  2. E3   (3.18%) = Square 24
 *  3. GO   (3.09%) = Square 00
 *
 * So these three most popular squares can be listed with the six-digit modal
 * string: 102400.
 *
 * If, instead of using two 6-sided dice, two 4-sided dice are used, find the
 * six-digit modal string.
 */

const { nkCombinations, nPermutations } = require('../../lib/combinatorics');
const { sum, rowReduct, remZero, addF } = require('../../lib/math');
const { range } = require('../../lib/utils');

this.solve = function () {

  /**
   * Markovian process
   *
   * @see {@link https://brilliant.org/wiki/markov-chains/}
   * @see {@link https://math.dartmouth.edu/~prob/prob/prob.pdf
   *   Grinstead and Snell’s Introduction to Probability - Chapter 11 }
   */

  // We can see the monopoly as a Markov process :

  // When the outcome of a given experiment (ie. rolling dices and move to x)
  // can affect the outcome of the next experiment, we are oftenly dealing with
  // what is called a Markov chain.

  // A Markov process (also called Markov chain) is a system having a set of
  // states, which starts in one of these states and moves successively from
  // one state to another, and for which the "transition probability" pᵢⱼ of
  // moving from state i to state j does not depend on the states the chain was
  // in before, but only on i and j (cf. Markov property).

  // Mathematically speaking, a Markov chain is a collection of probability
  // vectors which can be represented in a stochastic matrix (each row of the
  // matrix is a probability vector, the sum of its entries adding up to 1).
  // "Stochastic", because such process involves some variables changing at a
  // random rate through time according to certain probabilistic rules.

  // So here we can think of having 40 states, one for each square position.

  // The problem is that the rule about consecutive doubles makes the process
  // non markovian, or rather not completely.

  // In order to make it markovian, we shall consider a square position not as
  // one state but three distinct states, as we can move from that position
  // having rolled either 0, 1, or 2 consecutive doubles.

  // A state (from) 'square i after 2 consecutive doubles' always transitions
  // into a state (to) 'square j after 0 consecutive doubles', because either
  // the player makes a third double and lands in jail, either he doesn't and
  // moves according to the dices (and cards if any), the roll consecutiveness
  // is "reset" in both cases.

  // So we have to deal with 120 states instead of 40.


  /**
   * Step 1 - Transition probabilities matrix
   */

  // Frome there we can build a "transition matrix", that is, a square matrix of
  // 120x120 variables that will allow to read any possible state transitions.
  // Each row is a probability vector (from state i we can move to state j₀ with
  // probability p₀, j₁ with p₁, etc...), but the point of the matrix is to read
  // it by column to work out the probabilities of landing on a given state (we
  // can move to state j with probability p₀ starting from i₀, p₁ from i₁, ...)
  // given some initial state.

  // Well, this is after one roll only, there is actually one transition matrix
  // per turn, we can get the probabilities of landing on a particular square
  // after n turns by recursion. @see function pn(n, j).

  // We could try to use such function with a very big n and see if it yields
  // precise results in a reasonable time, but it appears that we can also work
  // out the limit frequencies of all states when n tends to infinity, that is,
  // the "limiting distribution" of the Markov chain.

  // As the time when the state transition from i to j occurs has no impact on
  // the transition itself, our Markov chain is said to be "time-homogeneous",
  // which also means that it has "stationary transition probabilities".

  // When the probability vectors of a Markov chain converge to a vector V over
  // time, then V is called a stationary or steady-state vector, which describes
  // the long term behavior of the Markov process.

  // To work out these stationary probabilities, we need to build a system of
  // equations based on the transition matrix.


  /**
   * Step 2 - System of equations as an augmented matrix
   */

  // Let P be our transition matrix, and sp(j) the stationary probability of
  // transiting to state j, S being the state space, we got :

  //    sp(j) = Σ[i∈S]Pᵢⱼ*sp(i) = P₀ⱼ*sp(0) + P₁ⱼ*sp(1) + P₂ⱼ*sp(2) + ...

  // So we have to define a system of 120+1 equations with 120 unknowns, which
  // we will represent as a matrix of coefficients so that we can then solve it
  // by Gaussian elimination.

  //  Let x0=sp(0), x1=sp(1), x2=sp(2), ... the unknowns of the system, and V0,
  //  V1, V2, ... the column vectors of the matrix P, we got:
  //    x0 = V0₀*x0 + V0₁*x1 + V0₂*x2 + ...
  //    x1 = V1₀*x0 + V1₁*x1 + V1₂*x2 + ...
  //    x2 = V2₀*x0 + V2₁*x1 + V2₂*x2 + ...
  //    ...

  //  Then, we transform this into the following system of equations :
  //    (V0₀-1)*x0 + V0₁*x1 + V0₂*x2 + ... = 0
  //    V1₀*x0 + (V1₁-1)*x1 + V1₂*x2 + ... = 0
  //    V2₀*x0 + V2₁*x1 + (V2₂-1)*x2 + ... = 0
  //    ...

  //  The 121th equation is that all unknowns must add up to 1 :
  //     x0 + x1 + x2 + ... = 1

  // We can now build the corresponding augmented matrix (A|B) :
  //
  //    [ V0₀-1   V0₁    V0₂   ...  |  0  ]
  //    [  V1₀   V1₁-1   V1₂   ...  |  0  ]
  //    [  V2₀    V2₁   V2₂-1  ...  |  0  ]
  //    [  ...    ...    ...   ...  |  0  ]
  //    [   1      1      1     1   |  1  ]


  /**
   * Step 3 - Row reduction / Solution
   */

  // The last step is to solve that system, which is done by applying a row
  // reduction (or Gaussian elimination) on the augmented matrix.

  // Finally, we obtain the stationary vector which reprensent the limiting
  // distribution of our chain.

  // From there, we just have to merge back each group of three state variables
  // into one to work out the probalities of landing on a particular square
  // after a roll.


  /****************************************************************************/

  // The Monopoly board (40 squares)
  const board = [
    'GO', 'A1', 'CC1', 'A2', 'T1', 'R1', 'B1', 'CH1', 'B2', 'B3',
    'JAIL', 'C1', 'U1', 'C2', 'C3', 'R2', 'D1', 'CC2', 'D2', 'D3',
    'FP', 'E1', 'CH2', 'E2', 'E3', 'R3', 'F1', 'F2', 'U2', 'F3',
    'GTJ', 'G1', 'G2', 'CC3', 'G3', 'R4', 'CH3', 'H1', 'T2', 'H2'
  ];

  // Map square names to their zero indexed position in the board.
  const index = board.mapToObj((square, i) => [square, i]);

  const nDices = 2; // number of dices (ie. if 3, read 'double' as 'triple'..)
  const nSides = 4; // number of sides per dice


  /**
   * Step 0 - Probability distribution of rolling a number n
   */

  // We want to find the probability of finishing on a particular square after
  // a roll, so the first thing is to calculate the probability distribution of
  // yielding a number n using two six-sided (or `nDices` `nSides`-sided) dices.

  // Possible outcome combinations (ie. unordered) for a roll of dices.
  const rollCombi = nkCombinations(range(1, nSides+1), nDices, true);

  // Total number of possible roll outcomes
  const rollT = nSides**nDices;

  // Probability distribution (of yielding a number n) for a roll of dices.
  const rolldist = rollCombi.mapToObj((N, i, outcomes) => {
    // The actual outcome is the sum obtained from N.
    const n = sum(N);
    // The number of ways to roll N is the distinct permutations of N, which
    // adds up to other ways of yielding n, if any.
    let nWays = nPermutations(N, true);
    if (n in outcomes)
      nWays += outcomes[n][0];
    return [n, [nWays, rollT]];
  });


  /**
   * Step 1 - Transition probabilities matrix (helpers)
   */

  // First we need to define some helpers for handling CC/CH cards pick.

  // 2/16 CC cards require a move (static)
  const CC = ['GO', 'JAIL'].map(dest => index[dest]);

  // 6/16 CH cards require a move (static)
  const CHs = ['GO', 'JAIL', 'C1', 'E3', 'H2', 'R1'].map(dest => index[dest]);

  // 3/16 CH cards require a move that depends on the current square, the "Go
  // back 3 squares", which can lead to a CC square, is handled separately.
  const CHd = (square) => {
    const nextR = {CH1:'R2', CH2:'R3', CH3:'R1'}[square];
    const nextU = {CH1:'U1', CH2:'U2', CH3:'U1'}[square];
    return [nextR, nextR, nextU].map(dest => index[dest]);
  }

  // Helper for distributing p/q across possible landing states in the given
  // probability vector V, according to the odds of picking a particular CC card
  const CCodds = (V, j, t, p, q, nCards=16) => {
    q *= nCards; // 1/16 of being sent to one of the CC destinations.
    CC.forEach(s3 => V[s3*3+t] = addF(V[s3*3+t], [p, q]));
    V[j] = addF(V[j], [p*(nCards-2), q]); // 14/16 of staying on the CC square.
  };

  // Same as above for the odds of picking a particular CH card.
  const CHodds = (V, s1, s2, j, t, p, q) => {
    q *= 16; // 1/16 of being sent to one of the CH destinations.
    const CH = [...CHs, ...CHd(board[s2])];
    CH.forEach(s3 => V[s3*3+t] = addF(V[s3*3+t], [p, q]));
    back3odds(V, s1, s2, t, p, q); // 1/16 of going back 3 square
    V[j] = addF(V[j], [p*6, q]);   // 6/16 of staying on the CH square.
  };

  // Specific function for the "go back 3 square" card, which can lead to a CC
  // square, and/or to the square the player comes from (s1).
  const back3odds = (V, s1, s2, t, p, q) => {
    const s3 = s2-3;
    const j = s3*3+t;
    if (s1 === s3) {
      // When back3 card makes a "3 square loop" : s1 -> CH -> s3=s1
      if (board[s1] == 'CC3') {
        // CC3 -> CH3 -> CC3, apply case 'CC'.. except we assume the same CC
        // card cannot be picked up twice in a row, and since that card cannot
        // be a 'go to JAIL/GO', we can discard one of the non-'gotoX' card.
        CCodds(V, j, t, p, q, 15);
      }
      else
        V[j] = addF(V[j], [p, q]);
    }
    else {
      if (board[s3].substr(0, 2) == 'CC')
        CCodds(V, j, t, p, q);
      else
        V[j] = addF(V[j], [p, q]);
    }
  };


  /**
   * Step 1 - Transition probabilities matrix
   */

  // State space (or just the set of states, ie. 3 per square position)
  let S = range(board.length*3);

  // Transition matrix (a state variable p/q is represented as [p, q])
  let P = S.map(() => S.map(() => [0, 1]));

  // Go to jail state shortcut
  const jailj = index['JAIL']*3;

  // Filling the transition matrix...
  for (let s1=0; s1<board.length; s1++) {
    const from = board[s1];

    for (const roll in rolldist) {
      // Probability of rolling n is p/q
      const n = Number(roll);
      let [p, q] = rolldist[roll];

      // With that roll, we would land on square s2
      let s2 = (s1+n)%board.length;
      let square = board[s2];

      // Filling the transition matrix at index i+d,j+t, d being the number of
      // consecutive double previously rolled, and t their actual number after
      // transiting.
      const i = s1*3;
      const j = s2*3;

      // If landing on go to jail, go to jail no matter the previous rolls.
      if (square === 'GTJ') {
        [0, 1, 2].forEach(d => P[i+d][jailj] = addF(P[i+d][jailj], [p, q]));
        continue;
      }

      // However, except for that case above, we must consider the roll states
      // before thinking about the actual destination square s2, including CC/CH
      // square, because the case where we roll a third consecutive double leads
      // to jail whatever s2.

      // Considering one state foreach number of consecutive double previously
      // rolled
      [0, 1, 2].forEach(d => {
        const ii = i+d;
        // There are three transitions to consider and an additional one for the
        // possibility of a third consecutive roll.

        // Depending on n, we have either some chances the current roll is a
        // double (1/p of p/q), or not at all. Let's say we have no chance
        // rolling a double by default, then the distribution is :
        let D = [
          [p, q], // 0: not rolling a double
          [0, 1], // 1: rolling a double consecutive to 0
          [0, 1], // 2: rolling a double consecutive to 1
          [0, 1], // 3: rolling a double consecutive to 2
        ];

        // Now, if n can (or have to) be obtained with a double :
        if (remZero(n, nDices)) {
          // There are (p-1)/p ways of making n without double.
          D[0] = [p-1, q]; //  (p-1)/p * p/q

          // And 1/p by rolling a double (consecutive to d double), except that
          // if we were in jail, the double consecutiveness is discarded and all
          // transitions lead to D1 (rolling a double consecutive to 0).
          if (from === 'JAIL')
            D[1] = [1, q];
          else
            D[d+1] = [1, q];

          // Considering the possibiity of a third consecutive double (=jail) :
          if (D[3][0] > 0) {
            P[ii][jailj] = addF(P[ii][jailj], D[3]);
          }
        }

        // For each transition (except for D[3]) at index i+d,j+t, it will now
        // depend on which square we land.
        for (let t=0; t<3; t++) {
          const jj = j+t;
          let [pp, qq] = D[t];

          switch (square.substr(0, 2)) {
            case 'CC':
              CCodds(P[ii], jj, t, pp, qq);
              break;

            case 'CH':
              CHodds(P[ii], s1, s2, jj, t, pp, qq);
              break;

            default:
              P[ii][jj] = addF(P[ii][jj], D[t]);
          }
        }
      });
    }
  }

  // Besides (not used), now that we got a transition matrix;
  // This recursive function calculates the probability of ending on state j
  // after n rolls, with an initial state corresponding to "square 0, having
  // rolled 0 double".
  const pn = (n, j) => {
    if (n == 0)
      return j == 0 ? [1, 0] : [0, 1];
    let [p, q] = [0, 1];
    // Read the corresponding column in the transition matrix
    for (let i=0; i<P.length; i++) {
      const [p1, q1] = pn(n-1, j);
      const [p2, q2] = P[i][j];
      [p, q] = addF([p, q], [p1*p2, q1*q2]);
    }
    return [p, q];
  }


  /**
   * Step 2 - System of equations / Augmented matrix
   */

  // Let sp(j) indicate the stationary probability of ending on square j after
  // a roll.

  // As described previously, sp(j) is an equation that we represent as an array
  // of coefficients (LHS) along with a constant (RHS).
  const sp = (j) => {
    let V = Array(P.length+1);
    // Read the corresponding column j in the transition matrix
    for (let i=0; i<P.length; i++) {
      V[i] = P[i][j];
    }
    V[j] = addF(V[j], [-1, 1]);
    V[P.length] = [0, 1];
    return V;
  };

  // The augmented matrix hosting our system of equations.
  let A = Array(P.length+1);

  // sp(j) corresponds to the row j of our matrix. By the way we resolve the
  // p/q divisions for the row reduction algorithm.
  for (let j=0; j<P.length; j++) {
    A[j] = sp(j).map(([p,q]) => p/q);
  }

  // All unknowns must add up to exactly 1.
  A[A.length-1] = Array(P.length+1).fill(1);


  /**
   * Step 3 - Row reduction / Solution
   */

  // The stationary vector representing the limiting distribution we are after
  // is obatined by row reduction.
  const V = rowReduct([...A]);

  // We can finally merge each state variable triple back into one per square
  // position, and sort them by descending order to read the most visited first.
  const squareDist = board.map((s, i) => {
    const j = i*3;
    const p = V[j] + V[j+1] + V[j+2];
    return [i, p];
  });

  const mostPop = squareDist.sort((a, b) => b[1]-a[1]);
  console.log(mostPop.map(([s, p]) => [board[s], +(p*100).toFixed(3)]));

  return mostPop.slice(0, 3).map(([s,]) => String(s).padStart(2, '0')).join('');
}

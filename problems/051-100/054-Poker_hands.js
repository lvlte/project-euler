/**
 * Problem 54 - Poker hands
 *
 * @see {@link https://projecteuler.net/problem=54}
 *
 * [...]
 *
 * The file, poker.txt, contains one-thousand random hands dealt to two players.
 * Each line of the file contains ten cards (separated by a single space): the
 * first five are Player 1's cards and the last five are Player 2's cards.
 * You can assume that all hands are valid (no invalid characters or repeated
 * cards), each player's hand is in no specific order, and in each hand there
 * is a clear winner.
 *
 * How many hands does Player 1 win ?
 */

const { load } = require('../../lib/utils');
const gameHands = load('p054_poker.txt');

// Suits:
//    - S : ♠ Spades
//    - H : ♥ Hearts
//    - D : ♦ Diamonds
//    - C : ♣ Clubs

// Values:
//    - T : Ten
//    - J : Jack
//    - Q : Queen
//    - K : King
//    - A : Ace

this.solve = function () {

  // Card rank map
  const cardRank = {
    2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9, T:10, J:11, Q:12, K:13, A:14
  };

  // Hand rank map
  const handRank = {
    highCard: 1,
    onePair: 2,
    twoPairs: 3,
    threeOfAkind: 4,
    straight: 5,
    flush: 6,
    fullHouse: 7,
    fourOfAKind: 8,
    straightFlush: 9,
    royalFlush: 10,
  };

  /**
   * Poker hands handlers, they pick what they need from the passed in object
   * and return false if the hand in question cannot be made, otherwise they
   * return the highest value from the rank to be used in case of tie.
   */
  const pokerHand = {

    // Highest value card.
    highCard: ({values}) => {
      return values.last();
    },

    // Two cards of the same value.
    onePair: ({countMap}) => {
      if (2 in countMap && countMap[2].length === 1)
        return countMap[2][0];
      return false;
    },

    // Two different pairs.
    twoPairs: ({countMap}) => {
      if (2 in countMap && countMap[2].length === 2)
        return countMap[2][0];
      return false;
    },

    // Three cards of the same value.
    threeOfAkind: ({countMap}) => {
      if (3 in countMap)
        return countMap[3][0];
      return false;
    },

    // All cards are consecutive values.
    straight: ({values}) => {
      for (let i=1; i<values.length; i++) {
        const [val1, val2] = [values[i-1], values[i]]
        if (cardRank[val2] != cardRank[val1] + 1)
          return false;
      }
      return pokerHand.highCard({values});
    },

    // All cards of the same suit.
    flush: ({values, suits}) => {
      if ([...new Set(suits)].length === 1)
        return pokerHand.highCard({values});
      return false;
    },

    // Three of a kind and a pair.
    fullHouse: ({countMap}) => {
      const pair = pokerHand.onePair({countMap});
      const three = pokerHand.threeOfAkind({countMap});
      if (pair && three)
        return cardRank[pair] > cardRank[three] ? pair : three;
      return false;
    },

    // Four cards of the same value.
    fourOfAKind: ({countMap}) => {
      if (4 in countMap)
        return countMap[4][0];
      return false;
    },

    // All cards are consecutive values of same suit.
    straightFlush: ({values, suits}) => {
      const straight = pokerHand.straight({values, suits});
      const flush = pokerHand.flush({values, suits});
      return straight && flush;
    },

    // Ten, Jack, Queen, King, Ace, in same suit.
    royalFlush: ({values, suits}) => {
      const straightFlush = pokerHand.straightFlush({values, suits});
      return straightFlush == 'A' && 'A';
    }
  };

  // List handler names from pokerHand keys in reverse so that we execute them
  // in reverse order, trying highest ranked hands first.
  const handlers = Object.keys(pokerHand).reverse();

  // Map count to values where count is the number of cards of the same value.
  const cardValueByCount = (values) => {
    const count = values.occurrences();
    let countMap = {};
    for (const value in count) {
      if (count[value] in countMap)
        countMap[count[value]].push(value);
      else
        countMap[count[value]] = [value];
    }
    return countMap;
  }

  // Sorting by card rank value in ascending order.
  const orderByCardRank = (a, b) => cardRank[a] - cardRank[b];

  /**
   * Make the best poker hand that can be made from the passed in cards, then
   * yield the corresponding score which takes account of both the hand rank
   * and the rank's highest card in case of tie.
   */
  const bestHand = function * (cards) {
    const values = cards.map(card => card[0]).sort(orderByCardRank);
    const suits = cards.map(card => card[1]);
    const countMap = cardValueByCount(values);
    const params = {values, suits, countMap};

    for (const handler of handlers) {
      // Include `card` value into the score in case handRanks tie.
      const card = pokerHand[handler](params);
      if (card === false)
        continue;
      const score = handRank[handler]*100 + cardRank[card];
      yield score;
      break;
    }

    // If we stil have a tie after scoring, tie break on the highest card still
    // in hand.
    let highestCards = [...values];
    do {
      const card = highestCards.pop();
      yield cardRank[card];
    }
    while (highestCards.length > 0);

    return 'tied';
  };

  // Who actually wins
  let wins = {p1: 0, p2: 0};

  // Playing
  game:
  for (let i=0; i<gameHands.length; i++) {
    const cards = gameHands[i].split(' ');
    const [h1, h2] = [cards.slice(0, 5), cards.slice(5)];

    const [hand1, hand2] = [bestHand(h1), bestHand(h2)];
    let scoreP1 = hand1.next().value;
    let scoreP2 = hand2.next().value;

    while (scoreP1 === scoreP2) {
      // Tie break
      if (scoreP1 === 'tied')
        continue game;
      scoreP1 = hand1.next().value;
      scoreP2 = hand2.next().value;
    }

    const winner = scoreP1 > scoreP2 ? 'p1' : 'p2';
    wins[winner]++;
  }

  return wins.p1;
}

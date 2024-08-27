'use client'
import { useState } from "react";
import styles from './styles.module.css';

const suits = ["♠", "♥", "♦", "♣"];
const ranks = [
  "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"
];

const generateDeck = () => {
  let deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

const dealCards = (deck, numPlayers, cardsPerPlayer) => {
  let hands = [];
  for (let i = 0; i < numPlayers; i++) {
    hands.push(deck.splice(0, cardsPerPlayer));
  }
  const dealerCards = deck.splice(0, 5);
  return { hands, dealerCards };
}

export default function PokerGame() {
  const [deck, setDeck] = useState([]);
  const [hands, setHands] = useState([]);
  const [result, setResult] = useState(null);
  const [dealerCards, setDealerCards] = useState([]);

  const startGame = () => {
    let newDeck = shuffleDeck(generateDeck());
    setDeck(newDeck);
    let { hands: playerHands, dealerCards: remainingCards } = dealCards(newDeck, 2, 5);
    setHands(playerHands);
    setDealerCards(remainingCards)
    
    let winnerIndex = 0;
    if (compareHands(playerHands[0], playerHands[1]) === -1) {
      winnerIndex = 1;
    }
    setResult(`Player ${winnerIndex + 1} wins!`);
  };

  const getHandRank = (hand) => {
    
    const ranks = "23456789TJQKA";
    const rankCounts = hand.reduce((acc, card) => {
      acc[card.rank] = (acc[card.rank] || 0) + 1;
      return acc;
    }, {});
  
    const suits = hand.map(card => card.suit);
    const isFlush = suits.every(suit => suit === suits[0]);
  
    const rankVals = hand.map(card => ranks.indexOf(card.rank)).sort((a, b) => a - b);
    const isStraight = rankVals.every((val, i) => i === 0 || val === rankVals[i - 1] + 1);
  
    const rankValues = Object.values(rankCounts).sort((a, b) => b - a);
  
    if (isStraight && isFlush) return { rank: 8, high: rankVals[4] }; 
    if (rankValues[0] === 4) return { rank: 7, high: rankVals[2] };   
    if (rankValues[0] === 3 && rankValues[1] === 2) return { rank: 6, high: rankVals[2] }; 
    if (isFlush) return { rank: 5, high: rankVals[4] };
    if (isStraight) return { rank: 4, high: rankVals[4] };
    if (rankValues[0] === 3) return { rank: 3, high: rankVals[2] };  
    if (rankValues[0] === 2 && rankValues[1] === 2) return { rank: 2, high: rankVals[3] }; 
    if (rankValues[0] === 2) return { rank: 1, high: rankVals[2] };   
    return { rank: 0, high: rankVals[4] }; 
  }
  
  const compareHands = (hand1, hand2) => {
    const hand1Rank = getHandRank(hand1);
    const hand2Rank = getHandRank(hand2);
  
    if (hand1Rank.rank > hand2Rank.rank) return 1;
    if (hand1Rank.rank < hand2Rank.rank) return -1;
    if (hand1Rank.high > hand2Rank.high) return 1;
    if (hand1Rank.high < hand2Rank.high) return -1;
    return 0;
  }
  return (
    <div>
        <div className={styles.one}>
            <h1 className={styles.h1}>Poker Game</h1>
            <button onClick={startGame} className={styles.button}>Start Game</button>
        </div>
        <div className={styles.block}>
          {dealerCards.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                  <h2>Dealer's Cards:</h2>
                  <ul>
                      {dealerCards.map((card, i) => (
                      <li key={i}>{card.rank} {card.suit}</li>
                      ))}
                  </ul>
              </div>
          )}
        </div>
        <div style={{ margin: "0 auto", width: "1000px", height: "750px", alignItems: "center",display: "flex", justifyContent: "space-between"}}>
            {hands.map((hand, index) => (
            <div key={index}>
                <h3>Player {index + 1}</h3>
                <ul>
                {hand.map((card, i) => (
                    <li key={i}>{card.rank} {card.suit}</li>
                ))}
                </ul>
            </div>
            ))}
      </div>
      {result && (
            <div className={styles.result} style={{ marginTop: "20px", textAlign: "center" }}>
                <h2>{result}</h2>
            </div>
        )}
    </div>
  );
}



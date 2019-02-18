class Cards {
  constructor(cards) {
    this.cards = cards;
    this.usedCards = [];
  }

  usedCard(card){
    this.usedCards.push(card);
  }
}

module.exports = Cards;

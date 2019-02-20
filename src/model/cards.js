const lodash = require('lodash');
class Cards {
  constructor(cards) {
    this.cards = cards;
    this.usedCards = [];
  }

  getCard() {
    let cards = lodash.shuffle(this.cards);
    let card = cards.pop();
    this.usedCards.push(card);
    this.cards = cards;
    return card;
  }
}

module.exports = Cards;

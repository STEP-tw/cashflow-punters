const lodash = require("lodash");

class Cards {
  constructor(cards) {
    this.cards = cards;
    this.usedCards = [];
  }

  drawCard() {
    const cards = lodash.shuffle(this.cards);
    const card = cards.pop();
    this.usedCards.push(card);
    this.cards = cards;
    if (cards.length == 0) this.restoreStack();
    return card;
  }

  restoreStack() {
    this.cards = this.cards.concat(this.usedCards);
    this.usedCards = [];
  }
}

module.exports = Cards;

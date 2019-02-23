const lodash = require("lodash");
class Cards {
  constructor(cards) {
    this.cards = cards;
    this.usedCards = [];
  }

  drawCard() {
    if (this.cards.length == 0) {
      this.cards = this.usedCards;
      this.usedCards = [];
    }
    const cards = lodash.shuffle(this.cards);
    const card = cards.pop();
    this.usedCards.push(card);
    this.cards = cards;
    return card;
  }
}

module.exports = Cards;

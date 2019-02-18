const Cards = require('../../src/model/cards');
const { expect } = require('chai');

describe('cards', function () {
  it('should put used cards into usedcards array', function () {
    let card = new Cards({ 1: "card1", 2: "card2" })
    card.usedCard(1);
    expect(card.usedCard.length).to.equal(1);
  });
});
const { add, randomNum } = require("../utils/utils");

class Dice {
  constructor() {
    this.diceValues = [];
  }

  roll(numberOfDice) {
    const diceValues = new Array(numberOfDice).fill(6).map(randomNum);
    this.diceValues = diceValues;
    return diceValues;
  }

  total() {
    return this.diceValues.reduce(add);
  }
}

module.exports = Dice;

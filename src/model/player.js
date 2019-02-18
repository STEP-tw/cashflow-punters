class Player {
  constructor(name) {
    this.name = name;
    this.profession;
    this.financialStatement;
    this.currentSpace = 0;
  }
  move(spacesCount) {
    this.currentSpace = (this.currentSpace + spacesCount) % 24 || 24;
    return this.currentSpace;
  }
}

module.exports = Player;

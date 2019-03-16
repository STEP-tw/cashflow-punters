class Board {
  constructor(board, fasttrack) {
    this.board = board;
    this.fasttrack = fasttrack;
    this.paydaySpaces = [6, 14, 22];
    this.cashflowDays = [10, 18, 30, 38];
  }
  getSpaceType(spaceNo) {
    return this.board[spaceNo - 1];
  }
  getPayDaySpaces() {
    return this.paydaySpaces;
  }
  getFasttrackSpaceType(spaceNo) {
    return this.fasttrack[spaceNo - 1];
  }
  getCashflowSpaces() {
    return this.cashflowDays;
  }
}

module.exports = Board;

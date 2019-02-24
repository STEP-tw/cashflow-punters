class Board {
  constructor(board) {
    this.board = board;
    this.paydaySpaces = [6, 14, 22];
  }
  getSpaceType(spaceNo) {
    return this.board[spaceNo - 1];
  }
  getPayDaySpaces() {
    return this.paydaySpaces;
  }
}

module.exports = Board;

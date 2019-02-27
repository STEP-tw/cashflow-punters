const { expect } = require("chai");
const Board = require("./../../src/model/board");

describe("Board", function() {
  const dummyBoard = ["market", "doodad", "deal"];
  const board = new Board(dummyBoard);
  it("should return space for respective space number.", function() {
    expect(board.getSpaceType(1)).equals("market");
  });
  it("should return paydays spaces of board.", function() {
    expect(board.getPayDaySpaces()).deep.equal([6, 14, 22]);
  });
});

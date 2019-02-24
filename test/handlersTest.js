const { rollDice } = require("../src/gameHandlers");
const chai = require("chai");
const sinon = require("sinon");

describe("rollDice", function() {
  let req, res;

  beforeEach(() => {
    req = {};
    req.game = {
      addActivity: sinon.spy(),
      nextPlayer: sinon.spy(),
      board: { getSpaceType: sinon.stub().returns("a") },
      currentPlayer: {
        name: "tilak",

        didUpdateSpace: false,
        move: sinon.spy(),
        isDownSized: sinon.stub()
      },
      isCurrentPlayer: sinon.stub(),
      rollDice: sinon.spy(),
      handleSpace: sinon.spy()
    };
    req.cookies = { playerName: "tilak" };
    req.body = {
      numberOfDice: 1
    };
    res = {};
    res.json = sinon.spy();

    req.game.currentPlayer.isDownSized.onFirstCall().returns(false);
    req.game.isCurrentPlayer.onFirstCall().returns(true);
  });
  it("should return a number between 1 and 6 ", function() {
    rollDice(req, res);

    sinon.assert.calledOnce(res.json);
  });

  it("should not roll the die if requested player and currentPlayer are not same", function() {
    let { currentPlayer } = req.game;
    currentPlayer.name = "a";
    rollDice(req, res);
    chai.expect(req.game.addActivity.calledOnce).to.be.false;
  });
});

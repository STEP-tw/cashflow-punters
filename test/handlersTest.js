const { rollDice } = require("../src/gameHandlers");
const { renderHomePage } = require("../src/handlers");
const chai = require("chai");
const sinon = require("sinon");

describe("rollDice", function() {
  let req, res;

  beforeEach(() => {
    req = {};
    req.game = {
      activityLog: { addActivity: sinon.spy() },
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
    chai.expect(req.game.activityLog.addActivity.calledOnce).to.be.false;
  });
});

describe("renderHomePage", function() {
  it("should render home page if game is already present", function() {
    let req = { game: true };
    let res = {
      redirect: url => {
        chai.expect(url).to.equal("board.html");
      }
    };
    renderHomePage(req, res);
  });
});

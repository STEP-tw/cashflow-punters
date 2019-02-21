const { rollDie } = require("../src/gameHandlers");
const chai = require("chai");
const sinon = require("sinon");

describe("rollDie", function() {
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
        move: sinon.spy()
      },
      handleSpace: sinon.spy()
    };
    req.cookies = { playerName: "tilak" };
    res = {};
    res.json = sinon.spy();
  });
  it("should return a number between 1 and 6 ", function() {
    rollDie(req, res);
    const returnValue = res.json.firstCall.args[0];
    chai.expect(returnValue.diceValue).to.be.at.least(1);
    chai.expect(returnValue.diceValue).to.be.at.most(6);
  });

  it("should  call add activity", function() {
    let { addActivity } = req.game;
    rollDie(req, res);
    const isAddActivityCalled = addActivity.calledOnce;
    chai.expect(isAddActivityCalled).to.be.true;
  });

  it("should  call update activity with msg rolled some number", function() {
    let { addActivity } = req.game;
    rollDie(req, res);
    const activityMsg = addActivity.firstCall.args[0];
    chai.expect(activityMsg).to.match(/rolled [1-6]/);
  });

  it("should not roll the die if requested player and currentPlayer are not same", function() {
    let { currentPlayer } = req.game;
    currentPlayer.name = "a";
    rollDie(req, res);
    chai.expect(req.game.addActivity.calledOnce).to.be.false;
  });
});

const { rollDie } = require("../src/handlers");
const { startGame } = require("../src/gameHandlers");
const chai = require("chai");
const sinon = require("sinon");

describe("rollDie", function() {
  let req, res;

  beforeEach(() => {
    req = {};
    req.game = {
      addActivity: sinon.spy(),
      nextPlayer: sinon.spy(),
      currentPlayer: {
        name: "tilak",
        deactivateDice: function() {
          this.haveToActivateDice = false;
        },
        haveToActivateDice: true,
        didUpdateSpace: false,
        move: sinon.spy()
      }
    };
    req.cookies = { playerName: "tilak" };
    res = {};
    res.send = sinon.spy();
  });

  it("should return 200 status", function() {
    rollDie(req, res);
    const statusCode = +res.send.firstCall.lastArg;
    chai.expect(statusCode).equals(200);
  });

  it("should return a number between 1 and 6 ", function() {
    rollDie(req, res);
    const returnValue = +res.send.firstCall.args[0];
    chai.expect(returnValue).to.be.at.least(1);
    chai.expect(returnValue).to.be.at.most(6);
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

  it("should has to change haveToActivateDice  of current playe to false", function() {
    let { currentPlayer } = req.game;
    rollDie(req, res);
    chai.expect(currentPlayer.haveToActivateDice).to.be.false;
  });

  it("should not roll the die if requested player and currentPlayer are not same", function() {
    let { currentPlayer } = req.game;
    currentPlayer.name = "a";
    rollDie(req, res);
    chai.expect(req.game.addActivity.calledOnce).to.be.false;
  });
});

describe("startGame", function() {
  it("should redirect to board.html", function() {
    let req = {
      game: {
        getInitialDetails: () => {}
      }
    };
    let res = {
      redirect: location => {
        chai.expect(location).to.eql("/board.html");
      }
    };
    startGame(req, res);
  });
});

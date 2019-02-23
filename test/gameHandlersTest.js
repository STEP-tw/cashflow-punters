const sinon = require("sinon");
const { expect } = require("chai");
const {
  acceptSmallDeal,
  rejectSmallDeal,
  acceptBigDeal,
  rejectBigDeal,
  getPlayersFinancialStatement,
  getPlayers,
  getGame,
  startGame,
  acceptCharity,
  declineCharity,
  selectSmallDeal,
  selectBigDeal,
  isAbleToDoCharity,
  grantLoan,
  provideLiabilities,
  payDebt
} = require("../src/gameHandlers");

describe("getgame", function() {
  const res = {};
  const req = {};
  beforeEach(function() {
    req.game = {
      currentPlayer: {
        name: "tilak"
      },
      getPlayer: sinon.spy()
    };
    req.cookies = {
      playerName: "tilak"
    };
    res.send = function(response) {
      res.content = response;
    };
  });
  it("should return game with isMyTurn true when currentPlayer is request player", function() {
    getGame(req, res);

    expect(req.game.isMyTurn).to.be.true;
  });
  it("should return game with isMyTurn false when currentPlayer is request player", function() {
    req.cookies["playerName"] = "swapnil";
    getGame(req, res);
    expect(req.game.isMyTurn).to.be.false;
  });
});

describe("getPlayers", function() {
  it("should return game", function() {
    const req = {
      game: {
        player: [1, 2]
      }
    };
    const res = {
      send: () => {
        expect(req.game.player).to.eql([1, 2]);
      }
    };
    getPlayers(req, res);
  });
});

describe("startGame", function() {
  it("should redirect to board.html", function() {
    let req = {
      game: {
        hasStarted: false,
        getInitialDetails: () => {}
      }
    };
    let res = {
      end: () => {}
    };
    startGame(req, res);

    expect(req.game)
      .to.have.property("hasStarted")
      .to.be.equal(true);
  });
});

describe("getPlayersFinancialStatement", function() {
  it("should give financial statement of current player", function() {
    let req = {
      cookies: { playerName: "anu" },
      game: { players: [{ name: "anu" }], getPlayerByName: sinon.stub() }
    };
    req.game.getPlayerByName.onFirstCall().returns({ name: "anu" });

    let res = {
      send: player => {
        expect(player).that.eql('{"name":"anu"}');
      }
    };
    getPlayersFinancialStatement(req, res);

    sinon.assert.calledOnce(req.game.getPlayerByName);
  });
});

describe("acceptCharity", function() {
  let req, res;
  beforeEach(() => {
    req = {
      game: {
        currentPlayer: { charityTurns: 0, getLedgerBalance: sinon.spy() },
        nextPlayer: sinon.spy(),
        acceptCharity: function() {
          this.currentPlayer.charityTurns = 3;
        }
      }
    };
    res = { send: sinon.spy() };
  });
  it("should add charity turns to currentPlayer", function() {
    acceptCharity(req, res);
    expect(req.game.currentPlayer.charityTurns).equal(3);
  });
});

describe("declineCharity", function() {
  it("should add charity turns to currentPlayer", function() {});
  const req = {
    game: {
      declineCharity: sinon.spy(),
      nextPlayer: sinon.spy()
    }
  };
  const res = { end: sinon.spy() };
  declineCharity(req, res);
  expect(req.game.declineCharity.calledOnce).to.be.true;
});

describe("selectSmallDeal", function() {
  const req = {},
    res = {};
  beforeEach(() => {
    req.game = {
      currentPlayer: { gotDeal: true },
      handleSmallDeal: sinon.spy()
    };
    res.end = sinon.spy();
  });
  it("should call handleSmallDeal when current player got deal", function() {
    selectSmallDeal(req, res);
    expect(req.game.handleSmallDeal.calledOnce).to.be.true;
  });
  it("should not call handleSmallDeal when current player didntgot deal", function() {
    req.game.currentPlayer.gotDeal = false;
    selectSmallDeal(req, res);
    expect(req.game.handleSmallDeal.calledOnce).to.be.false;
  });
});
describe("selectBigDeal", function() {
  const req = {},
    res = {};
  beforeEach(() => {
    req.game = {
      currentPlayer: { gotDeal: true },
      handleBigDeal: sinon.spy()
    };
    res.end = sinon.spy();
  });
  it("should call handleBigDeal when current player got deal", function() {
    selectBigDeal(req, res);
    expect(req.game.handleBigDeal.calledOnce).to.be.true;
  });
  it("should not call handleBigDeal when current player didntgot deal", function() {
    req.game.currentPlayer.gotDeal = false;
    selectBigDeal(req, res);
    expect(req.game.handleBigDeal.calledOnce).to.be.false;
  });
});

describe("isAbleToDoCharity", function() {
  const req = {};
  const res = {};
  beforeEach(() => {
    req.game = {
      currentPlayer: {
        totalIncome: 5000,
        setNotification:function(msg){
          this.notification = msg;
        },
        isAbleToDoCharity: function() {
          return this.ledgerBalance >= this.totalIncome * 0.1;
        }
      }
    };
    res.content = "";
    res.send = function(data) {
      this.content = data;
    };
  });

  it("should response with object with keys isAble as true and msg as charitymessage", function() {
    req.game.currentPlayer.ledgerBalance = 5000;
    isAbleToDoCharity(req, res);
    expect(JSON.parse(res.content)).to.be.deep.equal({
      isAble: true,
    });
  });
  it("should response with object with keys isAble as false and msg as unabletodocharity", function() {
    req.game.currentPlayer.ledgerBalance = 300;
    isAbleToDoCharity(req, res);
    expect(JSON.parse(res.content)).to.be.deep.equal({
      isAble: false,
    });
  });
});

describe("grantLoan", function() {
  it("should update the cash ledger, financial statement and respond with player", function() {
    const req = {};
    req.cookies = { playerName: "player" };
    req.body = { amount: 5000 };
    req.game = {
      grantLoan: sinon.spy(),
      getPlayerByName: sinon.spy()
    };

    const res = {
      send: sinon.spy()
    };
    grantLoan(req, res);

    sinon.assert.calledOnce(req.game.grantLoan);
    sinon.assert.calledOnce(req.game.getPlayerByName);
    sinon.assert.calledOnce(res.send);
  });
});

describe("provideLiabilities", function() {
  const req = {};
  const res = {};
  req.cookies = { playerName: "player1" };
  req.game = {
    players: [
      { name: "player1", turn: 1, profession: {} },
      { name: "player2", turn: 2, profession: {} },
      { name: "player3", turn: 3, profession: {} }
    ],
    getPlayerByName: function(playerName) {
      return this.players.filter(player => player.name == playerName)[0];
    }
  };
  res.content = "";
  res.send = function(data) {
    this.content = data;
  };

  it("should response with a current player object ", function() {
    provideLiabilities(req, res);
    expect(JSON.parse(res.content)).to.be.deep.equal({
      name: "player1",
      turn: 1,
      profession: {}
    });
  });
});

describe("payDebt", function() {
  it("should deduct the amount from ledgerBalance and return the player", function() {
    const req = {};
    const res = {};
    req.cookies = { playerName: "player1" };
    req.body = {
      liability: "Bank Loan",
      liabilityPrice: 5000,
      expense: "Bank Loan Payment",
      expenseAmount: 500
    };

    req.game = {
      getPlayerByName: sinon.stub(),
      payDebt: sinon.spy()
    };
    res.content = "";
    res.send = function(data) {
      this.content = data;
    };
    const player = {
      name: "player",
      profession: "driver"
    };

    const expectedPlayer = JSON.stringify({
      name: "player",
      profession: "driver"
    });
    req.game.getPlayerByName.onFirstCall().returns(player);

    payDebt(req, res);

    sinon.assert.calledOnce(req.game.getPlayerByName);
    sinon.assert.calledOnce(req.game.payDebt);
    expect(res.content).to.deep.equals(expectedPlayer);
  });
});

describe("acceptSmallDeal", function() {
  const req = {},
    res = {};
  beforeEach(() => {
    req.game = {
      activeCard: { data: { relatedTo: "" }, dealDone: false, dealDoneCount: 0 }
    };
    req.game.players = { length: 0 };
    req.game.addActivity = sinon.spy();
    req.cookies = { playerName: "" };
    req.game.nextPlayer = sinon.spy();
    res.end = sinon.spy();
    res.send = sinon.spy();
  });
  it("should return nothing if deal is already done ", function() {
    req.game.activeCard.dealDone = true;
    const output = acceptSmallDeal(req, res);
    expect(output).to.be.undefined;
    expect(req.game.nextPlayer.calledOnce).to.be.false;
  });
  it("should call nextPlayer if deal is not done ", function() {
    acceptSmallDeal(req, res);
    expect(req.game.nextPlayer.calledOnce).to.be.true;
  });
  it("should call nextPlayer if deal is shares and all players accept or reject", function() {
    req.game.players.length = 6;
    req.game.activeCard.data.relatedTo = "shares";
    req.game.activeCard.dealDoneCount = 5;
    acceptSmallDeal(req, res);
    expect(req.game.nextPlayer.calledOnce).to.be.true;
  });
  it("should not call nextPlayer if deal is shares and all players didn't accept or reject", function() {
    req.game.players.length = 6;
    req.game.activeCard.data.relatedTo = "shares";
    req.game.activeCard.dealDoneCount = 3;
    acceptSmallDeal(req, res);
    expect(req.game.nextPlayer.calledOnce).to.be.false;
  });
});

describe("rejectSmallDeal", function() {
  const req = {},
    res = {};
  beforeEach(() => {
    req.game = {
      activeCard: { data: { relatedTo: "" }, dealDone: false, dealDoneCount: 0 }
    };
    req.game.addActivity = sinon.spy();
    req.cookies = { playerName: "" };
    req.game.players = { length: 0 };
    req.game.nextPlayer = sinon.spy();
    res.end = sinon.spy();
  });
  it("should return nothing if deal is already done ", function() {
    req.game.activeCard.dealDone = true;
    const output = rejectSmallDeal(req, res);
    expect(output).to.be.undefined;
    expect(req.game.nextPlayer.calledOnce).to.be.false;
  });
  it("should call nextPlayer if deal is not done ", function() {
    rejectSmallDeal(req, res);
    expect(req.game.nextPlayer.calledOnce).to.be.true;
  });
  it("should call nextPlayer if deal is shares and all players accept or reject", function() {
    req.game.players.length = 6;
    req.game.activeCard.data.relatedTo = "shares";
    req.game.activeCard.dealDoneCount = 5;
    rejectSmallDeal(req, res);
    expect(req.game.nextPlayer.calledOnce).to.be.true;
  });
  it("should not call nextPlayer if deal is shares and all players didn't accept or reject", function() {
    req.game.players.length = 6;
    req.game.activeCard.data.relatedTo = "shares";
    req.game.activeCard.dealDoneCount = 3;
    rejectSmallDeal(req, res);
    expect(req.game.nextPlayer.calledOnce).to.be.false;
  });
});

describe("acceptBigDeal", function() {
  const req = {},
    res = {};
  beforeEach(() => {
    req.game = {
      activeCard: { data: { relatedTo: "" }, dealDone: false, dealDoneCount: 0 }
    };
    req.game.players = { length: 0 };
    req.game.addActivity = sinon.spy();
    req.cookies = { playerName: "" };
    req.game.nextPlayer = sinon.spy();
    req.game.currentPlayer = { addRealEstate: sinon.spy() };
    res.end = sinon.spy();
    res.send = sinon.spy();
  });
  it("should return nothing if deal is already done ", function() {
    req.game.activeCard.dealDone = true;
    const output = acceptBigDeal(req, res);
    expect(output).to.be.undefined;
    expect(req.game.nextPlayer.calledOnce).to.be.false;
  });
});

describe("rejectBigDeal", function() {
  const req = {},
    res = {};
  beforeEach(() => {
    req.game = {
      activeCard: { data: { relatedTo: "" }, dealDone: false, dealDoneCount: 0 }
    };
    req.game.addActivity = sinon.spy();
    req.cookies = { playerName: "" };
    req.game.players = { length: 0 };
    req.game.nextPlayer = sinon.spy();
    res.end = sinon.spy();
  });
  it("should return nothing if deal is already done ", function() {
    req.game.activeCard.dealDone = true;
    const output = rejectBigDeal(req, res);
    expect(output).to.be.undefined;
    expect(req.game.nextPlayer.calledOnce).to.be.false;
  });
  it("should call nextPlayer if deal is not done ", function() {
    rejectBigDeal(req, res);
    expect(req.game.nextPlayer.calledOnce).to.be.true;
  });
});

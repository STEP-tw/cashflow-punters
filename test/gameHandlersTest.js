const sinon = require("sinon");
const { expect } = require("chai");
const {
  acceptSmallDeal,
  rejectSmallDeal,
  acceptBigDeal,
  rejectBigDeal,
  getPlayersFinancialStatement,
  getGame,
  startGame,
  acceptCharity,
  declineCharity,
  selectSmallDeal,
  selectBigDeal,
  isAbleToDoCharity,
  grantLoan,
  provideLiabilities,
  payDebt,
  isSharePresent,
  buyShares,
  sellShares,
  removePlayer,
  rollDiceForMLM,
  handleAuction,
  addToFastTrack,
  handleBid,
  saveGame
} = require("../src/gameHandlers");

describe("getgame", function() {
  const res = {};
  const req = {};
  beforeEach(function() {
    req.game = {
      currentPlayer: {
        name: "tilak",
        isDownSized: sinon.stub()
      },
      isCurrentPlayer: player => {
        return req.game.currentPlayer.name == player;
      },
      getPlayerByName: sinon.stub(),
      getPlayer: sinon.spy()
    };
    req.cookies = {
      playerName: "tilak"
    };
    res.send = function(response) {
      res.content = response;
    };
    const player = { name: "player" };

    req.game.currentPlayer.isDownSized.onFirstCall().returns(false);
    req.game.getPlayerByName.onFirstCall().returns(player);
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

describe("startGame", function() {
  it("should redirect to board.html", function() {
    let req = {
      game: {
        hasStarted: false,
        startGame: () => {
          req.game.initializeGame();
        },
        initializeGame: () => {
          req.game.hasStarted = true;
        }
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
  it("should call handleSmallDeal when current player wants to take small deal", function() {
    selectSmallDeal(req, res);
    expect(req.game.handleSmallDeal.calledOnce).to.be.true;
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
  it("should call handleBigDeal when player selected big deal", function() {
    selectBigDeal(req, res);
    expect(req.game.handleBigDeal.calledOnce).to.be.true;
  });
});

describe("isAbleToDoCharity", function() {
  const req = {};
  const res = {};
  beforeEach(() => {
    req.game = {
      currentPlayer: {
        totalIncome: 5000,
        setNotification: function(msg) {
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
      isAble: true
    });
  });
  it("should response with object with keys isAble as false and msg as unabletodocharity", function() {
    req.game.currentPlayer.ledgerBalance = 300;
    isAbleToDoCharity(req, res);
    expect(JSON.parse(res.content)).to.be.deep.equal({
      isAble: false
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
      activeCard: {
        data: { relatedTo: "goldCoins" },
        dealDone: false,
        dealDoneCount: 0,
        drawnBy: "player1"
      },
      getPlayerByName: () => {
        return { name: "tilak", buyGoldCoins: sinon.stub().returns(true) };
      }
    };
    req.game.players = { length: 0 };
    req.game.activityLog = { addActivity: sinon.spy() };
    req.cookies = { playerName: "player1" };
    req.game.nextPlayer = sinon.spy();
    res.end = sinon.spy();
    res.json = sinon.spy();
  });
  it("should call nextPlayer if deal is not done ", function() {
    acceptSmallDeal(req, res);
    expect(req.game.nextPlayer.calledOnce).to.be.true;
  });
});

describe("rejectSmallDeal", function() {
  const req = {},
    res = {};
  beforeEach(() => {
    req.game = {
      activeCard: { data: { relatedTo: "" }, dealDone: false, dealDoneCount: 0 }
    };
    req.game.activityLog = { addActivity: sinon.spy() };
    req.cookies = { playerName: "" };
    req.game.players = { length: 0 };
    req.game.nextPlayer = sinon.spy();
    res.end = sinon.spy();
    res.send = sinon.spy();
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
});

describe("acceptBigDeal", function() {
  const req = {},
    res = {};
  beforeEach(() => {
    req.game = {
      activeCard: { data: { relatedTo: "" }, dealDone: false, dealDoneCount: 0 }
    };
    req.game.players = { length: 0 };
    req.game.activityLog = { addActivity: sinon.spy() };
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
    req.game.activityLog = { addActivity: sinon.spy() };
    req.cookies = { playerName: "" };
    req.game.players = { length: 0 };
    req.game.nextPlayer = sinon.spy();
    res.end = sinon.spy();
  });
  it("should call nextPlayer if deal is not done ", function() {
    rejectBigDeal(req, res);
    expect(req.game.nextPlayer.calledOnce).to.be.true;
  });
});

describe("isSharePresent", function() {
  const req = {},
    res = {};
  beforeEach(() => {
    req.game = {
      activeCard: {
        data: { relatedTo: "smallDeal", symbol: "MYT4U" }
      }
    };
    req.game.activityLog = { addActivity: sinon.spy() };
    req.game.hasShares = function() {
      return this.players[0].hasShares(this.activeCard.data.symbol);
    };
    req.cookies = { playerName: "player1" };
    req.game.players = [
      {
        name: "player1",
        assets: {
          shares: { MYT4U: { numberOfShares: 5 } }
        },
        hasShares: function(symbol) {
          return Object.keys(this.assets.shares).includes(symbol);
        }
      }
    ];
    req.game.nextPlayer = sinon.spy();
    res.json = sinon.spy();
  });
  it("should respond with true if player has required shares", function() {
    isSharePresent(req, res);
    sinon.assert.calledOnce(res.json);
    expect(res.json.firstCall.args[0]).to.be.deep.equals({ hasShares: true });
  });
  it("should respond with false if player doesn't have required shares", function() {
    req.game.activeCard.data.symbol = "ON2U";
    isSharePresent(req, res);
    sinon.assert.calledOnce(res.json);
    expect(res.json.firstCall.args[0]).to.be.deep.equals({ hasShares: false });
  });
});

describe("buyShares", function() {
  const req = {},
    res = {};
  beforeEach(() => {
    req.body = { numberOfShares: 5 };
    req.game = {
      isPlayerCapableToBuy: () => true,
      activeCard: {
        data: { relatedTo: "smallDeal", symbol: "MYT4U" }
      }
    };
    req.game.activityLog = { addActivity: sinon.spy() };
    req.game.hasShares = function() {
      return this.players[0].hasShares(this.activeCard.data.symbol);
    };
    req.cookies = { playerName: "player1" };
    req.game.players = [
      {
        name: "player1",
        assets: {
          shares: { MYT4U: { numberOfShares: 5 } }
        },
        hasShares: function(symbol) {
          return Object.keys(this.assets.shares).includes(symbol);
        }
      }
    ];
    req.game.nextPlayer = sinon.spy();
    req.game.buyShares = sinon.spy();
    res.json = sinon.spy();
  });
  it("should return statement", function() {
    buyShares(req, res);
    expect(res.json.calledOnce).to.be.true;
    expect(req.game.buyShares.calledOnce).to.be.true;
  });
});

describe("sellShares", function() {
  const req = {},
    res = {};
  beforeEach(() => {
    req.body = { numberOfShares: 5 };
    req.game = {
      isPlayerCapableToSell: () => true,
      activeCard: {
        data: { relatedTo: "smallDeal", symbol: "MYT4U" }
      }
    };
    req.game.activityLog = { addActivity: sinon.spy() };
    req.game.hasShares = function() {
      return this.players[0].hasShares(this.activeCard.data.symbol);
    };
    req.cookies = { playerName: "player1" };
    req.game.players = [
      {
        name: "player1",
        assets: {
          shares: { MYT4U: { numberOfShares: 5 } }
        },
        hasShares: function(symbol) {
          return Object.keys(this.assets.shares).includes(symbol);
        }
      }
    ];
    req.game.nextPlayer = sinon.spy();
    req.game.sellShares = sinon.spy();
    res.json = sinon.spy();
  });
  it("should call res.json once", function() {
    sellShares(req, res);
    expect(res.json.calledOnce).to.be.true;
    expect(req.game.sellShares.calledOnce).to.be.true;
  });
});

describe("removePlayer", function() {
  it("should return statement", function() {
    const req = {
      cookies: { playerName: "anu" },
      game: { removePlayer: sinon.spy() }
    };
    const res = { clearCookie: sinon.spy(), end: sinon.spy() };
    removePlayer(req, res);
    expect(res.end.calledOnce).to.be.true;
  });
});

describe("rollDiceForMLM", function() {
  it("should return statement", function() {
    const req = {
      cookies: { playerName: "anu" },
      game: { rollDiceForMLM: sinon.spy() }
    };
    const res = { clearCookie: sinon.spy(), send: sinon.spy() };
    rollDiceForMLM(req, res);
    expect(res.send.calledOnce).to.be.true;
  });
});

describe("handleAuction", function() {
  it("should return statement", function() {
    const req = {
      body: { action: true },
      cookies: { playerName: "anu" },
      game: { handleAuction: sinon.spy(), createAuction: sinon.spy() }
    };
    const res = {
      clearCookie: sinon.spy(),
      send: sinon.spy(),
      json: sinon.spy()
    };
    handleAuction(req, res);
    expect(res.json.calledOnce).to.be.true;
  });
});

describe("addToFastTrack", function() {
  it("should return statement", function() {
    const req = {
      cookies: { playerName: "anu" },
      game: { addToFasttrack: sinon.spy() }
    };
    const res = { clearCookie: sinon.spy(), end: sinon.spy() };
    addToFastTrack(req, res);
    expect(res.end.calledOnce).to.be.true;
  });
});

describe("handleBid", function() {
  it("should return statement", function() {
    const req = {
      body: { wantToBid: true },
      cookies: { playerName: "anu" },
      game: { currentAuction: { present: false } }
    };
    const res = { json: sinon.spy() };
    handleBid(req, res);
    expect(res.json.calledOnce).to.be.true;
  });

  it("should return statement", function() {
    const req = {
      body: { wantToBid: true },
      cookies: { playerName: "anu" },
      game: { currentAuction: { present: true }, handleBid: sinon.spy() }
    };
    const res = { json: sinon.spy() };
    handleBid(req, res);
    expect(res.json.calledOnce).to.be.true;
  });
});

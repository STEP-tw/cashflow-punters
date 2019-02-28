const Game = require("../../src/model/game");
const sinon = require("sinon");
const Cards = require("../../src/model/cards");
const Player = require("../../src/model/player");
const { expect } = require("chai");

describe("Game", function() {
  describe("addPlayer", function() {
    it("should add the given player to game.players", function() {
      const player = { name: "player", setNotification: () => {} };
      const cards = { bigdeals: [], smallDeals: [] };
      const game = new Game(cards);
      game.addPlayer(player);

      expect(game)
        .to.have.property("players")
        .to.be.an("Array");
      expect(game.players[0])
        .to.be.an("Object")
        .to.have.property("name");
    });
  });
  describe("getPlayerNames", function() {
    it("should return the list of player names in the game ", function() {
      const player1 = { name: "player1", setNotification: sinon.spy() };
      const player2 = { name: "player2", setNotification: sinon.spy() };
      const cards = { bigdeals: [], smallDeals: [] };
      const game = new Game(cards);
      game.addPlayer(player1);
      game.addPlayer(player2);

      const actualOutput = game.getPlayerNames();
      const expectedOutput = ["player1", "player2"];
      expect(actualOutput).to.deep.equals(expectedOutput);
    });
  });
  describe("nextPlayer", function() {
    it("should change current player to next player", function() {
      const player1 = new Player("player1");
      player1.setTurn(1);
      const player2 = new Player("player2");
      player2.setTurn(2);
      const cards = { bigdeals: [], smallDeals: [] };
      const game = new Game(cards);
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.setCurrentPlayer(player1);
      game.nextPlayer();
      expect(game.currentPlayer).to.deep.equal(player2);
    });
  });
});

describe("startGame", function() {
  it("should set the isStarted property of game to true", function() {
    const player1 = {
      name: "player1",
      setFinancialStatement: () => {},
      setNotification: sinon.spy()
    };
    const professions = new Cards([{ profession: "driver" }]);
    const game = new Game({ professions });
    game.addPlayer(player1);
    game.startGame();
    expect(game)
      .to.have.property("hasStarted")
      .to.equal(true);
  });
});

describe("getPlayersCount", function() {
  it("should return the number of players in the game", function() {
    const player1 = { name: "player1", setNotification: sinon.spy() };
    const player2 = { name: "player2", setNotification: sinon.spy() };
    const cards = { bigDeals: [], smallDeals: [] };
    const game = new Game(cards);
    game.addPlayer(player1);
    game.addPlayer(player2);

    const actualOutput = game.getPlayersCount();
    const expectedOutput = 2;

    expect(actualOutput).to.equal(expectedOutput);
  });
});

describe("isPlaceAvailable", function() {
  it("should tell weather there is place for any more player in the game or not", function() {
    const player1 = { name: "player1", setNotification: sinon.spy() };
    const player2 = { name: "player2", setNotification: sinon.spy() };
    const player3 = { name: "player3", setNotification: sinon.spy() };
    const cards = { bigDeals: [], smallDeals: [] };
    const game = new Game(cards);
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.addPlayer(player3);

    const actualOutput = game.isPlaceAvailable();
    const expectedOutput = true;

    expect(actualOutput).to.equal(expectedOutput);
  });
});

describe("handleSpace", function() {
  it("should call handleCrossedPayday if current players new space crossed payday space", function() {
    const game = new Game();
    game.currentPlayer = {};
    game.currentPlayer.currentSpace = 9;
    game.handleCrossedPayDay = sinon.spy();
    game.nextPlayer = sinon.spy();
    game.handleBabySpace = sinon.spy();
    game.board = {
      getSpaceType: sinon.stub()
    };

    game.board.getSpaceType.onFirstCall().returns("baby");
    game.handleSpace(5);

    expect(game.handleCrossedPayDay.calledOnce).to.be.true;
  });
});
describe("handleCrossedPayday", function() {
  let game;
  beforeEach(() => {
    game = new Game();
    game.currentPlayer = {
      addPayday: () => {},
      setNotification: function(msg) {
        this.notification = msg;
      },
      isBankrupted: function() {
        return this.cashflow < 0 && this.ledgerBalance + this.cashflow < 0;
      },
      isBankruptcy: sinon.spy()
    };

    game.board = {
      getPayDaySpaces: sinon.stub()
    };

    game.board.getPayDaySpaces.onFirstCall().returns([6, 14, 22]);
  });
  it("should addActivity on crossing payday", function() {
    game.currentPlayer.currentSpace = 10;
    game.handleCrossedPayDay(4);
    expect(game.activityLog[0].msg).to.equal(" crossed payday");
  });
  it("should addActivity's when crossed multiple payday's", function() {
    game.currentPlayer.currentSpace = 17;
    game.handleCrossedPayDay(5);
    expect(game.activityLog[1].msg).to.equal(" crossed payday");
  });
  it("should not addActivity's when player didn't cross payday", function() {
    game.currentPlayer.currentSpace = 3;
    game.handleCrossedPayDay(2);
    expect(game.activityLog).to.be.empty;
  });
});

describe("initializeGame", function() {
  it("should return initial details of player", function() {
    let cards = [{ 1: "p1" }, { 1: "p2" }];
    let professions = new Cards(cards);
    let game = new Game({ professions });
    const player1 = {
      name: "player1",
      setFinancialStatement: () => {},
      setNotification: sinon.spy()
    };
    const player2 = {
      name: "player2",
      setFinancialStatement: () => {},
      setNotification: sinon.spy()
    };

    game.addPlayer(player1);
    game.addPlayer(player2);
    game.initializeGame();

    expect(game)
      .to.have.property("currentPlayer")
      .to.be.an("Object");
    expect(game.players[0]).has.property("turn");
    expect(game.players[0]).has.property("profession");
    expect(game.players[1]).has.property("turn");
    expect(game.players[1]).has.property("profession");
  });
});

describe("handleDoodaySpace", function() {
  let game;
  beforeEach(() => {
    game = new Game();
    const card = {
      expenseAmount: 500
    };
    game.cardStore = { doodads: { drawCard: sinon.stub().returns(card) } };
    game.currentPlayer = {
      ledgerBalance: 3000,
      name: "swapnil",
      deductLedgerBalance: function(amount) {
        this.ledgerBalance -= amount;
      },
      setNotification: function(msg) {
        this.notification = msg;
      },
      isLedgerBalanceNegative: () => false
    };
    game.currentPlayer.addDebitEvent = sinon.spy();
    game.addActivity = sinon.spy();
    game.nextPlayer = sinon.spy();
  });

  it("should draw a card", function() {
    game.handleDoodadSpace();
    expect(game.cardStore.doodads.drawCard.calledOnce).to.be.true;
  });
  it("should deduct card expense from ledgerBalance", function() {
    game.handleDoodadSpace();
    expect(game.currentPlayer.ledgerBalance).equal(2500);
  });
  it("should call next player", function() {
    game.handleDoodadSpace();
    expect(game.nextPlayer.calledOnce).to.be.true;
  });
});

describe("handleMarketCard", function() {
  it("should draw a card ", function() {
    game = new Game();
    const card = {
      expenseAmount: 500
    };
    game.cardStore = { market: { drawCard: sinon.stub().returns(card) } };
    game.currentPlayer = {
      assets: { savings: 1000 },
      name: "swapnil"
    };
    game.addActivity = sinon.spy();
    game.nextPlayer = sinon.spy();
    game.handleMarketSpace();
    expect(game.cardStore.market.drawCard.calledOnce).to.be.true;
  });

  it("should call next player", function() {
    game.nextPlayer = sinon.spy();
    game.handleMarketSpace();
    expect(game.nextPlayer.calledOnce).to.be.true;
  });
});

describe("handleMarketCard", function() {
  it("should deduct expense amount from ledger balance if market card related to expense is drawn ", function() {
    game = new Game();
    const card = {
      relatedTo: "expense",
      expenseAmount: 500,
      cash: 500
    };
    game.cardStore = { market: { drawCard: sinon.stub().returns(card) } };
    game.currentPlayer = {
      ledgerBalance: 3000,
      name: "swapnil",
      deductLedgerBalance: function(amount) {
        this.ledgerBalance -= amount;
      },
      setNotification: function(msg) {
        this.notification = msg;
      },
      isLedgerBalanceNegative: () => false
    };
    game.addActivity = sinon.spy();
    game.nextPlayer = sinon.spy();
    game.currentPlayer.addDebitEvent = sinon.spy();
    game.handleMarketSpace();
    expect(game.cardStore.market.drawCard.calledOnce).to.be.true;
    expect(game.addActivity.calledOnce).to.be.true;
    expect(game.currentPlayer.ledgerBalance).to.be.equal(2500);
  });
});

describe("addBaby", function() {
  it("should add baby to current player", function() {
    const player1 = new Player("player");
    const cards = { bigdeals: [], smallDeals: [] };
    const game = new Game(cards);
    game.addPlayer(player1);
    game.currentPlayer = player1;
    player1.addExpense = sinon.spy();
    game.handleBabySpace();
    expect(game.currentPlayer.childrenCount).to.equal(1);
  });
});

describe("handleCharitySpace", function() {
  it("should set gotCharitySpace of currentplayer true ", function() {
    const game = new Game();
    game.currentPlayer = {};
    game.handleCharitySpace();
    expect(game.currentPlayer.gotCharitySpace).to.be.true;
  });
});

describe("handlePayday", function() {
  it("should call game method nextPlayer", function() {
    const game = new Game();
    const player = {
      name: "player1",
      ledgerBalance: 3000,
      cashflow: 1000,
      addPayday: function() {
        this.ledgerBalance += this.cashflow;
      },
      getTurn: sinon.spy(),
      setNotification: function(msg) {
        this.notification = msg;
      },
      isBankrupted: function() {
        return this.cashflow < 0 && this.ledgerBalance + this.cashflow < 0;
      },
      isBankruptcy: sinon.spy()
    };
    game.addPlayer(player);
    game.setCurrentPlayer(player);
    game.handlePayday();
    expect(game.currentPlayer.ledgerBalance).to.be.equal(4000);
  });
});

describe("handleSmallDeal", function() {
  it("should add activityLog selected small deal", function() {
    const game = new Game();
    game.addActivity = sinon.spy();
    game.nextPlayer = sinon.spy();
    game.currentPlayer = { name: "anabelle" };
    game.cardStore = { smallDeals: { drawCard: sinon.stub().returns("") } };
    game.handleSmallDeal();
    expect(game.addActivity.firstCall.args).eql([
      " selected Small Deal",
      "anabelle"
    ]);
  });
});
describe("handleBigDeal", function() {
  it("should add activityLog selected Big deal", function() {
    const game = new Game();
    game.addActivity = sinon.spy();
    game.nextPlayer = sinon.spy();
    game.currentPlayer = { name: "anabelle" };
    game.cardStore = { bigDeals: { drawCard: sinon.stub().returns("") } };

    game.handleBigDeal();
    expect(game.addActivity.firstCall.args).eql([
      " selected Big Deal",
      "anabelle"
    ]);
  });
});
describe("grantLoan", function() {
  it("should grant loan to the given input player of given amount", function() {
    const game = new Game();
    const player = {
      setNotification: function(msg) {
        this.notification = msg;
      }
    };

    player.name = "player";
    player.addLiability = sinon.spy();
    player.addExpense = sinon.spy();
    player.updateFinancialStatement = sinon.spy();
    player.addCreditEvent = sinon.spy();
    game.getPlayerByName = sinon.stub();
    game.getPlayerByName.onFirstCall().returns(player);

    game.grantLoan("player", 5000);

    sinon.assert.calledOnce(player.addLiability);
    sinon.assert.calledOnce(player.addExpense);
    sinon.assert.calledOnce(player.updateFinancialStatement);
  });
});

describe("payDebt", function() {
  it("should grant loan to the given input player of given amount", function() {
    const game = new Game();
    const player = {
      setNotification: function(msg) {
        this.notification = msg;
      }
    };

    player.name = "player";

    player.removeLiability = sinon.spy();
    player.removeExpense = sinon.spy();
    player.addDebitEvent = sinon.spy();
    player.updateFinancialStatement = sinon.spy();
    game.getPlayerByName = sinon.stub();
    game.getPlayerByName.onFirstCall().returns(player);

    game.payDebt("player", 5000);

    sinon.assert.calledOnce(player.removeLiability);
    sinon.assert.calledOnce(player.removeExpense);
    sinon.assert.calledOnce(player.addDebitEvent);
    sinon.assert.calledOnce(player.updateFinancialStatement);
  });
});

describe("getPlayerByName", function() {
  it("should grant loan to the given input player of given amount", function() {
    const game = new Game();
    const players = [
      { name: "player", profession: "janiator" },
      { name: "player1", profession: "driver" }
    ];
    game.players = players;

    const actualOutput = game.getPlayerByName("player");
    const expectedOutput = { name: "player", profession: "janiator" };

    expect(actualOutput).to.deep.equals(expectedOutput);
  });
});

describe("hasShares", function() {
  it("should return true if player has shares", function() {
    let player = new Player("player1");
    player.assets = {};
    player.assets.shares = { MYT4U: { numberOfShares: 5 } };
    let game = new Game();
    game.activeCard = {
      data: { symbol: "MYT4U" }
    };
    game.addPlayer(player);
    game.setCurrentPlayer(player);
    expect(game.hasShares("player1")).to.be.true;
  });
});

describe("buyShares", function() {
  it("should add shares in player's assets", function() {
    let player = new Player("player1");
    player.ledgerBalance = 500;
    player.assets = {};
    player.assets.shares = {};
    let game = new Game();
    game.activeCard = {
      data: { symbol: "MYT4U", currentPrice: 10 }
    };
    game.addPlayer(player);
    game.setCurrentPlayer(player);
    game.buyShares(5);
    expect(player.assets.shares)
      .to.have.property("MYT4U")
      .to.be.deep.equals({ numberOfShares: 5, currentPrice: 10 });
    expect(player.ledgerBalance).to.be.equal(450);
  });
});

describe("sellShares", function() {
  it("should sell shares in player's assets", function() {
    let player = new Player("player1");
    player.ledgerBalance = 500;
    player.assets = {};
    player.assets.shares = { MYT4U: { numberOfShares: 5, currentPrice: 10 } };
    let game = new Game();
    game.activeCard = {
      data: { symbol: "MYT4U", currentPrice: 10 }
    };
    game.addPlayer(player);
    game.setCurrentPlayer(player);
    game.sellShares("player1", 4);
    expect(player.assets.shares)
      .to.have.property("MYT4U")
      .to.be.deep.equals({ numberOfShares: 1, currentPrice: 10 });
    expect(player.ledgerBalance).to.be.equal(540);
  });
});

describe("isCapableToBuy", function() {
  it("should return false if player is capable to buy shares", function() {
    let player = new Player("player1");
    player.assets = {};
    player.ledgerBalance = 500;
    player.assets.shares = { MYT4U: { numberOfShares: 5, currentPrice: 10 } };
    let game = new Game();
    game.activeCard = {
      data: { symbol: "MYT4U", currentPrice: 10 }
    };
    game.addPlayer(player);
    game.setCurrentPlayer(player);
    expect(game.isPlayerCapableToBuy(5)).to.be.true;
  });

  it("should return false if player is capable to buy shares", function() {
    let player = new Player("player1");
    player.assets = {};
    player.ledgerBalance = 30;
    player.assets.shares = { MYT4U: { numberOfShares: 5, currentPrice: 10 } };
    let game = new Game();
    game.activeCard = {
      data: { symbol: "MYT4U", currentPrice: 10 }
    };
    game.addPlayer(player);
    game.setCurrentPlayer(player);
    expect(game.isPlayerCapableToBuy(5)).to.be.false;
  });
});

describe("isCapableToSell", function() {
  it("should return false if player is capable to buy shares", function() {
    let player = new Player("player1");
    player.assets = {};
    player.ledgerBalance = 500;
    player.assets.shares = { MYT4U: { numberOfShares: 5, currentPrice: 10 } };
    let game = new Game();
    game.activeCard = {
      data: { symbol: "MYT4U", currentPrice: 10 }
    };
    game.addPlayer(player);
    game.setCurrentPlayer(player);
    expect(game.isPlayerCapableToSell("player1", 5)).to.be.true;
  });

  it("should return false if player is capable to buy shares", function() {
    let player = new Player("player1");
    player.assets = {};
    player.ledgerBalance = 30;
    player.assets.shares = { MYT4U: { numberOfShares: 5, currentPrice: 10 } };
    let game = new Game();
    game.activeCard = {
      data: { symbol: "MYT4U", currentPrice: 10 }
    };
    game.addPlayer(player);
    game.setCurrentPlayer(player);
    expect(game.isPlayerCapableToSell("player1", 50)).to.be.false;
  });
});

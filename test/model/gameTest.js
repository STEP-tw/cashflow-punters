const Game = require("../../src/model/game");
const sinon = require("sinon");
const Cards = require("../../src/model/cards");
const Player = require("../../src/model/player");
const { expect } = require("chai");

describe("Game", function() {
  describe("addPlayer", function() {
    it("should add the given player to game.players", function() {
      const player = { name: "player" };
      const cards = { bigdeals: [], smallDeals: [] };
      const game = new Game(cards);
      game.addPlayer(player);

      expect(game)
        .to.have.property("players")
        .to.be.an("Array")
        .to.deep.equals([{ name: "player" }]);
    });
  });
  describe("getPlayerNames", function() {
    it("should return the list of player names in the game ", function() {
      const player1 = { name: "player1" };
      const player2 = { name: "player2" };
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
    const player1 = { name: "player1" };
    const cards = { bigDeals: [], smallDeals: [] };
    const game = new Game(cards);
    game.addPlayer(player1);
    game.startGame();
    expect(game)
      .to.have.property("hasStarted")
      .to.equal(true);
  });
});

describe("getPlayersCount", function() {
  it("should return the number of players in the game", function() {
    const player1 = { name: "player1" };
    const player2 = { name: "player2" };
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
    const player1 = { name: "player1" };
    const player2 = { name: "player2" };
    const player3 = { name: "player3" };
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
    game.handleSpace(5);
    expect(game.handleCrossedPayDay.calledOnce).to.be.true;
  });
});
describe("handleCrossedPayday", function() {
  let game;
  beforeEach(() => {
    game = new Game();
    game.currentPlayer = { addPayday: () => {} };
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

describe("getInitialDetails", function() {
  it("should return initial details of player", function() {
    let cards = new Cards([{ 1: "p1" }, { 1: "p2" }]);
    let professions = new Cards(cards);
    let game = new Game({ professions });
    const player1 = { name: "player1", setFinancialStatement: () => {} };
    const player2 = { name: "player2", setFinancialStatement: () => {} };

    game.addPlayer(player1);
    game.addPlayer(player2);
    game.getInitialDetails();

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
      profession: { assets: { savings: 1000 } },
      name: "swapnil"
    };
    game.addActivity = sinon.spy();
    game.nextPlayer = sinon.spy();
  });

  it("should draw a card", function() {
    game.handleDoodadSpace();
    expect(game.cardStore.doodads.drawCard.calledOnce).to.be.true;
  });
  it("should deduct card expense from savings ", function() {
    game.handleDoodadSpace();
    expect(game.currentPlayer.profession.assets.savings).equal(500);
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
      profession: { assets: { savings: 1000 } },
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
  it("should reduce expense amount if market card related to expense is drawn ", function() {
    game = new Game();
    const card = {
      relatedTo: "expense",
      expenseAmount: 500,
      cash: 500
    };
    game.cardStore = { market: { drawCard: sinon.stub().returns(card) } };
    game.currentPlayer = {
      profession: { assets: { savings: 1000 } },
      name: "swapnil"
    };
    game.addActivity = sinon.spy();
    game.nextPlayer = sinon.spy();
    game.handleMarketSpace();
    expect(game.cardStore.market.drawCard.calledOnce).to.be.true;
    expect(game.addActivity.calledOnce).to.be.true;
  });
});

describe("addBaby", function() {
  it("should add the given player to game.players", function() {
    const player = { name: "player" };
    const player1 = new Player(player);
    const cards = { bigdeals: [], smallDeals: [] };
    const game = new Game(cards);
    game.addPlayer(player1);
    game.currentPlayer = player1;
    game.handleBabySpace();
    expect(game.currentPlayer.childrenCount).to.equal(1);
  });
  describe("handleCharitySpace", function() {
    it("should set gotCharitySpace of currentplayer true ", function() {
      const game = new Game();
      game.currentPlayer = {};
      game.handleCharitySpace();
      expect(game.currentPlayer.gotCharitySpace).to.be.true;
    });
  });
  describe("handleDownsizedSpace", function() {
    it("should call game method nextPlayer", function() {
      const game = new Game();
      game.nextPlayer = sinon.spy();
      game.handleDownsizedSpace();
      expect(game.nextPlayer.calledOnce).to.be.true;
    });
  });
  describe("handlePayday", function() {
    it("should call game method nextPlayer", function() {
      const game = new Game();
      game.nextPlayer = sinon.spy();
      game.handlePayday();
      expect(game.nextPlayer.calledOnce).to.be.true;
    });
  });
});

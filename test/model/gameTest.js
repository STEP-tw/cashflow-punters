const Game = require("../../src/model/game");
const Player = require("../../src/model/player");
const {expect} = require("chai");

describe("Game", function() {
  describe("addPlayer", function() {
    it("should add the given player to game.players", function() {
      const player = {name: "player"};
      const cards = {bigdeals: [], smallDeals: []};
      const game = new Game(cards);
      game.addPlayer(player);

      expect(game)
        .to.have.property("players")
        .to.be.an("Array")
        .to.deep.equals([{name: "player"}]);
    });
  });
  describe("getPlayerNames", function() {
    it("should return the list of player names in the game ", function() {
      const player1 = {name: "player1"};
      const player2 = {name: "player2"};
      const cards = {bigdeals: [], smallDeals: []};
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
      const cards = {bigdeals: [], smallDeals: []};
      const game = new Game(cards);
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.setCurrentPlayer(player1);
      game.nextPlayer();
      expect(game.currentPlayer).to.deep.equal(player2);
    });
  });
});

describe("getInitialDetails", function() {
  it("should assign the turn and profession to player ", function() {
    const player1 = {name: "player1"};
    const player2 = {name: "player2"};
    const cards = {professions: {cards: ["doctor"], usedCard: () => {}}};
    const game = new Game(cards);
    game.addPlayer(player1);
    game.addPlayer(player2);

    game.getInitialDetails();
    expect(game.players[0]).has.property("turn");
    expect(game.players[0]).has.property("profession");
  });
});

describe("startGame", function() {
  it("should set the isStarted property of game to true", function() {
    const player1 = {name: "player1"};
    const cards = {bigDeals: [], smallDeals: []};
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
    const player1 = {name: "player1"};
    const player2 = {name: "player2"};
    const cards = {bigDeals: [], smallDeals: []};
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
    const player1 = {name: "player1"};
    const player2 = {name: "player2"};
    const player3 = {name: "player3"};
    const cards = {bigDeals: [], smallDeals: []};
    const game = new Game(cards);
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.addPlayer(player3);

    const actualOutput = game.isPlaceAvailable();
    const expectedOutput = true;

    expect(actualOutput).to.equal(expectedOutput);
  });
});

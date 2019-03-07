const Game = require("../../src/model/game");
const sinon = require("sinon");
const Cards = require("../../src/model/cards");
const Player = require("../../src/model/player");
const { expect } = require("chai");
const Board = require("../../src/model/board");
const { gameSpaces } = require("../../src/constant");

describe("handleSpace", function() {
  let game, player1;
  beforeEach(() => {
    player1 = new Player("player1");
    player1.assets = {
      shares: {
        GRO4US: { symbol: "GRO4US", numberOfShares: 10 }
      }
    };
    player1.setTurn(1);
    const professionCards = [
      {
        profession: "Teacher",
        income: { salary: 3300 },
        expenses: {
          taxes: 500,
          "Home Mortgage Payment": 500,
          "School Loan Payment": 100,
          "Car Loan Payment": 100,
          "Credit Card Payment": 200,
          "Other Expenses": 700,
          "Bank Loan Payment": 0,
          "Child Expenses": 0
        },
        perChildExpense: 200,
        assets: { savings: 400 },
        liabilities: {
          "Home Mortgage": 50000,
          "School Loan": 12000,
          "Car Loan": 5000,
          "Credit Card": 4000
        }
      }
    ];

    const doodadCards = [
      {
        title: "VISIT THE DENTIST",
        expenseAmount: 700,
        isChildExpense: false
      }
    ];

    const marketCards = [
      {
        title: "House Buyer - 3BR/2BA",
        message:
          "Buyer searching for 3BA/2BA house. Offers your original cost plus $15000.",
        type: "optional",
        relatedRealEstates: ["3BR/2BA house"],
        relatedTo: "realEstate",
        applicableTo: "everyone",
        gettingMoneyIn: "cash",
        cash: 15000,
        percentage: null
      }
    ];

    const smallDealCards = [
      {
        title: "Condo for Sale - 2BR/1BA",
        message:
          "Excellent 2/1 condo with many extras. Owner wants to relocate for dream job FAST! She's moving up- you can too! No Cash Flow, but a possible capital gains opportunity",
        relatedTo: "realEstate",
        type: "2BR/1BA condo",
        cost: 40000,
        mortgage: 39000,
        downPayment: 1000,
        cashflow: 0
      }
    ];

    const bigDealCards = [
      {
        title: "Duplex for Sale",
        message:
          "Owner is moving out of this duplex due to growing family. Tenant in other unit remains and new tenant waiting to move into this well-maintained property.",
        type: "duplex",
        cost: 250000,
        mortgage: 234000,
        downPayment: 16000,
        cashflow: 900
      }
    ];

    const professions = new Cards(professionCards);
    const doodads = new Cards(doodadCards);
    const market = new Cards(marketCards);
    const smallDeals = new Cards(smallDealCards);
    const bigDeals = new Cards(bigDealCards);
    const cardStore = { professions, doodads, market, smallDeals, bigDeals };
    const board = new Board(gameSpaces);

    game = new Game(cardStore, board);

    game.board = {
      getPayDaySpaces: sinon.stub()
    };

    game.board.getPayDaySpaces.onFirstCall().returns([6, 14, 22]);
  });

  describe("rollDiceForSplitReverse", function() {
    it("should split shares if dice value is more than 3.", function() {
      player1.rollDie = sinon.stub();
      player1.rollDie.onFirstCall().returns(5);
      game.addPlayer(player1);
      game.setCurrentPlayer(player1);
      game.rollDiceForSplitReverse("GRO4US", 3);
      expect(player1.assets.shares["GRO4US"].numberOfShares).is.equal(5);
    });

    it("should split shares if dice value is more than 3.", function() {
      player1.rollDie = sinon.stub();
      player1.rollDie.onFirstCall().returns(5);
      game.addPlayer(player1);
      game.setCurrentPlayer(player1);
      game.rollDiceForSplitReverse("GRO4US", 3);
      expect(game.activityLog.activityLog[0])
        .has.property("playerName")
        .equal("player1");
      expect(game.activityLog.activityLog[0])
        .has.property("msg")
        .equal("'s shares of GRO4US got halved");
    });

    it("should doulbe shares if dice value is less than 4.", function() {
      player1.rollDie = sinon.stub();
      player1.rollDie.onFirstCall().returns(1);
      game.addPlayer(player1);
      game.setCurrentPlayer(player1);
      game.rollDiceForSplitReverse("GRO4US", 3);
      expect(game.activityLog.activityLog[0])
        .has.property("playerName")
        .equal("player1");
      expect(game.activityLog.activityLog[0])
        .has.property("msg")
        .equal("'s shares of GRO4US got doubled");
    });

    it("should double shares if dice value is less than 4.", function() {
      player1.rollDie = sinon.stub();
      player1.rollDie.onFirstCall().returns(2);
      game.addPlayer(player1);
      game.setCurrentPlayer(player1);
      game.rollDiceForSplitReverse("GRO4US", 3);
      expect(player1.assets.shares["GRO4US"].numberOfShares).is.equal(20);
    });
  });

  describe("addPlayer", function() {
    it("should add the given player to game.players", function() {
      game.addPlayer(player1);
      game.initializeGame();

      expect(game)
        .to.have.property("players")
        .to.be.an("Array");
    });
  });

  describe("getPlayerNames", function() {
    it("should return the list of player names in the game ", function() {
      game.players = [{ name: "player1" }, { name: "player2" }];

      const actualOutput = game.getPlayerNames();
      const expectedOutput = ["player1", "player2"];
      expect(actualOutput).to.deep.equals(expectedOutput);
    });
  });

  describe("startGame", function() {
    it("should set the isStarted property of game to true", function() {
      game.addPlayer(player1);
      game.initializeGame();
      game.startGame();
      expect(game)
        .to.have.property("hasStarted")
        .to.equal(true);
    });
  });

  describe("handleCrossedPayday", function() {
    it("should addActivity on crossing payday", function() {
      game.addPlayer(player1);
      game.initializeGame();

      game.currentPlayer.currentSpace = 10;
      game.handleCrossedPayDay(4);
      expect(game.activityLog.activityLog[2].msg).to.equal(" crossed payday");
    });

    it("should addActivity's when crossed multiple payday's", function() {
      game.addPlayer(player1);
      game.initializeGame();

      game.currentPlayer.currentSpace = 17;
      game.handleCrossedPayDay(5);
      expect(game.activityLog.activityLog[3].msg).to.equal(" crossed payday");
    });

    it("should not addActivity's when player didn't cross payday", function() {
      game.addPlayer(player1);
      game.initializeGame();

      game.currentPlayer.currentSpace = 3;
      game.handleCrossedPayDay(2);
      expect(game.activityLog.activityLog)
        .to.be.an("Array")
        .of.length(2);
    });
  });
  describe("nextPlayer", function() {
    it("should change current player to next player", function() {
      game.addPlayer(player1);
      game.initializeGame();
      game.nextPlayer();

      expect(game.currentPlayer.rolledDice).to.equals(false);
    });
  });
  describe("handleDoodadSpace", function() {
    it("should deduct card expense from ledgerBalance", function() {
      game.addPlayer(player1);
      game.initializeGame();

      game.handleDoodadSpace();
      expect(game.currentPlayer.ledgerBalance).equal(900);
    });
    it("should call next player", function() {
      game.addPlayer(player1);
      game.initializeGame();

      game.nextPlayer = sinon.spy();
      game.handleDoodadSpace();
      sinon.assert.calledOnce(game.nextPlayer);
    });
  });

  describe("sellShares", function() {
    it("should sell shares in player's assets", function() {
      game.addPlayer(player1);
      game.initializeGame();

      const player = game.players[0];
      player.ledgerBalance = 500;
      player.assets = {};
      player.assets.shares = {
        MYT4U: { numberOfShares: 5, currentPrice: 10 }
      };
      game.activeCard = {
        data: { symbol: "MYT4U", currentPrice: 10 }
      };
      game.sellShares("player1", 4);

      expect(player.assets.shares)
        .to.have.property("MYT4U")
        .to.be.deep.equals({ numberOfShares: 1, currentPrice: 10 });
      expect(player.ledgerBalance).to.be.equal(540);
    });
  });

  describe("hasShares", function() {
    it("should return true if player has shares", function() {
      game.addPlayer(player1);
      game.initializeGame();

      const player = game.players[0];
      player.assets = {};
      player.assets.shares = { MYT4U: { numberOfShares: 5 } };
      game.activeCard = {
        data: { symbol: "MYT4U" }
      };
      expect(game.hasShares("player1")).to.be.true;
    });
  });
  describe("getPlayersCount", function() {
    it("should return the number of players in the game", function() {
      game.addPlayer(player1);
      game.initializeGame();

      const actualOutput = game.getPlayersCount();
      const expectedOutput = 1;

      expect(actualOutput).to.equal(expectedOutput);
    });
  });
  describe("isPlaceAvailable", function() {
    it("should tell weather there is place for any more player in the game or not", function() {
      game.addPlayer(player1);
      game.initializeGame();

      const actualOutput = game.isPlaceAvailable();
      const expectedOutput = true;

      expect(actualOutput).to.equal(expectedOutput);
    });
  });
  describe("handleSpace", function() {
    it("should call handleCrossedPayday if current players new space crossed payday space", function() {
      game.addPlayer(player1);
      game.initializeGame();

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

  describe("initializeGame", function() {
    it("should return initial details of player", function() {
      game.addPlayer(player1);
      game.initializeGame();

      expect(game)
        .to.have.property("currentPlayer")
        .to.be.an("Object");
      expect(game.players[0]).has.property("turn");
      expect(game.players[0]).has.property("profession");
    });
  });

  describe("handleMarketCard", function() {
    it("should draw a card ", function() {
      game.addPlayer(player1);
      game.setCurrentPlayer(player1);
      game.initializeGame();
      game.handleMarketSpace();

      expect(game.activeCard)
        .to.be.an("Object")
        .to.have.property("data")
        .to.be.an("Object");
    });
  });

  describe("handleMarketCard", function() {
    it("should deduct expense amount from ledger balance if market card related to expense is drawn ", function() {
      game.addPlayer(player1);
      game.initializeGame();

      const card = {
        relatedTo: "expense",
        expenseAmount: 500,
        cash: 500
      };
      game.cardStore = { market: { drawCard: sinon.stub().returns(card) } };

      game.handleMarketSpace();
      expect(game.cardStore.market.drawCard.calledOnce).to.be.true;
      expect(game.currentPlayer.ledgerBalance).to.be.equal(1100);
    });
  });

  describe("addBaby", function() {
    it("should add baby to current player", function() {
      game.addPlayer(player1);
      game.initializeGame();

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
      game.addPlayer(player1);
      game.initializeGame();
      game.handlePayday();

      expect(game.currentPlayer.ledgerBalance).to.be.equal(2800);
    });
  });

  describe("handleSmallDeal", function() {
    it("should add activityLog selected small deal", function() {
      game.addPlayer(player1);
      game.initializeGame();
      game.activityLog.addActivity = sinon.spy();
      game.handleSmallDeal();

      expect(game.activityLog.addActivity.firstCall.args).eql([
        " selected Small Deal.",
        "player1"
      ]);
    });
  });

  describe("handleBigDeal", function() {
    it("should add activityLog selected Big deal", function() {
      game.addPlayer(player1);
      game.initializeGame();
      game.activityLog.addActivity = sinon.spy();

      game.handleBigDeal();
      expect(game.activityLog.addActivity.firstCall.args).eql([
        " selected Big Deal.",
        "player1"
      ]);
    });
  });

  describe("grantLoan", function() {
    it("should grant loan to the given input player of given amount", function() {
      game.addPlayer(player1);
      game.initializeGame();
      game.grantLoan("player1", 5000);

      expect(game.currentPlayer.ledgerBalance).to.equals(6600);
    });
  });

  describe("payDebt", function() {
    it("should grant loan to the given input player of given amount", function() {
      game.addPlayer(player1);
      game.initializeGame();
      game.grantLoan("player1", 5000);

      const debtDetails = {
        expense: "Bank Loan Payment",
        liability: "Bank Loan",
        liabilityPrice: "4000",
        expenseAmount: "400"
      };

      game.payDebt("player1", debtDetails);

      expect(game.currentPlayer.ledgerBalance).to.equals(2600);
    });
  });

  describe("getPlayerByName", function() {
    it("should return the player when player name as input is given", function() {
      game.addPlayer(player1);
      game.initializeGame();

      const actualOutput = game.getPlayerByName("player1");
      const expectedOutput = { name: "player", profession: "janiator" };

      expect(game.getPlayerByName("player1")).to.be.an("Object");
    });
  });

  describe("buyShares", function() {
    it("should add shares in player's assets", function() {
      game.addPlayer(player1);
      game.initializeGame();
      game.activeCard = {
        data: { symbol: "MYT4U", currentPrice: 10 }
      };

      const player = game.players[0];

      game.buyShares(5);
      expect(player.assets.shares)
        .to.have.property("MYT4U")
        .to.be.deep.equals({ numberOfShares: 5, currentPrice: 10 });
      expect(player.ledgerBalance).to.be.equal(1550);
    });
  });
  describe("sellShares", function() {
    it("should sell shares in player's assets", function() {
      game.addPlayer(player1);
      game.initializeGame();
      const player = game.players[0];
      player.assets.shares = { MYT4U: { numberOfShares: 5, currentPrice: 5 } };
      game.activeCard = {
        data: { symbol: "MYT4U", currentPrice: 10 }
      };
      game.sellShares("player1", 4);

      expect(player.assets.shares)
        .to.have.property("MYT4U")
        .to.be.deep.equals({ numberOfShares: 1, currentPrice: 5 });
      expect(player.ledgerBalance).to.be.equal(1640);
    });
  });

  describe("isCapableToBuy", function() {
    it("should return false if player is capable to buy shares", function() {
      game.addPlayer(player1);
      game.initializeGame();
      const player = game.players[0];
      player.assets.shares = {
        MYT4U: { numberOfShares: 5, currentPrice: 10 }
      };
      game.activeCard = {
        data: { symbol: "MYT4U", currentPrice: 10 }
      };

      expect(game.isPlayerCapableToBuy(5)).to.be.true;
    });

    it("should return false if player is capable to buy shares", function() {
      game.addPlayer(player1);
      game.initializeGame();
      const player = game.players[0];
      player.ledgerBalance = 30;
      player.assets.shares = {
        MYT4U: { numberOfShares: 5, currentPrice: 10 }
      };
      game.activeCard = {
        data: { symbol: "MYT4U", currentPrice: 10 }
      };

      expect(game.isPlayerCapableToBuy(5)).to.be.false;
    });
  });

  describe("isCapableToSell", function() {
    it("should return false if player is capable to buy shares", function() {
      game.addPlayer(player1);
      game.initializeGame();
      const player = game.players[0];
      player.assets.shares = { MYT4U: { numberOfShares: 5, currentPrice: 10 } };
      game.activeCard = {
        data: { symbol: "MYT4U", currentPrice: 10 }
      };

      expect(game.isPlayerCapableToSell("player1", 5)).to.be.true;
    });

    it("should return false if player is capable to buy shares", function() {
      game.addPlayer(player1);
      game.initializeGame();
      const player = game.players[0];
      player.assets.shares = { MYT4U: { numberOfShares: 5, currentPrice: 10 } };
      game.activeCard = {
        data: { symbol: "MYT4U", currentPrice: 10 }
      };

      expect(game.isPlayerCapableToSell("player1", 50)).to.be.false;
    });
  });

  describe("removePlayer", function() {
    it("should remove the player form players array and add the activity into activity log", function() {
      game.addPlayer(player1);
      game.initializeGame();
      game.removePlayer("player1");

      expect(game.players)
        .to.be.an("Array")
        .of.length(0);
    });
  });

  describe("rollDiceForMLM", function() {
    it("should process the rolling dice of current player and return false when turn is not still over", function() {
      game.addPlayer(player1);
      game.initializeGame();
      game.board.getSpaceType = sinon.stub();
      game.board.getSpaceType.onFirstCall().returns("deal");
      const player = game.players[0];
      const MLMCard = { cost: 500 };
      player.addMLM(MLMCard);
      player.addMLM(MLMCard);

      expect(game.rollDiceForMLM())
        .to.be.an("Object")
        .to.have.property("isMLMTurnLeft")
        .to.equal(true);
    });

    it("should process the rolling dice of current player and return true when mlm turn is over", function() {
      game.addPlayer(player1);
      game.initializeGame();
      game.handleSpace = sinon.spy();
      game.board.getSpaceType = sinon.stub();
      game.board.getSpaceType.onFirstCall().returns("deal");
      const player = game.players[0];
      const MLMCard = { cost: 500 };
      player.addMLM(MLMCard);

      expect(game.rollDiceForMLM())
        .to.be.an("Object")
        .to.have.property("isMLMTurnLeft")
        .to.equal(false);
      sinon.assert.calledOnce(game.handleSpace);
    });
  });

  describe("rollDiceForMLM", function() {
    it("should process the rolling dice of current player and return false when turn is not still over", function() {
      game.addPlayer(player1);
      game.initializeGame();

      game.addToFasttrack("player1");

      expect(game.players[0])
        .to.have.property("notifyEscape")
        .to.equal(false);

      expect(game)
        .to.have.property("fasttrackPlayers")
        .to.have.length(1);
    });
  });

  describe("hasCharityTurns", function() {
    it("should call the player function hasCharityturns", function() {
      game.addPlayer(player1);
      game.initializeGame();
      const player = game.players[0];
      player.hasCharityTurns = sinon.spy();
      game.hasCharityTurns();

      sinon.assert.calledOnce(player.hasCharityTurns);
    });
  });

  describe("rollDice", function() {
    it("should roll dice of player and should check for bankruptcy and mlm", function() {
      game.addPlayer(player1);
      game.initializeGame();
      game.board.getSpaceType = sinon.stub();
      game.board.getSpaceType.onFirstCall().returns("deal");
      const player = game.players[0];
      player.rollDiceAndMove = sinon.stub();
      player.rollDiceAndMove.onFirstCall().returns([1, 2]);
      game.handleSpace = sinon.stub();
      game.handleSpace.onFirstCall().returns(false);

      expect(game.rollDice(1))
        .to.be.an("Object")
        .to.have.property("diceValues")
        .to.deep.equals([1,2]);
    });
  });
});
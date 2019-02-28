const Player = require("../../src/model/player.js");
const CashLedger = require("./../../src/model/cashLedger.js");
const { expect } = require("chai");
const _ = require("lodash");

describe("Player", function() {
  describe("move", () => {
    it("should change the current space after moving", function() {
      const player = new Player("player1");
      player.move(3);
      expect(player.currentSpace).to.equal(3);
      player.move(21);
      expect(player.currentSpace).to.equal(24);
    });
    it("should start with 1 after 24 currentSpace", function() {
      const player = new Player("player1");
      player.move(24);
      expect(player.currentSpace).to.equal(24);
    });
  });

  describe("addCharityTurn", function() {
    it("should add 3 charity turns in player", function() {
      const player = new Player("player1");
      player.addCharityTurn();

      expect(player)
        .to.have.a.property("charityTurns")
        .to.be.equal(3);
    });
  });

  describe("getLedgerBalance", function() {
    it("should return player ledger balance.", function() {
      const player = new Player("player1");
      player.ledgerBalance = 3000;
      const actualOutput = player.getLedgerBalance();
      expect(actualOutput).to.be.equal(3000);
    });
  });

  describe("isAbleToDoCharity", function() {
    it("should return true if player is able to do charity", function() {
      const player = new Player("player1");
      player.ledgerBalance = 3000;
      player.totalIncome = 5000;
      const actualOutput = player.isAbleToDoCharity();
      expect(actualOutput).to.be.true;
    });

    it("should return false if player is not able to do charity", function() {
      const player = new Player("player1");
      player.ledgerBalance = 300;
      player.totalIncome = 5000;
      const actualOutput = player.isAbleToDoCharity();
      expect(actualOutput).to.be.false;
    });
  });
});

describe("downsize", function() {
  let player;
  beforeEach(() => {
    const profession = {
      profession: "Truck Driver",
      income: { salary: 2500 },
      expenses: {
        taxes: 500,
        "Home Mortgage Payment": 400,
        "School Loan Payment": 0,
        "Car Loan Payment": 100,
        "Credit Card Payment": 100,
        "Other Expenses": 600,
        "Bank Loan Payment": 0,
        "Child Expenses": 0
      },
      perChildExpense: 200,
      assets: { savings: 800 },
      liabilities: {
        "Home Mortgage": 38000,
        "School Loan": 0,
        "Car Loan": 4000,
        "Credit Card": 3000
      }
    };

    player = new Player("player");
    player.setFinancialStatement(profession);
  });

  describe("isBankruptcy", function() {
    it("should return true if cashflow is negetive", function() {
      player.cashflow = -10;
      player.ledgerBalance = -10;
      expect(player.isBankruptcy()).to.equals(true);
    });
  });

  describe("downsize", function() {
    it("should set downsizeturns 2 and deduct penalty from ledger balance", function() {
      player.downsize();

      expect(player)
        .to.have.property("downSizedForTurns")
        .to.equal(2);
      expect(player)
        .to.have.property("ledgerBalance")
        .to.equal(-100);
    });
  });

  describe("isDownsized", function() {
    it("should return true if the player is downsized", function() {
      player.downsize();

      expect(player.isDownSized()).to.equal(true);
    });

    it("should return false if the player is not downsized", function() {
      expect(player.isDownSized()).to.equal(false);
    });
  });

  describe("isLedgerBalanceNegative", function() {
    it("should return true if the ledgerBalance is negative", function() {
      player.downsize();
      expect(player.isLedgerBalanceNegative()).to.equals(true);
    });

    it("should return false if the ledgerBalance is not negative", function() {
      expect(player.isLedgerBalanceNegative()).to.equals(false);
    });
  });

  describe("decrementDownSizeTurns", function() {
    it("should decrease the downsize turns by one", function() {
      player.downsize();
      player.decrementDownSizeTurns();

      expect(player.downSizedForTurns).to.equals(1);
    });
  });

  describe("hasChild", function() {
    it("should return true if children count is more than 0", function() {
      player.addBaby();
      expect(player.hasChild()).to.equals(true);
    });

    it("should return false if children count is 0", function() {
      expect(player.hasChild()).to.equals(false);
    });
  });

  describe("getChildCount", function() {
    it("should return 0 for child count 0", function() {
      expect(player.getChildCount()).to.equals(0);
    });

    it("should return 1 for child count 1", function() {
      player.addBaby();
      expect(player.getChildCount()).to.equals(1);
    });

    it("should return 2 for child count is 2", function() {
      player.addBaby();
      player.addBaby();
      expect(player.getChildCount()).to.equals(2);
    });
  });

  describe("buyGoldCoins", function() {
    it("should add gold cooins in assets and deduct money form cash ledger", function() {
      const card = {
        cost: 100,
        numberOfCoins: 3
      };

      player.buyGoldCoins(card);

      expect(player.ledgerBalance).to.equal(1300);
      expect(player.assets.goldCoins).to.equal(3);
      expect(player.entries).to.have.length(2);
      expect(player.buyGoldCoins(card)).to.equal(true);
    });
  });

  describe("holdTurn", function() {
    it("should set isTurnComplete property of player as false", function() {
      player.holdTurn();

      expect(player)
        .to.have.property("isTurnComplete")
        .to.equals(false);
    });
  });

  describe("completeTurn", function() {
    it("should set isTurnComplete property of player as true", function() {
      player.completeTurn();

      expect(player)
        .to.have.property("isTurnComplete")
        .to.equals(true);
    });
  });

  describe("hasCharityTurns", function() {
    it("should return true if charity turns is greater than 0", function() {
      player.addCharityTurn();
      expect(player.hasCharityTurns()).to.equals(true);
    });

    it("should return false if charity turns is less than or equal to 0", function() {
      expect(player.hasCharityTurns()).to.equals(false);
    });
  });

  describe("rollDice", function() {
    it("should roll one dice and return the value on dice", function() {
      expect(player.rollDice())
        .to.be.an("Array")
        .of.length(1);
      expect(player.rolledDice).to.equals(true);
    });

    it("should roll two dice and return the value on dice", function() {
      expect(player.rollDice(2))
        .to.be.an("Array")
        .of.length(2);
      expect(player.rolledDice).to.equals(true);
    });
  });

  describe("addBaby", function() {
    it("should increment children count by 1 if count is less than 3", function() {
      player.addBaby();
      expect(player.childrenCount).to.equals(1);
    });

    it("should not add any baby and return false if children count is greater than or equal to 3", function() {
      player.childrenCount = 3;

      expect(player.addBaby()).to.equals(false);
      expect(player.childrenCount).to.equals(3);
      expect(player.notification).to.equals(
        "you already have 3 babies so baby is not added"
      );
    });
  });

  describe("downSizeTurns", function() {
    it("should return 2 if the player is recently downsized", function() {
      player.downsize();

      expect(player.downSizeTurns()).to.equals(2);
    });
    it("should return 0 if the player is not downsized", function() {
      expect(player.downSizeTurns()).to.equals(0);
    });
  });

  describe("removeCharityEffect", function() {
    it("should set charityTurns of player to 0", function() {
      player.addCharityTurn();
      player.removeCharityEffect();

      expect(player.charityTurns).to.equals(0);
    });
  });
});

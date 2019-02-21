const Player = require("../../src/model/player.js");
const chai = require("chai");

describe("Player", function() {
  describe("move", () => {
    it("should change the current space after moving", function() {
      const player = new Player("player1");
      player.move(3);
      chai.expect(player.currentSpace).to.equal(3);
      player.move(21);
      chai.expect(player.currentSpace).to.equal(24);
    });
    it("should start with 1 after 24 currentSpace", function() {
      const player = new Player("player1");
      player.move(24);
      chai.expect(player.currentSpace).to.equal(24);
    });
  });

  describe("addCharityTurn", function() {
    it("should add 3 charity turns in player", function() {
      const player = new Player("player1");
      player.addCharityTurn();
      chai
        .expect(player)
        .to.have.a.property("charityTurns")
        .to.be.equal(3);
    });
  });

  describe("getLedgerBalance", function() {
    it("should return player ledger balance.", function() {
      const player = new Player("player1");
      player.ledgerBalance = 3000;
      const actualOutput = player.getLedgerBalance();
      chai.expect(actualOutput).to.be.equal(3000);
    });
  });

  describe("isAbleToDoCharity", function() {
    it("should return true if player is able to do charity", function() {
      const player = new Player("player1");
      player.ledgerBalance = 3000;
      player.totalIncome = 5000;
      const actualOutput = player.isAbleToDoCharity();
      chai.expect(actualOutput).to.be.true;
    });

    it("should return false if player is not able to do charity", function() {
      const player = new Player("player1");
      player.ledgerBalance = 300;
      player.totalIncome = 5000;
      const actualOutput = player.isAbleToDoCharity();
      chai.expect(actualOutput).to.be.false;
    });
  });
});

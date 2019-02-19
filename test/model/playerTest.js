const Player = require("../../src/model/player.js");
const chai = require("chai");

describe("Player class", function() {
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
  it("should change haveToActivateDice to false  when deactivateDice is called", function() {
    const player = new Player("player1");
    player.deactivateDice();
    chai.expect(player.haveToActivateDice).to.be.false;
  });
  it("should change haveToActivateDice to true  when activateDice is called", function() {
    const player = new Player("player1");
    player.activateDice();
    chai.expect(player.haveToActivateDice).to.be.true;
  });
});

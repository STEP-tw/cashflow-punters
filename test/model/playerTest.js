const Player = require("../../src/model/player.js");
const chai = require("chai");

describe("Player class", function() {
  it("should change the current space after moving", function() {
    const player = new Player();
    player.move(3);
    chai.expect(player.currentSpace).to.equal(3);
    player.move(21);
    chai.expect(player.currentSpace).to.equal(24);
  });
  it("should start with 1 after 24 currentSpace", function() {
    const player = new Player();
    player.move(25);
    chai.expect(player.currentSpace).to.equal(1);
  });
});

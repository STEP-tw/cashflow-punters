const { assignId } = require("../../src/utils/array.js");
const { expect } = require("chai");

describe("assignId", function() {
  it("should assign unique turn to each player", function() {
    expect(assignId([{}, 1]))
      .to.have.property("turn")
      .to.equal(1);
  });
});

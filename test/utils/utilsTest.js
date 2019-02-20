const { assignId } = require("../../src/utils/array.js");
const { add } = require("../../src/utils/utils.js");
const { expect } = require("chai");

describe("assignId", function() {
  it("should assign unique turn to each player", function() {
    expect(assignId([{}, 1]))
      .to.have.property("turn")
      .to.equal(1);
  });
});

describe('add', function() {
  it('should return add two numbers', function() {
    expect(add(2,3)).to.equal(5);
  });
});

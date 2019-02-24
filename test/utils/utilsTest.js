const { add } = require("../../src/utils/utils.js");
const { expect } = require("chai");

describe('add', function() {
  it('should return add two numbers', function() {
    expect(add(2,3)).to.equal(5);
  });
});

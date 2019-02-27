const {
  getNextNum,
  add,
  isSame,
  calculateLoanToTake,
  hasIntersection,
  isEqual
} = require("../../src/utils/utils.js");

const { expect } = require("chai");

describe("getNextNum", function() {
  it("should return next number and cycled after list length", function() {});
  expect(getNextNum(1, 10, 4)).is.equal(5);
});

describe("isSame", function() {
  it("should return true if passing args are same", function() {
    expect(isSame("a", "a")).to.be.true;
  });
  it("should return false if passing args are different", function() {
    expect(isSame("a", "b")).to.be.false;
  });
});

describe("hasIntersection", function() {
  it("should return true if lists has intersection", function() {
    const list1 = [1, 2, 3];
    const list2 = [4, 5, 6, 2];
    expect(hasIntersection(list1, list2)).to.be.true;
  });
  it("should return false if lists hasn't intersection", function() {
    const list1 = [1, 2, 3];
    const list2 = [4, 5, 6];
    expect(hasIntersection(list1, list2)).to.be.false;
  });
});

describe("isEqual", function() {
  describe("for Numbers", function() {
    it("should return true for equal number", function() {
      expect(isEqual(2, 2)).to.be.true;
    });
    it("should return false for unequal number", function() {
      expect(isEqual(2, 3)).to.be.false;
    });
  });
  describe("for Object", function() {
    it("should return true for equal object", function() {
      expect(isEqual({ a: 2 }, { a: 2 })).to.be.true;
    });
    it("should return false for unequal object", function() {
      expect(isEqual({ a: 2 }, { a: 3 })).to.be.false;
    });
  });
});

describe("isBetween", function() {
  it("should return true if number is in between", function() {});
});

describe("add", function() {
  it("should return add two numbers", function() {
    expect(add(2, 3)).to.equal(5);
  });
});

describe("calculateLoanToTake", function() {
  it("should return 1000 if ledger balance is negative and less than 1000", function() {
    expect(calculateLoanToTake(-100)).to.be.equal(1000);
  });
  it("should return 2000 if ledger balance is negative and less than 1000 and greater than 2000", function() {
    expect(calculateLoanToTake(-1100)).to.be.equal(2000);
  });
});

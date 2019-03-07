const chai = require("chai");
const CashLedger = require("../../src/model/cashLedger");

describe("getCashLedger", function() {
  it("should return financial statement", function() {
    const cashLedger = new CashLedger();
    let ledger = cashLedger.getCashLedger();
    chai.expect(ledger).to.eql([]);
  });
});

const expect = require("chai").expect;
const CashLedger = require("../../src/model/cashLedger");

describe("CashLedger", function() {
  let cashLedger;
  beforeEach(() => {
    cashLedger = new CashLedger();
  });

  describe("addCreditEvent", function() {
    it("should add a credit event to the entries of cash ledger", function() {
      cashLedger.addCreditEvent(5000, "some event", "2019-04-04T08:04:35.743Z");

      expect(cashLedger)
        .to.have.property("entries")
        .to.be.an("Array")
        .of.length(1);

      expect(cashLedger.entries[0])
        .to.be.an("Object")
        .to.have.property("type")
        .to.equals("credit");
    });
  });

  describe("addDebitEvent", function() {
    it("should add a debit event to the entries of cash ledger", function() {
      cashLedger.addDebitEvent(5000, "some event", "2019-04-04T08:04:35.743Z");

      expect(cashLedger)
        .to.have.property("entries")
        .to.be.an("Array")
        .of.length(1);

      expect(cashLedger.entries[0])
        .to.be.an("Object")
        .to.have.property("type")
        .to.equals("debit");
    });
  });
});

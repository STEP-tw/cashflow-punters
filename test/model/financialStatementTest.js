const FinancialStatement = require("../../src/model/financialStatement");
const { expect } = require("chai");

describe("", function() {
  let financialStatement;
  beforeEach(() => {
    financialStatement = new FinancialStatement();
    const profession = {
      profession: "Doctor",
      income: { salary: 13200 },
      expenses: {
        taxes: 3200
      },
      assets: { savings: 3500 },
      liabilities: {
        "Home Mortgage": 202000
      }
    };
    financialStatement.setFinancialStatement(profession);
  });

  describe("financialStatement", function() {
    it("should setup financial statement for player", function() {
      expect(financialStatement).has.property("totalIncome");
      expect(financialStatement).has.property("income");
      expect(financialStatement).has.property("cashflow");
      expect(financialStatement).has.property("entries");
      expect(financialStatement).has.property("ledgerBalance");
      expect(financialStatement).has.property("passiveIncome");
    });
  });

  describe("financialStatement", function() {
    it("should setup financial statement for player", function() {
      financialStatement.addPayday();
      expect(financialStatement).has.property("totalIncome");
      expect(financialStatement).has.property("ledgerBalance");
      expect(financialStatement.ledgerBalance).to.equal(23500);
    });
  });

  describe("addLiability", function() {
    it("should add liability when that liability is not present", function() {
      financialStatement.addLiability("Bank Loan", 5000);

      expect(financialStatement)
        .to.have.property("liabilities")
        .to.have.property("Bank Loan")
        .to.equals(5000);
    });
    it("should add liability amount in liability when liability is already present", function() {
      financialStatement.addLiability("Bank Loan", 5000);
      financialStatement.addLiability("Bank Loan", 5000);

      expect(financialStatement)
        .to.have.property("liabilities")
        .to.have.property("Bank Loan")
        .to.equals(10000);
    });
  });

  describe("addExpense", function() {
    it("should add expense when not present in the expenses", function() {
      financialStatement.addExpense("Bank Loan Payment", 500);

      expect(financialStatement)
        .to.have.property("expenses")
        .to.have.property("Bank Loan Payment")
        .to.equals(500);
    });

    it("should add expense in expenses and amount of it", function() {
      financialStatement.addExpense("Bank Loan Payment", 500);
      financialStatement.addExpense("Bank Loan Payment", 500);

      expect(financialStatement)
        .to.have.property("expenses")
        .to.have.property("Bank Loan Payment")
        .to.equals(1000);
    });
  });

  describe("removeLiability", function() {
    it("should remove liability in liabilities and amount of it", function() {
      financialStatement.addLiability("Bank Loan", 5000);
      financialStatement.removeLiability("Bank Loan", 5000);

      expect(financialStatement)
        .to.have.property("liabilities")
        .to.have.property("Bank Loan")
        .to.equals(0);
    });
  });

  describe("removeExpense", function() {
    it("should remove expense in expenses and amount of it", function() {
      financialStatement.addExpense("Bank Loan Payment", 500);
      financialStatement.removeExpense("Bank Loan Payment", 500);

      expect(financialStatement)
        .to.have.property("expenses")
        .to.have.property("Bank Loan Payment")
        .to.equals(0);
    });
  });

  describe("deductLedgerBalance", function() {
    it("should deduct the given amount from ledger balance", function() {
      financialStatement.deductLedgerBalance(500);

      expect(financialStatement)
        .to.have.property("ledgerBalance")
        .to.equals(13000);
    });
  });

  describe("addToLedgerBalance", function() {
    it("should deduct the given amount from ledger balance", function() {
      financialStatement.addToLedgerBalance(500);

      expect(financialStatement)
        .to.have.property("ledgerBalance")
        .to.equals(14000);
    });
  });

  describe("getAsset", function() {
    it("should return the object of given asset name", function() {
    financialStatement.assets.realEstates = [{type:"BR/2",downPayment:5000,cost:50000},{type:"BR/3",downPayment:4000,cost:50000},{type:"BR/4",downPayment:6000,cost:50000}]
      expect(financialStatement.getAsset("BR/2"))
      .to.be.deep.equal([{type:"BR/2",downPayment:5000,cost:50000}])
    });
  });

  describe("getDownpayment", function() {
    it("should return the down refundable amount", function() {
    financialStatement.assets.realEstates = [{type:"BR/2",downPayment:5000,cost:50000},
    {type:"BR/3",downPayment:4000,cost:50000},{type:"BR/4",downPayment:6000,cost:50000}]
      expect(financialStatement.getDownPayment("BR/2"))
      .to.be.deep.equal(2500)
    });
  });

});

const { add } = require("../utils/utils");

class FinancialStatement {
  constructor() {
    this.profession;
    this.passiveIncome = 0;
    this.totalExpense;
    this.totalIncome;
    this.cashflow;
    this.legerBalance;
    this.income;
    this.cashLedger;
    this.expenses;
    this.liabilities;
    this.assets;
  }
  setFinancialStatement(profession) {
    this.profession = profession.profession;
    this.totalIncome = Object.values(profession.income).reduce(add);
    this.totalExpense = Object.values(profession.expenses).reduce(add);
    this.income = profession.income;
    this.cashflow = this.totalIncome - this.totalExpense;
    this.cashLedger = this.totalIncome + profession.assets.savings;
    this.ledgerBalance = this.cashflow + profession.assets.savings;
    this.expenses = profession.expenses;
    this.assets = profession.assets;
    this.liabilities = profession.liabilities;
  }

  addPayday() {
    this.ledgerBalance += this.cashflow;
  }
}

module.exports = FinancialStatement;

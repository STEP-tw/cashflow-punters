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
  }
  setFinancialStatement(profession) {
    this.profession = profession;
    this.totalIncome = Object.values(this.profession.income).reduce(add);
    this.totalExpense = Object.values(this.profession.expenses).reduce(add);
    this.income = this.profession.income.salary;
    this.cashflow = this.totalIncome - this.totalExpense;
    this.cashLedger = this.totalIncome + this.profession.assets.savings;
    this.ledgerBalance = this.cashflow + this.profession.assets.savings;
  }
  getTotalIncome() {
    return this.totalIncome;
  }

  addPayday() {
    this.profession.assets.savings += this.cashflow;
  }
}

module.exports = FinancialStatement;

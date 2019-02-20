const { add } = require('../utils/utils');

class FinancialStatement {
  constructor() {
    this.passiveIncome = 0;
    this.totalExpense;
    this.totalIncome;
    this.cashflow;
    this.income;
  }
  setFinancialStatement(profession) {
    this.totalIncome = Object.values(profession.income).reduce(add);
    this.totalExpense = Object.values(profession.expenses).reduce(add);
    this.income = profession.income.salary;
    this.cashflow = this.totalIncome - this.totalExpense;
  }
  getTotalIncome() {
    return this.totalIncome;
  }
}

module.exports = FinancialStatement;
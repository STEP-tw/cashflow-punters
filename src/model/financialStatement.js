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
    this.perChildExpense;
  }

  setFinancialStatement(profession) {
    this.profession = profession.profession;
    this.perChildExpense = profession.perChildExpense;
    this.income = profession.income;
    this.expenses = profession.expenses;
    this.assets = profession.assets;
    this.liabilities = profession.liabilities;
    this.totalIncome = Object.values(this.income).reduce(add);
    this.updateTotalExpense();
    this.updateCashFlow();
    this.cashLedger = this.totalIncome + profession.assets.savings;
    this.ledgerBalance = this.cashflow + profession.assets.savings;
  }

  updateTotalExpense() {
    this.totalExpense = Object.values(this.expenses).reduce(add);
  }

  updateCashFlow() {
    this.cashflow = this.totalIncome - this.totalExpense;
  }

  addToLedgerBalance(amount) {
    this.ledgerBalance += amount;
  }

  deductLedgerBalance(amount) {
    this.ledgerBalance -= amount;
  }

  addPayday() {
    this.ledgerBalance += this.cashflow;
    return this.cashflow;
  }

  addLiability(liability, amount) {
    if (this.liabilities[liability]) {
      this.liabilities[liability] += amount;
      return;
    }
    this.liabilities[liability] = amount;
  }

  addExpense(expense, amount) {
    if (this.expenses[expense]) {
      this.expenses[expense] += amount;
      return;
    }
    this.expenses[expense] = amount;
  }

  removeLiability(liability, amount) {
    this.liabilities[liability] -= amount;
  }

  removeExpense(expense, amount) {
    this.expenses[expense] -= amount;
  }
}

module.exports = FinancialStatement;

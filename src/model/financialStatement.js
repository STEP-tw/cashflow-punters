const { add } = require("../utils/utils");
const CashLedger = require("./cashLedger");

class FinancialStatement extends CashLedger {
  constructor() {
    super();
    this.profession;
    this.passiveIncome = 0;
    this.totalExpense;
    this.totalIncome;
    this.cashflow;
    this.legerBalance;
    this.income;
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
    this.ledgerBalance = this.cashflow + profession.assets.savings;
    const initialAmount = this.cashflow + profession.assets.savings;
    this.addCreditEvent(initialAmount, "Initial Cash");
  }

  updateFs() {
    this.updateTotalExpense();
    this.updateCashFlow();
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
    this.updateFs();
  }

  removeLiability(liability, amount) {
    this.liabilities[liability] -= amount;
  }

  removeExpense(expense, amount) {
    this.expenses[expense] -= amount;
  }
}

module.exports = FinancialStatement;

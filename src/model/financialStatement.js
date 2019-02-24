const { add } = require("../utils/utils");
const CashLedger = require("./cashLedger");
const getIncome = (value, content) => value + content.cashflow;

class FinancialStatement extends CashLedger {
  constructor() {
    super();
    this.profession;
    this.passiveIncome = 0;
    this.totalExpense;
    this.totalIncome;
    this.cashflow;
    this.ledgerBalance;
    this.income;
    this.expenses;
    this.liabilities;
    this.assets;
    this.perChildExpense;
  }

  updateTotalIncome() {
    let assetIncome = this.assets.realEstates.reduce(getIncome, 0);
    this.totalIncome = assetIncome + this.income.salary;
  }

  updateTotalExpense() {
    this.totalExpense = Object.values(this.expenses).reduce(add);
  }

  updateCashFlow() {
    this.cashflow = this.totalIncome - this.totalExpense;
  }

  updateFinancialStatement() {
    this.updateTotalExpense();
    this.updateTotalIncome();
    this.updateCashFlow();
  }

  setFinancialStatement(profession) {
    this.profession = profession.profession;
    this.perChildExpense = profession.perChildExpense;
    this.income = profession.income;
    this.income.realEstates = [];
    this.expenses = profession.expenses;
    this.assets = profession.assets;
    this.assets.realEstates = [];
    this.assets.goldCoins = 0;
    this.liabilities = profession.liabilities;
    this.liabilities.realEstate = [];
    this.updateFinancialStatement();
    this.ledgerBalance = this.cashflow + profession.assets.savings;
    const initialAmount = this.cashflow + profession.assets.savings;
    this.addCreditEvent(initialAmount, "Initial Cash");
  }
  addToLedgerBalance(amount) {
    this.ledgerBalance += amount;
  }

  deductLedgerBalance(amount) {
    this.ledgerBalance -= amount;
  }

  addPayday() {
    this.ledgerBalance += this.cashflow;
    this.addCreditEvent(this.cashflow, "gotPayday");
    return this.cashflow;
  }

  addAsset(type, downPayment, cost) {
    this.assets.realEstates.push({ type, downPayment, cost });
  }

  addLiability(liability, amount) {
    if (this.liabilities[liability]) {
      this.liabilities[liability] += amount;
      return;
    }
    this.liabilities[liability] = amount;
    this.addToLedgerBalance(amount);
  }

  addExpense(expense, amount) {
    if (this.expenses[expense]) {
      this.expenses[expense] += amount;
      return;
    }
    this.expenses[expense] = amount;
    this.updateFinancialStatement();
  }

  addGoldCoins(count) {
    this.assets.goldCoins += count;
  }

  addIncomeRealEstate(type, cashflow) {
    this.income.realEstates.push({ type, cashflow });
  }

  removeLiability(liability, amount) {
    this.liabilities[liability] -= amount;
    this.deductLedgerBalance(amount);
  }

  removeExpense(expense, amount) {
    this.expenses[expense] -= amount;
  }
}

module.exports = FinancialStatement;

const { add, hasIntersection, isEqual } = require("../utils/utils.js");
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
    let assetIncome = this.income.realEstates.reduce(getIncome, 0);
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
    this.assets.shares = {};
    this.liabilities = profession.liabilities;
    this.liabilities.realEstates = [];
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
    this.addCreditEvent(this.cashflow, "got payday");
    return this.cashflow;
  }

  addAsset(title, type, downPayment, cost) {
    this.assets.realEstates.push({ title, type, downPayment, cost });
  }

  addLiability(liability, amount) {
    if (this.liabilities[liability]) {
      this.liabilities[liability] += amount;
      this.addToLedgerBalance(amount);
      return;
    }
    this.liabilities[liability] = amount;
    this.addToLedgerBalance(amount);
  }

  addRealEstateLiability(title, type, mortgage) {
    this.liabilities.realEstates.push({ title, type, mortgage });
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

  addIncomeRealEstate(title, type, cashflow) {
    this.income.realEstates.push({ title, type, cashflow });
    this.passiveIncome += cashflow;
    this.updateTotalIncome();
    this.updateCashFlow();
  }

  removeLiability(liability, amount) {
    this.liabilities[liability] -= amount;
    this.deductLedgerBalance(amount);
  }

  removeExpense(expense, amount) {
    this.expenses[expense] -= amount;
  }

  hasShares(symbol) {
    return Object.keys(this.assets.shares).includes(symbol);
  }

  calculateProfit(estate, marketCard) {
    const { cash, percentage } = marketCard.data;
    const { mortgage, cost } = estate;
    if (cash) {
      return cost + cash - mortgage;
    }
    return (1 + percentage / 100) * cost - mortgage;
  }

  sellEstate(estate, marketCard) {
    const profit = this.calculateProfit(estate, marketCard);
    this.addToLedgerBalance(profit);
    this.liabilities.realEstates = this.liabilities.realEstates.filter(
      realEstate => !isEqual(realEstate, estate)
    );

    this.addCreditEvent(profit, " sold Real Estate");
    return profit;
  }

  getRealEstatesType() {
    return this.liabilities.realEstates.map(estate => estate.type);
  }

  hasRealEstate(realEstatesType) {
    return hasIntersection(this.getRealEstatesType(), realEstatesType);
  }

  hasGoldCoins() {
    return this.assets.goldCoins > 0;
  }

  sellGoldCoins(numberOfCoins, cost) {
    const totalAmout = numberOfCoins * cost;
    this.assets.goldCoins -= numberOfCoins;
    this.ledgerBalance += totalAmout;
    this.addCreditEvent(totalAmout, ` Sold ${numberOfCoins} gold coins.`);
    this.setNotification(
      `You sold ${numberOfCoins} gold coins at rate of ${cost}.$${totalAmout} added to your Ledger Balance`
    );
  }

  removeRealState(asset) {
    const incomeRealEstats = this.income.realEstates;
    const realEstateLiability = this.liabilities.realEstates;
    const realEstateAssets = this.assets.realEstates;
    const indexNo = incomeRealEstats.indexOf(asset);
    incomeRealEstats.splice(indexNo, 1);
    realEstateLiability.splice(indexNo, 1);
    realEstateAssets.splice(indexNo, 1);
  }

  getDownPayment(asset) {
    const refundableAmount = asset.downPayment / 2;
    this.addToLedgerBalance(refundableAmount);
    this.removeRealState(asset);
    return refundableAmount;
  }

  hasShares(symbol) {
    return this.assets.shares.hasOwnProperty(symbol);
  }

  removeHalfShares(symbol) {
    const shares = this.assets.shares[symbol];
    const numberOfShares = shares.numberOfShares;
    this.setNotification(`Your ${symbol} shares got halved.`);
    shares.numberOfShares = Math.ceil(numberOfShares / 2);
  }

  doubleShares(symbol) {
    const shares = this.assets.shares[symbol];
    const numberOfShares = shares.numberOfShares;
    this.setNotification(`Your ${symbol} shares got doubled.`);
    shares.numberOfShares = numberOfShares * 2;
  }
}

module.exports = FinancialStatement;

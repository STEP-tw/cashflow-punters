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
    this.liabilities["Bank Loan"] = 0;
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

  addAsset(card) {
    this.assets.realEstates.push(card);
  }

  removeAsset(estate) {
    const assets = this.assets;
    assets.realEstates = assets.realEstates.filter(
      realEstate => !isEqual(realEstate, estate)
    );
  }

  removeRealEstateLiability(estate) {
    const liabilities = this.liabilities;
    liabilities.realEstates = liabilities.realEstates.filter(
      realEstate => !isEqual(realEstate, estate)
    );
  }

  removeIncomeRealEstate(estate) {
    const income = this.income;
    income.realEstates = income.realEstates.filter(
      realEstate => !isEqual(realEstate, estate)
    );
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

  addRealEstateLiability(card) {
    this.liabilities.realEstates.push(card);
  }

  addIncomeRealEstate(card) {
    this.income.realEstates.push(card);
    this.passiveIncome += card.cashflow;
    this.updateTotalIncome();
    this.updateCashFlow();
  }

  sellEstate(estate, marketCard) {
    const profit = this.calculateProfit(estate, marketCard);
    this.addToLedgerBalance(profit);
    this.removeRealEstateLiability(estate);
    this.removeAsset(estate);
    this.removeIncomeRealEstate(estate);

    this.addCreditEvent(profit, " sold Real Estate");
    return estate.mortgage + profit;
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
    if (cash) return cost + cash - mortgage;
    return (1 + percentage / 100) * cost - mortgage;
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

  hasEscape() {
    let notification =
      "Your Passive income has became greater than expenses, to escape from Rat race bank loan needs to paid.";
    if (this.passiveIncome >= this.totalExpense) {
      if (this.liabilities["Bank Loan"] < this.ledgerBalance) {
        notification = "Congrats!! You are out of Rat race.";
        this.setNotification(notification);
        return true;
      }
      this.setNotification(notification);
    }
    return false;
  }
}

module.exports = FinancialStatement;

const {add} = require('../utils/utils');

class FinancialStatement {
  constructor() {
    this.profession;
    this.passiveIncome = 0;
    this.totalExpense;
    this.totalIncome;
    this.cashflow;
    this.income;
  }
  setFinancialStatement(profession){
    this.profession = profession;
    this.totalIncome = Object.values(this.profession.income).reduce(add);
    this.totalExpense = Object.values(this.profession.expenses).reduce(add);
    this.income = this.profession.income.salary;
    this.cashflow = this.totalIncome - this.totalExpense;
 }
  getTotalIncome() {
   return this.totalIncome;
 }
}

module.exports = FinancialStatement;
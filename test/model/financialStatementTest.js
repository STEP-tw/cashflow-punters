const FinancialStatement = require('../../src/model/financialStatement');
const {expect} = require('chai');

describe('financialStatement', function() {
  it('should setup financial statement for player', function() {
    const finantialStatement = new FinancialStatement();
    let profession = {
      "profession": "Doctor",
      "income": {"salary": 13200},
      "expenses": {
        "taxes": 3200
      },
      "assets": {"savings": 3500},
      "liabilities": {
        "Home Mortgage": 202000
      }
    }
    finantialStatement.setFinancialStatement(profession);
    expect(finantialStatement).has.property('totalIncome');
    expect(finantialStatement).has.property('income');
    expect(finantialStatement).has.property('cashflow');
    expect(finantialStatement).has.property('cashLedger');
    expect(finantialStatement).has.property('ledgerBalance');
    expect(finantialStatement).has.property('passiveIncome');
  });
});

describe('financialStatement', function() {
  it('should setup financial statement for player', function() {
    const finantialStatement = new FinancialStatement();
    let profession = {
      "profession": "Doctor",
      "income": {"salary": 13200},
      "expenses": {
        "taxes": 3200
      },
      "assets": {"savings": 3500},
      "liabilities": {
        "Home Mortgage": 202000
      }
    }
    finantialStatement.setFinancialStatement(profession);
    finantialStatement.addPayday();
    expect(finantialStatement).has.property('totalIncome');
    expect(finantialStatement.profession.assets.savings).to.equal(13500);
  });
});
class CashLedger {
  constructor() {
    this.entries = [];
  }

  addCreditEvent(amount, event) {
    const entry = { amount, event };
    entry.currentBalance = this.ledgerBalance;
    entry.time = new Date();
    entry.type = "credit";
    this.entries.push(entry);
  }

  addDebitEvent(amount, event) {
    const entry = { amount, event };
    entry.currentBalance = this.ledgerBalance;
    entry.time = new Date();
    entry.type = "debit";
    this.entries.push(entry);
  }

  getCashLedger() {
    return this.entries;
  }
}

module.exports = CashLedger;

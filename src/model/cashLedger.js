class CashLedger {
  constructor() {
    this.entries = [];
  }

  addCreditEvent(amount, event, time = new Date()) {
    const entry = { amount, event };
    entry.currentBalance = this.ledgerBalance;
    entry.time = time;
    entry.type = "credit";
    this.entries.unshift(entry);
  }

  addDebitEvent(amount, event, time = new Date()) {
    const entry = { amount, event };
    entry.currentBalance = this.ledgerBalance;
    entry.time = time;
    entry.type = "debit";
    this.entries.unshift(entry);
  }

  getCashLedger() {
    return this.entries;
  }
}

module.exports = CashLedger;

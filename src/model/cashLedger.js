class CashLedger {
  constructor() {
    this.entries = [];
  }

  addCreditEvent(amount, event, time = new Date()) {
    const entry = { amount, event };
    entry.currentBalance = this.ledgerBalance;
    entry.time = time;
    entry.type = "credit";
    this.entries.push(entry);
  }

  addDebitEvent(amount, event, time = new Date()) {
    const entry = { amount, event };
    entry.currentBalance = this.ledgerBalance;
    entry.time = time;
    entry.type = "debit";
    this.entries.push(entry);
  }

  getCashLedger() {
    return this.entries;
  }
}

module.exports = CashLedger;

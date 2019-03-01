class ActivityLog {
  constructor() {
    this.activityLog = [];
  }
  addActivity(msg, playerName = "") {
    const time = new Date();
    this.activityLog.push({ playerName, msg, time });
  }

  logSelectedBigDeal(playerName) {
    const msg = " selected Big Deal.";
    this.addActivity(msg, playerName);
  }

  logSelectedSmallDeal(playerName) {
    const msg = " selected Small Deal.";
    this.addActivity(msg, playerName);
  }

  logTurn(playerName) {
    const msg = `${playerName}'s Turn.`;
    this.addActivity(msg);
  }

  logGameStart() {
    const msg = "Race has started";
    this.addActivity(msg);
  }

  logGotBaby(playerName) {
    const msg = " got a baby";
    this.addActivity(msg, playerName);
  }

  logExpense(playerName, expenseAmount, expense) {
    const msg = `$${expenseAmount} deducted from ${playerName} for ${expense}`;
    this.addActivity(msg);
  }

  logLoanTaken(amount, player) {
    const msg = ` took loan of ${amount}`;
    this.addActivity(msg, player);
  }

  logDebtPaid(amount, liability, playerName) {
    const msg = ` paid debt $${amount} for liability - ${liability}`;
    this.addActivity(msg, playerName);
  }
}

module.exports = ActivityLog;

const {
  getNextNum,
  isBetween,
  add,
  calculateLoanToTake
} = require("../utils/utils.js");
const _ = require("lodash");

class ActivityLog {
  constructor() {
    this.activityLog = [];
  }
  addActivity(msg, playerName = "") {
    const time = new Date();
    this.activityLog.push({ playerName, msg, time });
  }
}

class Game extends ActivityLog {
  constructor(cardStore, board, host) {
    super();
    this.board = board;
    this.host = host;
    this.cardStore = cardStore;
    this.currentPlayer;
    this.players = [];
    this.hasStarted = false;
    this.financialStatement;
    this.activeCard;
  }

  addPlayer(player) {
    player.turn = this.players.length + 1;
    this.players.push(player);
  }

  getPlayerNames() {
    return this.players.map(player => player.name);
  }

  setCurrentPlayer(player) {
    this.currentPlayer = player;
  }

  isCurrentPlayer(playerName) {
    return this.currentPlayer.name == playerName;
  }

  initializeGame() {
    this.players.map(this.setProfession, this);
    this.currentPlayer = this.players[0];
    this.addActivity("Game has Started");
    this.addActivity("'s turn", this.currentPlayer.name);
  }

  setProfession(player) {
    const { professions } = this.cardStore;
    const profession = professions.drawCard();
    player.profession = profession;
    player.setFinancialStatement(profession);
  }

  getPlayerByName(name) {
    return this.players.filter(player => player.name == name)[0];
  }

  getPlayersCount() {
    return this.players.length;
  }

  startGame() {
    this.initializeGame();
    this.hasStarted = true;
  }

  isPlaceAvailable() {
    return this.getPlayersCount() < 6;
  }

  isPlayersTurnCompleted() {
    this.players.forEach(player => {
    });
    return this.players.every(player => player.isTurnComplete);
  }

  nextPlayer() {
    this.currentPlayer.rolledDice = false;
    const currTurn = this.currentPlayer.getTurn();
    const nextPlayerTurn = getNextNum(currTurn, this.getPlayersCount());
    this.currentPlayer = this.players[nextPlayerTurn - 1];
    this.addActivity("'s turn ", this.currentPlayer.name);
  }

  handleSmallDeal() {
    const msg = " selected Small Deal";
    this.addActivity(msg, this.currentPlayer.name);
    const smallDealCard = this.cardStore.smallDeals.drawCard();
    this.activeCard = { type: "smallDeal", data: smallDealCard };
    this.activeCard.dealDoneCount = 0;
  }

  handleBigDeal() {
    const msg = " selected Big Deal";
    this.addActivity(msg, this.currentPlayer.name);
    const bigDealCard = this.cardStore.bigDeals.drawCard();
    this.activeCard = { type: "bigDeal", data: bigDealCard };
  }

  handleBabySpace() {
    this.currentPlayer.addBaby();
    this.addActivity(` got a baby`, this.currentPlayer.name);
    this.currentPlayer.setNotification("You got a baby");
    this.nextPlayer();
  }

  handleDoodadSpace() {
    const doodadCard = this.cardStore.doodads.drawCard();
    this.activeCard = { type: "doodad", data: doodadCard };
    let { isChildExpense, expenseAmount } = doodadCard;
    if (isChildExpense && !this.currentPlayer.hasChild()) {
      expenseAmount = 0;
    }
    this.handleExpenseCard("doodad", expenseAmount);
  }

  addDebitActivity(amount, msg, type) {
    const { name } = this.currentPlayer;
    const activityMsg = `${amount}  ${msg} from ${name} for ${type}`;
    this.addActivity(activityMsg);
    this.currentPlayer.setNotification(`${amount}  ${msg} for ${type}`);
    this.currentPlayer.addDebitEvent(amount, type);
  }

  handleExpenseCard(type, expenseAmount) {
    this.currentPlayer.deductLedgerBalance(expenseAmount);
    if (this.currentPlayer.isLedgerBalanceNegative()) {
      const loanAmount = calculateLoanToTake(this.currentPlayer.ledgerBalance);
      this.grantLoan(this.currentPlayer.name, loanAmount);
    }
    this.addDebitActivity(+expenseAmount, "is deducted ", type);
    this.nextPlayer();
  }

  handleMarketSpace() {
    const marketCard = this.cardStore.market.drawCard();
    this.activeCard = { type: "market", data: marketCard };
    if (marketCard.relatedTo == "expense") {
      this.handleExpenseCard("market", marketCard.cash);
      return;
    }
    if (marketCard.relatedTo == "realEstate") {
      this.players.forEach(player => {
        const marketRealEstatesType = marketCard.relatedRealEstates;
        const hasRealEstate = player.hasRealEstate(marketRealEstatesType);
        if (hasRealEstate || player.hasGoldCoins()) {
          player.holdTurn();
        }
      });
    }
    if (marketCard.relatedTo == "goldCoin") {
      this.players.forEach(player => {
        if (player.hasGoldCoins()) {
          player.holdTurn();
        }
      });
    }
    this.isPlayersTurnCompleted() && this.nextPlayer();
  }

  getCommonEstates(name) {
    const player = this.getPlayerByName(name);
    const playerRealEstates = player.liabilities.realEstate;
    const marketRealEstates = this.activeCard.relatedRealEstates;
    return _.intersection(playerRealEstates, marketRealEstates);
  }

  handleCharitySpace() {
    this.currentPlayer.gotCharitySpace = true;
  }

  handleDealSpace() {
    this.currentPlayer.gotDeal = true;
  }

  skipTurn() {
    const currentPlayer = this.currentPlayer;
    currentPlayer.decrementDownSizeTurns();
    const turnsRemaining = currentPlayer.downSizeTurns();
    const msg = `Your turn has been skipped due to downSize ${turnsRemaining} turns to go..`;
    currentPlayer.notification = msg;
    const activityMsg = "'s turn was skipped.";
    this.addActivity(activityMsg, currentPlayer.name);
    this.nextPlayer();
  }

  handleDownsizedSpace() {
    const currentPlayer = this.currentPlayer;
    let notificationMsg = `Oops! You have landed on Downsize space amount 
      equal to your expenses is deducted from your ledger balance`;
    currentPlayer.downsize();
    currentPlayer.removeCharityEffect();
    const { ledgerBalance } = currentPlayer;
    if (currentPlayer.isLedgerBalanceNegative()) {
      const loanAmount = calculateLoanToTake(ledgerBalance);
      this.grantLoan(currentPlayer.name, loanAmount);
      notificationMsg = `Oops! You have landed on Downsize space. You dont had enough amount
        to pay the penalty so loan of $${loanAmount} added to your ledger balance and deducted the penalty`;
    }
    currentPlayer.notification = notificationMsg;
    this.nextPlayer();
  }

  handlePayday() {
    if (this.currentPlayer.isBankrupt()) {
      this.currentPlayer.bankrupt = true;
      return;
    }
    const paydayAmount = this.currentPlayer.addPayday();
    this.currentPlayer.setNotification(
      `You got Payday.${paydayAmount} added to your Savings`
    );
    this.nextPlayer();
  }

  handleSpace(oldSpaceNo) {
    const handlers = {
      baby: this.handleBabySpace.bind(this),
      doodad: this.handleDoodadSpace.bind(this),
      market: this.handleMarketSpace.bind(this),
      charity: this.handleCharitySpace.bind(this),
      deal: this.handleDealSpace.bind(this),
      downsized: this.handleDownsizedSpace.bind(this),
      payday: this.handlePayday.bind(this)
    };
    const currentPlayer = this.currentPlayer;
    this.handleCrossedPayDay(oldSpaceNo);

    const currentSpaceType = this.board.getSpaceType(
      currentPlayer.currentSpace
    );
    this.addActivity(` landed on ${currentSpaceType}`, currentPlayer.name);
    handlers[currentSpaceType]();
  }

  handleCrossedPayDay(oldSpaceNo) {
    const paydaySpaces = this.board.getPayDaySpaces();
    const crossedPaydays = paydaySpaces.filter(paydaySpace =>
      isBetween(oldSpaceNo, this.currentPlayer.currentSpace, paydaySpace)
    );
    if (crossedPaydays.length > 0) {
      crossedPaydays.forEach(() => {
        if (this.currentPlayer.isBankrupt()) {
          this.currentPlayer.bankrupt = true;
          return;
        }
        this.addActivity(" crossed payday", this.currentPlayer.name);
        const paydayAmount = this.currentPlayer.addPayday();
        this.currentPlayer.setNotification(
          `You got Payday.${paydayAmount} added to your Savings`
        );
      });
    }
  }

  grantLoan(playerName, loanAmount) {
    const player = this.getPlayerByName(playerName);
    const loanInterest = loanAmount / 10;
    player.addLiability("Bank Loan", loanAmount);
    player.addExpense("Bank Loan Payment", loanInterest);
    player.updateFinancialStatement();
    const activityMessage = ` took loan of $${loanAmount}`;
    player.addCreditEvent(loanAmount, "took loan");
    this.addActivity(activityMessage, playerName);
    player.setNotification("you" + activityMessage);
  }

  payDebt(playerName, debtDetails) {
    const { expense, liability, liabilityPrice, expenseAmount } = debtDetails;
    const player = this.getPlayerByName(playerName);
    player.removeLiability(liability, liabilityPrice);
    player.removeExpense(expense, expenseAmount);
    player.updateFinancialStatement();
    player.addDebitEvent(liabilityPrice, `paid loan for ${liability}`);
    const activityMessage = ` paid debt $${liabilityPrice} for liability - ${liability}`;
    this.addActivity(activityMessage, playerName);
    player.setNotification("you" + activityMessage);
  }

  acceptCharity() {
    this.currentPlayer.addCharityTurn();
    this.activeCard = "";
    this.addActivity(" accepted charity", this.currentPlayer.name);
  }

  declineCharity() {
    this.addActivity(" declined charity", this.currentPlayer.name);
    this.activeCard = "";
  }

  rollDice(numberOfDice) {
    const oldSpaceNo = this.currentPlayer.currentSpace;
    const diceValues = this.currentPlayer.rollDice(numberOfDice);
    const rolledDieMsg = " rolled " + diceValues.reduce(add);
    this.addActivity(rolledDieMsg, this.currentPlayer.name);
    const spaceType = this.board.getSpaceType(this.currentPlayer.currentSpace);
    this.handleSpace(oldSpaceNo);
    return { diceValues, spaceType };
  }

  hasCharityTurns() {
    return this.currentPlayer.hasCharityTurns();
  }

  hasShares(playerName) {
    return this.getPlayerByName(playerName).hasShares(
      this.activeCard.data.symbol
    );
  }

  buyShares(numberOfShares) {
    this.addActivity(
      ` has bought ${numberOfShares} shares ${this.activeCard.data.symbol}`
    );
    this.currentPlayer.buyShares(this.activeCard.data, numberOfShares);
    this.nextPlayer();
  }

  sellShares(playerName, numberOfShares) {
    this.addActivity(
      ` has sold ${numberOfShares} shares ${this.activeCard.data.symbol}`
    );
    this.getPlayerByName(playerName).sellShares(
      this.activeCard.data,
      numberOfShares
    );
    this.nextPlayer();
  }

  isPlayerCapableToBuy(numberOfShares) {
    const price = this.activeCard.data.currentPrice * numberOfShares;
    return this.currentPlayer.isCapableToPay(price);
  }

  isPlayerCapableToSell(playerName, numberOfShares) {
    const symbol = this.activeCard.data.symbol;
    return this.getPlayerByName(playerName).isCapableToSell(
      symbol,
      numberOfShares
    );
  }
}

module.exports = Game;

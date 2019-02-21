const lodash = require("lodash");
const Board = require("./board");
const {assignId} = require("../utils/array.js");
const {getNextNum, isBetween} = require("../utils/utils.js");

class ActivityLog {
  constructor() {
    this.activityLog = [];
  }
  addActivity(msg, playerName = "") {
    const time = new Date();
    this.activityLog.push({playerName, msg, time});
  }
}

class Game extends ActivityLog {
  constructor(cardStore, host) {
    super();
    this.board = new Board();
    this.host = host;
    this.cardStore = cardStore;
    this.currentPlayer;
    this.players = [];
    this.hasStarted = false;
    this.financialStatement;
    this.activeCard;
  }

  addPlayer(player) {
    this.players.push(player);
  }

  getPlayerNames() {
    return this.players.map(player => player.name);
  }

  setCurrentPlayer(player) {
    this.currentPlayer = player;
  }

  getInitialDetails() {
    const ids = lodash.range(1, this.players.length + 1);
    lodash.zip(this.players, ids).map(assignId);
    this.players.map(this.getProfession, this);
    this.currentPlayer = this.players[0];
    this.addActivity("Game has Started");
    this.addActivity("'s turn", this.currentPlayer.name);
  }

  getProfession(player) {
    let {professions} = this.cardStore;
    const profession = professions.drawCard();
    player.profession = profession;
    player.setFinancialStatement(profession);
  }

  getPlayer(turn) {
    return this.players[turn - 1];
  }

  getTotalPlayers() {
    return this.players.length;
  }

  startGame() {
    this.hasStarted = true;
  }

  getPlayersCount() {
    return this.players.length;
  }

  isPlaceAvailable() {
    const playersCount = this.getPlayersCount();
    return playersCount < 6;
  }

  nextPlayer() {
    this.currentPlayer.rolledDice = false;
    const currTurn = this.currentPlayer.getTurn();
    const nextPlayerTurn = getNextNum(currTurn, this.getTotalPlayers());
    this.currentPlayer = this.getPlayer(nextPlayerTurn);
    this.addActivity("'s turn ", this.currentPlayer.name);
  }

  handleSmallDeal() {
    const msg = " selected Small Deal";
    this.addActivity(msg, this.currentPlayer.name);
    this.nextPlayer();
  }

  handleBigDeal() {
    const msg = " selected Big Deal";
    this.addActivity(msg, this.currentPlayer.name);
    this.nextPlayer();
  }

  handleBabySpace() {
    this.currentPlayer.addBaby();
    this.addActivity(` got a baby`, this.currentPlayer.name);
    this.nextPlayer();
  }

  handleDoodadSpace() {
    const doodadCard = this.cardStore.doodads.drawCard();
    this.activeCard = { type: "doodad", data: doodadCard };
    this.handleExpenseCard("doodad", doodadCard.expenseAmount);
    this.nextPlayer();
  }

  handleExpenseCard(type, expenseAmount) {
    this.currentPlayer.assets.savings -= expenseAmount;
    const { name } = this.currentPlayer;
    const msg = `${expenseAmount} is deducted from ${name} for ${type}`;
    this.addActivity(msg);
  }

  handleMarketSpace() {
    const marketCard = this.cardStore.market.drawCard();
    this.activeCard = { type: "market", data: marketCard };
    if (marketCard.relatedTo == "expense") {
      this.handleExpenseCard("market", marketCard.cash);
    }
    this.nextPlayer();
  }

  handleCharitySpace() {
    this.currentPlayer.gotCharitySpace = true;
  }

  handleDealSpace() {
    this.currentPlayer.gotDeal = true;
  }

  handleDownsizedSpace() {
    this.nextPlayer();
  }

  handlePayday() {
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
        this.addActivity(" crossed payday", this.currentPlayer.name);
        this.currentPlayer.addPayday();
      });
    }
  }

  grantLoan(playerName, loanAmount) {
    const player = this.getPlayerByName(playerName);
    const loanInterest = loanAmount / 10;
    player.addLiability("bankLoan", loanAmount);
    player.addExpense("bankLoanPayment", loanInterest);
    player.addToLedgerBalance(loanAmount);
    player.updateTotalExpense();
    player.updateCashFlow();
  }

  getPlayerByName(playerName) {
    const player = this.players.filter(player => player.name == playerName)[0];
    return player;
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
}

module.exports = Game;

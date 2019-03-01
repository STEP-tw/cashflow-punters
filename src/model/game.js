const {
  getNextNum,
  isBetween,
  add,
  calculateLoanToTake,
  randomNum
} = require("../utils/utils.js");

const _ = require("lodash");
const Auction = require("./auction");
const ActivityLog = require("./activityLog");

class Game {
  constructor(cardStore, board, host) {
    this.board = board;
    this.host = host;
    this.cardStore = cardStore;
    this.currentPlayer;
    this.players = [];
    this.hasStarted = false;
    this.financialStatement;
    this.activeCard;
    this.currentAuction = { present: false };
    this.activityLog;
  }

  addPlayer(player) {
    player.turn = this.players.length + 1;
    player.setNotification("Welcome to CashFlow");
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
    this.activityLog = new ActivityLog();
    this.players.map(this.setProfession, this);
    this.currentPlayer = this.players[0];
    this.activityLog.logGameStart();
    this.activityLog.logTurn(this.currentPlayer.name);
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
    this.players.forEach(player => { });
    return this.players.every(player => player.isTurnComplete);
  }

  nextPlayer() {
    this.currentPlayer.rolledDice = false;
    const currTurn = this.currentPlayer.getTurn();
    const nextPlayerTurn = getNextNum(currTurn, this.getPlayersCount());
    this.currentPlayer = this.players[nextPlayerTurn - 1];
    if (this.currentPlayer.removed) {
      this.nextPlayer();
    }
    this.activityLog.logTurn(this.currentPlayer.name);
  }

  handleSmallDeal() {
    this.activityLog.logSelectedSmallDeal(this.currentPlayer.name);
    const smallDealCard = this.cardStore.smallDeals.drawCard();
    this.activeCard = { type: "smallDeal", data: smallDealCard };
    this.activeCard.dealDoneCount = 0;
  }

  handleBigDeal() {
    this.activityLog.logSelectedBigDeal(this.currentPlayer.name);
    const bigDealCard = this.cardStore.bigDeals.drawCard();
    this.activeCard = { type: "bigDeal", data: bigDealCard };
  }

  handleBabySpace() {
    this.currentPlayer.addBaby();
    this.activityLog.logGotBaby(this.currentPlayer.name);
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

  addDebitActivity(expenseAmount, cause) {
    const { name } = this.currentPlayer;
    this.activityLog.logExpense(name, expenseAmount, cause);
    this.currentPlayer.setNotification(`${expenseAmount} ${msg} for ${cause}`);
    this.currentPlayer.addDebitEvent(expenseAmount, cause);
  }

  makeLedgerBalancePositive(player) {
    const loanAmount = calculateLoanToTake(player.ledgerBalance);
    this.grantLoan(player.name, loanAmount);
  }

  handleExpenseCard(cause, expenseAmount) {
    const player = this.currentPlayer;
    player.deductLedgerBalance(expenseAmount);
    if (player.isLedgerBalanceNegative()) {
      makeLedgerBalancePositive(player);
    }
    this.activityLog.logExpense(player.name, expenseAmount, cause);
    player.setNotification(`$${expenseAmount} deducted for ${cause}`);
    this.nextPlayer();
  }

  handleMarketSpace() {
    const marketCard = this.cardStore.market.drawCard();

    this.activeCard = { type: "market", data: marketCard };
    if (marketCard.relatedTo == "expense") {
      this.handleExpenseCard("property damage.", marketCard.cash);
      return;
    }
    if (marketCard.relatedTo == "realEstate") {
      this.players.forEach(player => {
        const marketRealEstatesType = marketCard.relatedRealEstates;
        const hasRealEstate = player.hasRealEstate(marketRealEstatesType);
        if (hasRealEstate) {
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

    if (marketCard.relatedTo == "splitOrReverse") {
      if (this.hasAnyoneShares(marketCard.symbol)) {
        this.currentPlayer.holdTurn();
      }
    }
    this.isPlayersTurnCompleted() && this.nextPlayer();
  }

  hasAnyoneShares(symbol) {
    return this.players.some(player => player.hasShares(symbol));
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
    this.activityLog.addActivity(activityMsg, currentPlayer.name);
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

  removePlayer(player, msg) {
    this.activityLog.addActivity(msg, player.name);
    player.removed = true;
  }

  handlePayday() {
    if (this.currentPlayer.isBankrupted()) {
      this.currentPlayer.bankrupt = true;
      this.currentPlayer.setNotification(
        "You are bankrupted. You can't continue the game!"
      );
      this.removePlayer(
        this.currentPlayer,
        " is out of the game because of bankruptcy"
      );
      this.nextPlayer();
      return;
    }
    if (this.currentPlayer.isBankruptcy()) {
      this.soldAsset(this.currentPlayer.name);
      this.currentPlayer.bankruptcy = true;
      this.activityLog.addActivity(
        " is in bankruptcy situation",
        this.currentPlayer.name
      );
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
    this.activityLog.addActivity(
      ` landed on ${currentSpaceType}`,
      currentPlayer.name
    );
    handlers[currentSpaceType]();
  }

  handleCrossedPayDay(oldSpaceNo) {
    const paydaySpaces = this.board.getPayDaySpaces();
    const crossedPaydays = paydaySpaces.filter(paydaySpace =>
      isBetween(oldSpaceNo, this.currentPlayer.currentSpace, paydaySpace)
    );
    if (crossedPaydays.length > 0) {
      crossedPaydays.forEach(() => {
        if (this.currentPlayer.isBankrupted()) {
          this.currentPlayer.bankrupt = true;
          this.currentPlayer.setNotification(
            "You are bankrupted. You can't continue the game!"
          );
          this.removePlayer(
            this.currentPlayer,
            " is out of the game because of bankruptcy"
          );
          this.nextPlayer();
          return;
        }
        if (this.currentPlayer.isBankruptcy()) {
          this.soldAsset(this.currentPlayer.name);
          this.currentPlayer.bankruptcy = true;
          this.activityLog.addActivity(
            " is in bankruptcy situation",
            this.currentPlayer.name
          );
          return;
        }
        this.activityLog.addActivity(
          " crossed payday",
          this.currentPlayer.name
        );
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
    this.activityLog.logLoanTaken(loanAmount, playerName);
    player.setNotification("You" + activityMessage);
  }

  payDebt(playerName, debtDetails) {
    const { expense, liability, liabilityPrice, expenseAmount } = debtDetails;
    const player = this.getPlayerByName(playerName);
    player.removeLiability(liability, liabilityPrice);
    player.removeExpense(expense, expenseAmount);
    player.updateFinancialStatement();
    player.addDebitEvent(liabilityPrice, `paid loan for ${liability}`);
    const activityMessage = ` paid debt $${liabilityPrice} for liability - ${liability}`;
    this.activityLog.logDebtPaid(liabilityPrice, liability, playerName);
    player.setNotification("you" + activityMessage);
  }

  soldAsset(playerName) {
    const player = this.getPlayerByName(playerName);
    let allAssets = player.assets.realEstates;
    allAssets.forEach(asset => {
      const amount = player.getDownPayment(asset);
      const expenseAmount = amount / 10;
      const debtDetails = {
        liability: "Bank Loan",
        liabilityPrice: amount,
        expense: "Bank Loan Payment",
        expenseAmount
      };
      this.payDebt(playerName, debtDetails);
      if (player.cashflow > 0) {
        player.setNotification("You are out of bankruptcy");
        return;
      }
    });
    player.setNotification("You are bankrupted");
    this.removePlayer(player, " is out of the game because of bankruptcy");
    this.nextPlayer();
    return;
  }

  acceptCharity() {
    this.currentPlayer.addCharityTurn();
    this.activeCard = "";
    this.activityLog.addActivity(" accepted charity", this.currentPlayer.name);
  }

  declineCharity() {
    this.activityLog.addActivity(" declined charity", this.currentPlayer.name);
    this.activeCard = "";
  }

  rollDice(numberOfDice) {
    const oldSpaceNo = this.currentPlayer.currentSpace;
    const diceValues = this.currentPlayer.rollDice(numberOfDice);
    const rolledDieMsg = " rolled " + diceValues.reduce(add);
    this.activityLog.addActivity(rolledDieMsg, this.currentPlayer.name);
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
    this.activityLog.addActivity(
      ` has bought ${numberOfShares} shares ${this.activeCard.data.symbol}`
    );
    this.currentPlayer.buyShares(this.activeCard.data, numberOfShares);
    this.nextPlayer();
  }

  sellShares(playerName, numberOfShares) {
    this.activityLog.addActivity(
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

  getPlayersByShares(symbol) {
    return this.players.filter(player => player.hasShares(symbol));
  }

  doublePlayersShares(symbol) {
    const playerWithShares = this.getPlayersByShares(symbol);
    playerWithShares.forEach(player => {
      this.activityLog.addActivity(
        `'s shares of ${symbol} got doubled`,
        player.name
      );
      player.doubleShares(symbol);
    });
  }

  splitPlayersShares(symbol) {
    const playerWithShares = this.getPlayersByShares(symbol);
    playerWithShares.forEach(player => {
      this.activityLog.addActivity(
        `'s shares of ${symbol} got halved`,
        player.name
      );
      player.removeHalfShares(symbol);
    });
  }

  rollDiceForSplitReverse(symbol) {
    const diceValue = randomNum(6);
    if (diceValue < 4) {
      this.doublePlayersShares(symbol);
      return [diceValue];
    }
    this.splitPlayersShares(symbol);
    return [diceValue];
  }

  createAuction(playerName, price) {
    this.currentAuction.present = true;
    const host = this.getPlayerByName(playerName);
    const bidders = this.players.filter(({ name }) => name != playerName);
    this.currentAuction.data = new Auction(host, price, bidders);
    return true;
  }

  handleBid(playerName, currentBid) {
    const data = this.currentAuction.data.setCurrentBid(currentBid, playerName);
    return data;
  }

  passBid(playerName) {
    const isAuctionClosed = this.currentAuction.data.passBid(playerName);
    if (isAuctionClosed) {
      this.currentAuction.present = false;
      this.nextPlayer();
    }
  }

  closeAuction() {
    this.currentAuction.data.sellDeal();
    this.activityLog.addActivity(`${this.currentPlayer.name} has closed the auction.`);
    this.currentAuction = { present: false };
    this.nextPlayer();
  }
}

module.exports = Game;

const {
  getNextNum,
  isBetween,
  add,
  calculateLoanToTake
} = require("../utils/utils.js");
const _ = require("lodash");
const Auction = require("./auction");
const ActivityLog = require("./activityLog");
const { ESCAPE_ERROR } = require("../constant");

class Game {
  constructor(cardStore, board, host) {
    this.board = board;
    this.host = host;
    this.cardStore = cardStore;
    this.currentPlayer;
    this.players = [];
    this.hasStarted = false;
    this.activeCard = { drawnBy: null, soldTo: null };
    this.currentAuction = { present: false };
    this.activityLog = new ActivityLog();
    this.fasttrackPlayers = [];
    this.bankruptedPlayersCount = 0;
    this.stableGameJson = "";
    this.joinedPlayerCount = 0;
    this.hasLoaded = false;
  }

  incJoinedPlayerCount() {
    this.joinedPlayerCount++;
  }

  resumeGame() {
    this.hasStarted = true;
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
    this.players.map(this.setProfession, this);
    this.currentPlayer = this.players[0];
    this.activityLog = new ActivityLog();
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

  setHasLoaded() {
    this.hasLoaded = true;
  }

  startGame() {
    this.initializeGame();
    this.hasStarted = true;
  }

  isPlaceAvailable() {
    return this.getPlayersCount() < 6;
  }

  isPlayersTurnCompleted() {
    return this.players.every(player => player.isTurnComplete);
  }

  isFasttrackPlayer() {
    return this.fasttrackPlayers.includes(this.currentPlayer);
  }

  notifyEscaping() {
    const playerName = this.currentPlayer.name;
    const rank = this.fasttrackPlayers.length + 1;
    this.activityLog.logEscape(playerName, rank);
    this.currentPlayer.notifyEscape = true;
    return;
  }

  payBankLoan(player) {
    const liability = "Bank Loan";
    const liabilityPrice = player.liabilities[liability];
    const expense = "Bank Loan Payment";
    const expenseAmount = player.expenses[expense];
    const debtDetails = { liability, liabilityPrice, expense, expenseAmount };
    this.payDebt(player.name, debtDetails);
  }

  nextPlayer() {
    this.currentPlayer.rolledDice = false;
    const currTurn = this.currentPlayer.getTurn();
    const nextPlayerTurn = getNextNum(currTurn, this.getPlayersCount());
    this.currentPlayer = this.players[nextPlayerTurn - 1];
    if (this.isFasttrackPlayer()) {
      this.nextPlayer();
      this.activityLog.logTurn(this.currentPlayer.name);
      return;
    }
    if (this.currentPlayer.hasEscape()) {
      this.payBankLoan(this.currentPlayer);
      this.notifyEscaping();
    }
    if (this.currentPlayer.bankrupted) {
      if (this.players.length == this.bankruptedPlayersCount) {
        this.currentPlayer = null;
        this.activityLog.addActivity("All players are bankrupted");
        return;
      }
      this.nextPlayer();
      return;
    }
    this.activityLog.logTurn(this.currentPlayer.name);
    if (this.currentPlayer.isDownSized()) {
      this.skipTurn();
    }
    this.resetActiveCard();
    this.stableGameJson = JSON.stringify(this);
  }

  setActiveCard(type, data) {
    const drawnBy = this.currentPlayer.name;
    this.activeCard = { type, data, drawnBy };
  }

  resetActiveCard() {
    this.activeCard.drawnBy = null;
    this.activeCard.soldTo = null;
  }

  handleSmallDeal() {
    this.activityLog.logSelectedSmallDeal(this.currentPlayer.name);
    const smallDealCard = this.cardStore.smallDeals.drawCard();
    this.setActiveCard("smallDeal", smallDealCard);
    this.activeCard.dealDoneCount = 0;
  }

  handleBigDeal() {
    this.activityLog.logSelectedBigDeal(this.currentPlayer.name);
    const bigDealCard = this.cardStore.bigDeals.drawCard();
    this.setActiveCard("bigDeal", bigDealCard);
  }

  handleBabySpace() {
    this.currentPlayer.addBaby();
    this.activityLog.logGotBaby(this.currentPlayer.name);
    this.currentPlayer.setNotification("You got a baby");
    this.nextPlayer();
  }

  handleDoodadSpace() {
    const doodadCard = this.cardStore.doodads.drawCard();
    this.setActiveCard("doodad", doodadCard);
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
    player.addDebitEvent(expenseAmount, "doodad");
    if (player.isLedgerBalanceNegative()) {
      this.makeLedgerBalancePositive(player);
    }
    this.activityLog.logExpense(player.name, expenseAmount, cause);
    player.setNotification(`$${expenseAmount} deducted for ${cause}`);
    this.nextPlayer();
  }

  handleMarketSpace() {
    const marketCard = this.cardStore.market.drawCard();

    this.setActiveCard("market", marketCard);
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
      if (!this.hasAnyoneShares(marketCard.symbol))
        this.activityLog.addActivity(
          `No one has shares of ${marketCard.symbol}`
        );
      if (this.hasAnyoneShares(marketCard.symbol))
        this.currentPlayer.holdTurn();
    }
    this.isPlayersTurnCompleted() && this.nextPlayer();
  }

  hasAnyoneShares(symbol) {
    return this.players.some(player => player.hasShares(symbol));
  }

  getCommonEstates(name) {
    const player = this.getPlayerByName(name);
    const playerRealEstates = player.liabilities.realEstates;
    const marketRealEstates = this.activeCard.data.relatedRealEstates;
    return playerRealEstates.filter(realEstate =>
      marketRealEstates.includes(realEstate.type)
    );
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

  bankrupt(player, msg) {
    this.activityLog.addActivity(
      " is out of the game because of bankruptcy",
      player.name
    );
    player.bankrupted = true;
    this.bankruptedPlayersCount++;
  }

  handlePayday() {
    if (this.currentPlayer.isBankruptcy()) {
      const outOfBankruptcy = this.handleBankruptcy(this.currentPlayer);
      if (!outOfBankruptcy) {
        this.nextPlayer();
        return true;
      }
    }

    const paydayAmount = this.currentPlayer.addPayday();
    this.currentPlayer.setNotification(
      `You got Payday.${paydayAmount} added to your Savings`
    );
    this.nextPlayer();
    return false;
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
    const isBankrupted = this.handleCrossedPayDay(oldSpaceNo);
    if (isBankrupted) {
      this.nextPlayer();
      return isBankrupted;
    }
    const currentSpaceType = this.board.getSpaceType(
      currentPlayer.currentSpace
    );
    this.activityLog.addActivity(
      ` landed on ${currentSpaceType}`,
      currentPlayer.name
    );
    return handlers[currentSpaceType]();
  }

  sellAssetToBank(player, asset) {
    const amount = player.getDownPayment(asset);
    const expenseAmount = amount / 10;
    const debtDetails = {
      liability: "Bank Loan",
      liabilityPrice: amount,
      expense: "Bank Loan Payment",
      expenseAmount
    };
    this.payDebt(player.name, debtDetails);
  }

  handleBankruptcy(player) {
    let allAssets = player.assets.realEstates;
    let outOfBankruptcy = false;
    allAssets.forEach(asset => {
      if (player.cashflow < 0) {
        this.sellAssetToBank(player, asset);
        return;
      }
      outOfBankruptcy = true;
    });
    if (outOfBankruptcy) {
      player.setNotification("You are out of bankruptcy");
      return outOfBankruptcy;
    }
    player.removeAllShares();
    player.setNotification("You are bankrupted");
    this.bankrupt(player);
    return outOfBankruptcy;
  }

  hasCrossedPayDay(oldSpaceNo) {
    const paydaySpaces = this.board.getPayDaySpaces();
    return paydaySpaces.some(paydaySpace =>
      isBetween(oldSpaceNo, this.currentPlayer.currentSpace, paydaySpace)
    );
  }

  handleCrossedPayDay(oldSpaceNo) {
    const paydaySpaces = this.board.getPayDaySpaces();
    let outOfBankruptcy = true;
    const crossedPaydays = paydaySpaces.filter(paydaySpace =>
      isBetween(oldSpaceNo, this.currentPlayer.currentSpace, paydaySpace)
    );
    if (crossedPaydays.length > 0) {
      crossedPaydays.forEach(() => {
        if (this.currentPlayer.isBankruptcy()) {
          outOfBankruptcy = this.handleBankruptcy(this.currentPlayer);
          if (!outOfBankruptcy) return;
        }
        this.activityLog.addActivity(
          " crossed payday",
          this.currentPlayer.name
        );
        const paydayAmount = this.currentPlayer.addPayday();
        this.currentPlayer.setNotification(
          `You got Payday.$${paydayAmount} added to your Savings`
        );
      });
      return !outOfBankruptcy;
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

  acceptCharity() {
    this.currentPlayer.addCharityTurn();
    this.activeCard = { drawnBy: null, sell: null };
    this.activityLog.addActivity(" accepted charity", this.currentPlayer.name);
  }

  declineCharity() {
    this.activityLog.addActivity(" declined charity", this.currentPlayer.name);
    this.activeCard = { drawnBy: null, sell: null };
  }

  isEligibleForMLM(oldSpaceNo, spaceType) {
    const player = this.currentPlayer;
    const hasMLM = player.hasMLM;
    const gotPayDay =
      this.hasCrossedPayDay(oldSpaceNo) || spaceType == "payday";
    return hasMLM && gotPayDay;
  }

  rollDice(numberOfDice) {
    const player = this.currentPlayer;
    const oldSpaceNo = player.currentSpace;
    const diceValues = player.rollDiceAndMove(numberOfDice);
    const rolledDieMsg = " rolled " + diceValues.reduce(add);
    this.activityLog.addActivity(rolledDieMsg, player.name);
    const spaceType = this.board.getSpaceType(player.currentSpace);
    let isBankrupted = false;
    const isEligibleForMLM = this.isEligibleForMLM(oldSpaceNo, spaceType);
    if (!isEligibleForMLM) {
      isBankrupted = this.handleSpace(oldSpaceNo);
    }
    if (isEligibleForMLM) {
      player.setNotification("Roll dice for MLM.");
      this.activityLog.addActivity(" rolling dice for MLM", player.name);
    }
    return { diceValues, spaceType, isEligibleForMLM, isBankrupted };
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
    const player = this.currentPlayer;
    this.activityLog.addActivity(
      ` has bought ${numberOfShares} shares ${this.activeCard.data.symbol}`,
      player.name
    );
    player.buyShares(this.activeCard.data, numberOfShares);
    this.nextPlayer();
  }

  sellShares(playerName, numberOfShares) {
    this.activityLog.addActivity(
      ` has sold ${numberOfShares} shares ${this.activeCard.data.symbol}`,
      playerName
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
    const diceValue = this.currentPlayer.rollDie();
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
    host.setNotification("You have created an auction for your current card.");
    this.activityLog.addActivity(
      `${playerName} has created an auction for current card`
    );
    return true;
  }

  handleBid(playerName, currentBid) {
    const currentAuction = this.currentAuction.data;
    const data = currentAuction.setCurrentBid(currentBid, playerName);
    if (currentAuction.bidders.length == 1 && data.ableToBid)
      this.closeAuction();
    return data;
  }

  passBid(playerName) {
    const { isAuctionClosed, isAbleToPass } = this.currentAuction.data.passBid(
      playerName
    );

    if (isAuctionClosed) this.closeAuction();

    return { message: ESCAPE_ERROR, isAbleToPass };
  }

  setCloseAuctionActivities() {
    this.activityLog.addActivity(
      ` has sold the the deal in ${this.currentAuction.data.currentBid}`,
      this.currentAuction.data.host.name
    );
    this.activityLog.addActivity(
      ` has bought the the deal in ${this.currentAuction.data.currentBid}`,
      this.currentAuction.data.bidder.name
    );
  }

  closeAuction() {
    this.currentAuction.data.sellDeal();
    this.activityLog.addActivity(
      `${this.currentPlayer.name} has closed the auction.`
    );
    const { bidder, host } = this.currentAuction.data;
    if (bidder.name == host.name) {
      this.nextPlayer();
      this.currentAuction = { present: false };
      return;
    }
    this.setCloseAuctionActivities();
    this.activeCard.soldTo = bidder.name;
    this.currentAuction = { present: false };
  }

  addToFasttrack(playerName) {
    const player = this.getPlayerByName(playerName);
    player.notifyEscape = false;
    this.fasttrackPlayers.push(player);
  }

  rollDiceForMLM() {
    const player = this.currentPlayer;
    const { gotMLM, diceValue, isMLMTurnLeft } = player.rollDiceForMLM();
    this.activityLog.logMLM(gotMLM, player.name);
    const spaceType = this.board.getSpaceType(player.currentSpace);
    if (!isMLMTurnLeft) {
      player.removeMLMTurn();
      this.handleSpace(player.oldSpaceNo);
      player.setNotification("Your MLM turn is over");
    }
    if (isMLMTurnLeft) {
      player.setNotification("Roll dice again for MLM.");
      this.activityLog.addActivity(" rolling dice again for MLM", player.name);
    }
    return { spaceType, diceValue, isMLMTurnLeft };
  }

  removePlayer(name) {
    this.players = this.players.filter(player => player.name != name);
    this.activityLog.addActivity(" left the game", name);
  }
}

module.exports = Game;

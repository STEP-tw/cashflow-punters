const {UNABLE_TO_DO_CHARITY_MSG} = require("./constant");

const startGame = function(req, res) {
  req.game.startGame();
  res.end();
};

const getGame = function(req, res) {
  const {playerName} = req.cookies;
  const game = req.game;
  const {currentPlayer} = game;
  if (currentPlayer.isDownSized()) {
    game.skipTurn();
  }
  game.requester = game.getPlayerByName(playerName);
  game.isMyTurn = game.isCurrentPlayer(playerName);
  res.send(JSON.stringify(game));
};

const getPlayersFinancialStatement = function(req, res) {
  const {playerName} = req.cookies;
  const requiredPlayer = req.game.getPlayerByName(playerName);
  res.send(JSON.stringify(requiredPlayer));
};

const rollDice = function(req, res) {
  const {numberOfDice} = req.body;
  const {playerName} = req.cookies;
  const game = req.game;
  const {currentPlayer} = game;
  if (currentPlayer.isDownSized()) {
    game.skipTurn();
    res.json({diceValues: [null]});
    return;
  }
  if (!game.isCurrentPlayer(playerName) || currentPlayer.rolledDice) {
    res.json({diceValues: [null]});
    return;
  }
  const currentSpaceDetails = req.game.rollDice(numberOfDice);
  res.json(currentSpaceDetails);
};

const acceptCharity = function(req, res) {
  req.game.acceptCharity();
  const ledgerBalance = req.game.currentPlayer.getLedgerBalance();
  req.game.nextPlayer();
  res.send(JSON.stringify({ledgerBalance}));
};

const declineCharity = function(req, res) {
  req.game.declineCharity();
  req.game.nextPlayer();
  res.end();
};

const selectSmallDeal = function(req, res) {
  let {currentPlayer} = req.game;
  if (currentPlayer.gotDeal) {
    req.game.handleSmallDeal();
    currentPlayer.gotDeal = false;
  }
  res.end();
};

const selectBigDeal = function(req, res) {
  let {currentPlayer} = req.game;
  if (currentPlayer.gotDeal) {
    req.game.handleBigDeal();
    currentPlayer.gotDeal = false;
  }
  res.end();
};

const grantLoan = function(req, res) {
  const {playerName} = req.cookies;
  const loanAmount = +req.body.amount;
  const game = req.game;
  game.grantLoan(playerName, loanAmount);
  const player = game.getPlayerByName(playerName);
  res.send(JSON.stringify(player));
};

const payDebt = function(req, res) {
  const {playerName} = req.cookies;
  const debtDetails = req.body;
  const game = req.game;
  game.payDebt(playerName, debtDetails);
  const player = game.getPlayerByName(playerName);
  res.send(JSON.stringify(player));
};

const provideLiabilities = function(req, res) {
  const {playerName} = req.cookies;
  const game = req.game;
  const player = game.getPlayerByName(playerName);
  res.send(JSON.stringify(player));
};

const isAbleToDoCharity = function(req, res) {
  const isAble = req.game.currentPlayer.isAbleToDoCharity();
  if (!isAble) req.game.currentPlayer.setNotification(UNABLE_TO_DO_CHARITY_MSG);
  res.send(JSON.stringify({isAble}));
};

const acceptSmallDeal = function(req, res) {
  const {activeCard} = req.game;
  if (activeCard.dealDone) return res.end();
  let isSuccessful = true;
  if (activeCard.data.relatedTo == "realEstate") {
    isSuccessful = req.game.currentPlayer.addRealEstate(activeCard.data);
  }
  if (activeCard.data.relatedTo == "goldCoins") {
    isSuccessful = req.game.currentPlayer.buyGoldCoins(activeCard.data);
  }
  if (!isSuccessful) return res.send({isSuccessful});
  let requestedPlayer = req.cookies["playerName"];
  req.game.addActivity(`${requestedPlayer} has accepted the deal`);
  if (activeCard.data.relatedTo == "shares") {
    return handleShareSmallDeal(req, res);
  }
  req.game.nextPlayer();
  activeCard.dealDone = true;
  res.send({isSuccessful});
};

const rejectSmallDeal = function(req, res) {
  const {activeCard} = req.game;
  if (activeCard.dealDone) return res.end();
  let requestedPlayer = req.cookies["playerName"];
  req.game.addActivity(`${requestedPlayer} has rejected the deal`);
  req.game.nextPlayer();
  activeCard.dealDone = true;
  res.end();
};

const acceptBigDeal = function(req, res) {
  const {activeCard} = req.game;
  if (activeCard.dealDone) return res.end();
  const isSuccessful = req.game.currentPlayer.addRealEstate(activeCard.data);
  if (!isSuccessful) return res.send({isSuccessful});
  let requestedPlayer = req.cookies["playerName"];
  req.game.addActivity(`${requestedPlayer} has accepted the deal`);
  req.game.nextPlayer();
  activeCard.dealDone = true;
  res.end();
};

const rejectBigDeal = function(req, res) {
  const {activeCard} = req.game;
  if (activeCard.dealDone) return res.end();
  let requestedPlayer = req.cookies["playerName"];
  req.game.addActivity(`${requestedPlayer} has rejected the deal`);
  req.game.nextPlayer();
  activeCard.dealDone = true;
  res.end();
};

const hasCharity = function(req, res) {
  const {playerName} = req.cookies;
  const game = req.game;
  if (!game.isCurrentPlayer(playerName)) {
    res.send(JSON.stringify({hasCharityTurns: false}));
    return;
  }
  const hasCharityTurns = req.game.hasCharityTurns();
  res.send(JSON.stringify({hasCharityTurns}));
};

const isSharePresent = function(req, res) {
  const {playerName} = req.cookies;
  const hasShares = req.game.hasShares(playerName);
  res.json({hasShares});
};

const buyShares = function(req, res) {
  let {numberOfShares} = req.body;
  const isCapable = req.game.isPlayerCapableToBuy(numberOfShares);
  if (isCapable) {
    req.game.buyShares(numberOfShares);
  }
  res.json({isCapable});
};

const sellShares = function(req, res) {
  const {playerName} = req.cookies;
  let {numberOfShares} = req.body;
  const isCapable = req.game.isPlayerCapableToSell(playerName, numberOfShares);
  if (isCapable) {
    req.game.sellShares(playerName, numberOfShares);
  }
  res.json({isCapable});
};

module.exports = {
  getGame,
  startGame,
  getPlayersFinancialStatement,
  acceptCharity,
  declineCharity,
  selectBigDeal,
  selectSmallDeal,
  grantLoan,
  payDebt,
  isAbleToDoCharity,
  provideLiabilities,
  acceptSmallDeal,
  rejectSmallDeal,
  buyShares,
  acceptBigDeal,
  rejectBigDeal,
  hasCharity,
  rollDice,
  isSharePresent,
  sellShares
};

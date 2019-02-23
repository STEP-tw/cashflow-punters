const { CHARITY_MSG, UNABLE_TO_DO_CHARITY_MSG } = require("./constant");

const startGame = function(req, res) {
  req.game.getInitialDetails();
  req.game.hasStarted = true;
  res.end();
};

const getPlayers = function(req, res) {
  res.send(JSON.stringify(req.game.players));
};

const isCurrentPlayer = function(player, playerName) {
  return player.name == playerName;
};

const getGame = function(req, res) {
  const { playerName } = req.cookies;
  const game = req.game;
  const { currentPlayer } = game;
  if (currentPlayer.isDownSized()) {
    game.skipTurn();
  }
  game.requestedPlayer = game.getPlayer(playerName);
  game.isMyTurn = isCurrentPlayer(game.currentPlayer, playerName);
  res.send(JSON.stringify(game));
};

const getPlayersFinancialStatement = function(req, res) {
  const { playerName } = req.cookies;
  const requiredPlayer = req.game.getPlayerByName(playerName);
  res.send(JSON.stringify(requiredPlayer));
};

const rollDice = function(req, res) {
  const { numberOfDice } = req.body;
  const { playerName } = req.cookies;
  const { currentPlayer } = req.game;
  if (currentPlayer.isDownSized()) {
    req.game.skipTurn();
    res.json({ diceValues: [null] });
    return;
  }
  if (!isCurrentPlayer(currentPlayer, playerName) || currentPlayer.rolledDice) {
    res.json({ diceValues: [null] });
    return;
  }
  const currentSpaceDetails = req.game.rollDice(numberOfDice);
  res.json(currentSpaceDetails);
};

const acceptCharity = function(req, res) {
  req.game.acceptCharity();
  const ledgerBalance = req.game.currentPlayer.getLedgerBalance();
  req.game.nextPlayer();
  res.send(JSON.stringify({ ledgerBalance }));
};

const declineCharity = function(req, res) {
  req.game.declineCharity();
  req.game.nextPlayer();
  res.end();
};

const selectSmallDeal = function(req, res) {
  let { currentPlayer } = req.game;
  if (currentPlayer.gotDeal) {
    req.game.handleSmallDeal();
    currentPlayer.gotDeal = false;
  }
  res.end();
};

const selectBigDeal = function(req, res) {
  let { currentPlayer } = req.game;
  if (currentPlayer.gotDeal) {
    req.game.handleBigDeal();
    currentPlayer.gotDeal = false;
  }
  res.end();
};

const grantLoan = function(req, res) {
  const { playerName } = req.cookies;
  const loanAmount = +req.body.amount;
  const game = req.game;
  game.grantLoan(playerName, loanAmount);
  const player = game.getPlayerByName(playerName);
  res.send(JSON.stringify(player));
};

const payDebt = function(req, res) {
  const { playerName } = req.cookies;
  const debtDetails = req.body;
  const game = req.game;
  game.payDebt(playerName, debtDetails);
  const player = game.getPlayerByName(playerName);
  res.send(JSON.stringify(player));
};

const provideLiabilities = function(req, res) {
  const { playerName } = req.cookies;
  const game = req.game;
  const player = game.getPlayerByName(playerName);
  res.send(JSON.stringify(player));
};

const isAbleToDoCharity = function(req, res) {
  const isAble = req.game.currentPlayer.isAbleToDoCharity();
  if (!isAble) req.game.currentPlayer.setNotification(UNABLE_TO_DO_CHARITY_MSG);
  res.send(JSON.stringify({ isAble }));
};

const handleShareSmallDeal = function(req, res) {
  const { activeCard } = req.game;
  activeCard.dealDoneCount++;
  if (activeCard.dealDoneCount >= req.game.players.length) {
    activeCard.dealDoneCount = 0;
    activeCard.dealDone = true;
    req.game.nextPlayer();
  }
  res.send({ isSuccessful: true });
};

const acceptSmallDeal = function(req, res) {
  const { activeCard } = req.game;
  if (activeCard.dealDone) return res.end();
  let isSuccessful = true;
  if (activeCard.data.relatedTo == "realEstate") {
    isSuccessful = req.game.currentPlayer.addRealEstate(activeCard.data);
  }
  if (activeCard.data.relatedTo == "goldCoins") {
    isSuccessful = req.game.currentPlayer.buyGoldCoins(activeCard.data);
  }
  if (!isSuccessful) return res.send({ isSuccessful });
  let requestedPlayer = req.cookies["playerName"];
  req.game.addActivity(`${requestedPlayer} has accepted the deal`);
  if (activeCard.data.relatedTo == "shares") {
    return handleShareSmallDeal(req, res);
  }
  req.game.nextPlayer();
  activeCard.dealDone = true;
  res.send({ isSuccessful });
};

const rejectSmallDeal = function(req, res) {
  const { activeCard } = req.game;
  if (activeCard.dealDone) return res.end();
  let requestedPlayer = req.cookies["playerName"];
  req.game.addActivity(`${requestedPlayer} has rejected the deal`);
  if (activeCard.data.relatedTo == "shares") {
    return handleShareSmallDeal(req, res);
  }
  req.game.nextPlayer();
  activeCard.dealDone = true;
  res.end();
};

const acceptBigDeal = function(req, res) {
  const { activeCard } = req.game;
  if (activeCard.dealDone) return res.end();
  const isSuccessful = req.game.currentPlayer.addRealEstate(activeCard.data);
  if (!isSuccessful) return res.send({ isSuccessful });
  let requestedPlayer = req.cookies["playerName"];
  req.game.addActivity(`${requestedPlayer} has accepted the deal`);
  req.game.nextPlayer();
  activeCard.dealDone = true;
  res.end();
};

const rejectBigDeal = function(req, res) {
  const { activeCard } = req.game;
  if (activeCard.dealDone) return res.end();
  let requestedPlayer = req.cookies["playerName"];
  req.game.addActivity(`${requestedPlayer} has rejected the deal`);
  req.game.nextPlayer();
  activeCard.dealDone = true;
  res.end();
};

const hasCharity = function(req, res) {
  const { playerName } = req.cookies;
  const currentPlayer = req.game.currentPlayer;
  if(!isCurrentPlayer(currentPlayer, playerName)){
    res.send(JSON.stringify({ hasCharityTurns: false }));
    return
  }
  const hasCharityTurns = req.game.hasCharityTurns();
  res.send(JSON.stringify({ hasCharityTurns }));
};

module.exports = {
  getPlayers,
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
  acceptBigDeal,
  rejectBigDeal,
  hasCharity,
  rollDice
};

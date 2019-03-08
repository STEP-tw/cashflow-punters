const { UNABLE_TO_DO_CHARITY_MSG } = require("./constant");

const startGame = function (req, res) {
  const game = req.game;
  if (game.hasLoaded) {
    game.resumeGame();
    return res.end();
  }
  req.game.startGame();
  res.end();
};

const getGame = function (req, res) {
  const { playerName } = req.cookies;
  const game = req.game;
  if (!req.game) {
    return;
  }

  game.requester = game.getPlayerByName(playerName);

  if (!req.game.currentPlayer) {
    game.isMyTurn = false;
    res.send(JSON.stringify(game));
    return;
  }

  game.isMyTurn = game.isCurrentPlayer(playerName);
  res.send(JSON.stringify(game));
};

const getPlayersFinancialStatement = function (req, res) {
  const { playerName } = req.cookies;
  const requiredPlayer = req.game.getPlayerByName(playerName);
  res.send(JSON.stringify(requiredPlayer));
};

const rollDice = function (req, res) {
  const { numberOfDice } = req.body;
  const { playerName } = req.cookies;
  const game = req.game;
  const { currentPlayer } = game;
  if (currentPlayer.isDownSized()) {
    game.skipTurn();
    res.json({ diceValues: [null] });
    return;
  }
  if (!game.isCurrentPlayer(playerName) || currentPlayer.rolledDice) {
    res.json({ diceValues: [null] });
    return;
  }
  const currentSpaceDetails = req.game.rollDice(numberOfDice);
  res.json(currentSpaceDetails);
};

const acceptCharity = function (req, res) {
  req.game.acceptCharity();
  const ledgerBalance = req.game.currentPlayer.getLedgerBalance();
  req.game.nextPlayer();
  res.send(JSON.stringify({ ledgerBalance }));
};

const declineCharity = function (req, res) {
  req.game.declineCharity();
  req.game.nextPlayer();
  res.end();
};

const selectSmallDeal = function (req, res) {
  req.game.handleSmallDeal();
  res.end();
};

const selectBigDeal = function (req, res) {
  req.game.handleBigDeal();
  res.end();
};

const grantLoan = function (req, res) {
  const { playerName } = req.cookies;
  const loanAmount = +req.body.amount;
  const game = req.game;
  game.grantLoan(playerName, loanAmount);
  const player = game.getPlayerByName(playerName);
  res.send(JSON.stringify(player));
};

const payDebt = function (req, res) {
  const { playerName } = req.cookies;
  const debtDetails = req.body;
  const game = req.game;
  game.payDebt(playerName, debtDetails);
  const player = game.getPlayerByName(playerName);
  res.send(JSON.stringify(player));
};

const provideLiabilities = function (req, res) {
  const { playerName } = req.cookies;
  const game = req.game;
  const player = game.getPlayerByName(playerName);
  res.send(JSON.stringify(player));
};

const isAbleToDoCharity = function (req, res) {
  const isAble = req.game.currentPlayer.isAbleToDoCharity();
  if (!isAble) req.game.currentPlayer.setNotification(UNABLE_TO_DO_CHARITY_MSG);
  res.send(JSON.stringify({ isAble }));
};

const acceptRealEstateDeal = function (player, game) {
  const activeCardData = game.activeCard.data;
  const isSuccessful = player.addRealEstate(activeCardData);
  game.activityLog.addActivity(
    `${player.name} has bought ${activeCardData.type}`
  );
  return isSuccessful;
};

const acceptGoldCoinsDeal = function (player, game) {
  const activeCardData = game.activeCard.data;
  const isSuccessful = player.buyGoldCoins(activeCardData);
  game.activityLog.addActivity(
    `${player.name} has bought ${activeCardData.numberOfCoins} gold coins`
  );
  return isSuccessful;
};

const acceptMLMDeal = function (player, game) {
  const activeCardData = game.activeCard.data;
  const isSuccessful = player.addMLM(activeCardData);
  game.activityLog.addActivity(`${player.name} has bought MLM card`);
  return isSuccessful;
};

const acceptSmallDeal = function (req, res) {
  const { activeCard } = req.game;
  const { playerName } = req.cookies;
  const player = req.game.getPlayerByName(playerName);
  if (playerName != activeCard.drawnBy) return res.json({ isSuccessful: true });
  const dealHandlers = {
    realEstate: acceptRealEstateDeal,
    goldCoins: acceptGoldCoinsDeal,
    MLM: acceptMLMDeal
  };
  const dealType = activeCard.data.relatedTo;
  const isSuccessful = dealHandlers[dealType](player, req.game);
  if (!isSuccessful) return res.json({ isSuccessful });
  req.game.nextPlayer();
  res.json({ isSuccessful });
};

const rejectSmallDeal = function (req, res) {
  let requestedPlayer = req.cookies["playerName"];
  req.game.activityLog.addActivity(`${requestedPlayer} has rejected the deal`);
  req.game.nextPlayer();
  res.end();
};

const acceptBigDeal = function (req, res) {
  const { playerName } = req.cookies;
  const { activeCard } = req.game;
  if (playerName != activeCard.drawnBy) return res.send({ isSuccessful: true });
  const player = req.game.getPlayerByName(playerName);
  const isSuccessful = acceptRealEstateDeal(player, req.game);
  if (!isSuccessful) return res.send({ isSuccessful });
  req.game.nextPlayer();
  res.send({ isSuccessful });
};

const rejectBigDeal = function (req, res) {
  let requestedPlayer = req.cookies["playerName"];
  req.game.activityLog.addActivity(`${requestedPlayer} has rejected the deal`);
  req.game.nextPlayer();
  res.end();
};

const hasCharity = function (req, res) {
  const { playerName } = req.cookies;
  const game = req.game;
  if (!game.isCurrentPlayer(playerName)) {
    res.send(JSON.stringify({ hasCharityTurns: false }));
    return;
  }
  const hasCharityTurns = req.game.hasCharityTurns();
  res.send(JSON.stringify({ hasCharityTurns }));
};

const isSharePresent = function (req, res) {
  const { playerName } = req.cookies;
  const hasShares = req.game.hasShares(playerName);
  res.json({ hasShares });
};

const buyShares = function (req, res) {
  let { numberOfShares } = req.body;
  const isCapable = req.game.isPlayerCapableToBuy(numberOfShares);
  if (isCapable) {
    req.game.buyShares(numberOfShares);
  }
  res.json({ isCapable });
};

const sellShares = function (req, res) {
  const { playerName } = req.cookies;
  let { numberOfShares } = req.body;
  const isCapable = req.game.isPlayerCapableToSell(playerName, numberOfShares);
  if (isCapable) {
    req.game.sellShares(playerName, numberOfShares);
  }
  res.json({ isCapable });
};

const completeTurn = function (req, res) {
  const { playerName } = req.cookies;
  const player = req.game.getPlayerByName(playerName);
  player.completeTurn();
  if (req.game.isPlayersTurnCompleted()) req.game.nextPlayer();
  res.end();
};

const sellEstate = function (req, res) {
  const estate = req.body;
  const game = req.game;
  const marketCard = game.activeCard;
  const { playerName } = req.cookies;
  const player = req.game.getPlayerByName(playerName);
  const selllingPrice = player.sellEstate(estate, marketCard);
  game.activityLog.addActivity(
    ` sold Real Estate for $${selllingPrice} `,
    playerName
  );
  res.end();
};

const provideCommonEstates = function (req, res) {
  const { playerName } = req.cookies;
  const commonEstates = req.game.getCommonEstates(playerName);
  res.send(JSON.stringify(commonEstates));
};

const sellGoldCoins = function (req, res) {
  const { cost, numberOfCoins } = req.body;
  const game = req.game;
  const { playerName } = req.cookies;
  const player = game.getPlayerByName(playerName);
  game.activityLog.addActivity(
    ` sold ${numberOfCoins} gold coins at rate of ${cost}`,
    playerName
  );
  player.sellGoldCoins(numberOfCoins, cost);
  res.end();
};

const hasShares = function (req, res) {
  const { symbol } = req.body;
  const game = req.game;
  const player = game.currentPlayer;
  const hasShares = game.hasAnyoneShares(symbol);

  if (hasShares) player.setNotification("Roll Dice for Split & reverse card");
  res.send(JSON.stringify({ hasShares }));
};

const rollDiceForSplitReverse = function (req, res) {
  const { symbol } = req.body;
  const game = req.game;
  const diceValue = game.rollDiceForSplitReverse(symbol);
  res.send(JSON.stringify(diceValue));
};

const createAuction = function (req, res) {
  const { basePrice } = req.body;
  const { playerName } = req.cookies;
  const isAuction = req.game.createAuction(playerName, +basePrice);
  res.json({ isAuction, playerName, basePrice });
};

const bid = function (req, res) {
  const { playerName } = req.cookies;
  const { currentBid } = req.body;
  const bidData = req.game.handleBid(playerName, +currentBid);
  res.json(bidData);
};

const passBid = function (req, res) {
  const { playerName } = req.cookies;
  const { message, isAbleToPass } = req.game.passBid(playerName);
  const ableToBid = !isAbleToPass;
  res.json({ message, ableToBid, isAbleToPass });
};

const handleBid = function (req, res) {
  const { wantToBid } = req.body;
  if (!req.game.currentAuction.present) return res.json({ isAbleToBid: false });
  if (wantToBid) return bid(req, res);
  passBid(req, res);
};

const closeAuction = function (req, res) {
  req.game.closeAuction();
  res.json({ isAuction: false, message: "" });
};

const handleAuction = function (req, res) {
  const { action } = req.body;
  if (action) return createAuction(req, res);
  closeAuction(req, res);
};

const addToFastTrack = function (req, res) {
  const game = req.game;
  const { playerName } = req.cookies;
  game.addToFasttrack(playerName);
  res.end();
};

const rollDiceForMLM = function (req, res) {
  const game = req.game;
  const data = game.rollDiceForMLM();
  res.send(JSON.stringify(data));
};

const removePlayer = function (req, res) {
  const game = req.game;
  const { playerName } = req.cookies;
  game.removePlayer(playerName);
  res.clearCookie("playerName");
  res.clearCookie("gameId");
  res.end();
};

const saveGame = function (req, res) {
  const { savedGames, fs } = res.app;
  const gameId = req.cookies["gameId"];
  const game = Object.assign({}, JSON.parse(req.game.stableGameJson));
  game.stableGameJson = "";
  savedGames[gameId] = game;
  fs.writeFile("./data/savedGames.json", JSON.stringify(savedGames), () => { });
  res.end();
};

const renderRequesterData = function (req, res) {
  const { playerName } = req.cookies;
  const game = req.game;
  const requesterData = game.getPlayerByName(playerName);
  res.send(JSON.stringify(requesterData));
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
  sellShares,
  completeTurn,
  sellEstate,
  provideCommonEstates,
  sellGoldCoins,
  hasShares,
  rollDiceForSplitReverse,
  handleAuction,
  addToFastTrack,
  handleBid,
  rollDiceForMLM,
  removePlayer,
  saveGame,
  renderRequesterData
};

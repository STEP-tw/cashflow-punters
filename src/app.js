const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { createGameId } = require("./utils/utils");
const { renderHomePage, getCurrentGame, logRequest } = require("./handlers.js");
const {
  hostGame,
  joinGame,
  cancelGame,
  provideGameLobby
} = require("./hostAndJoinHandlers");

const app = express();

const readSavedGames = () => {
  if (!fs.existsSync("./data/savedGames.json")) {
    fs.writeFileSync("./data/savedGames.json", JSON.stringify({}));
  }
  return fs.readFileSync("./data/savedGames.json", "utf-8");
};

const loadSavedGames = function() {
  const games = readSavedGames();
  app.savedGames = JSON.parse(games);
};

const {
  getGame,
  payDebt,
  rollDice,
  passDeal,
  saveGame,
  hasShares,
  buyShares,
  startGame,
  grantLoan,
  handleBid,
  hasCharity,
  sellEstate,
  sellShares,
  addCashFlow,
  acceptFtDeal,
  removePlayer,
  completeTurn,
  acceptCharity,
  rejectBigDeal,
  handleAuction,
  sellGoldCoins,
  selectBigDeal,
  acceptBigDeal,
  rollDiceForMLM,
  addToFastTrack,
  isSharePresent,
  declineCharity,
  acceptSmallDeal,
  rejectSmallDeal,
  selectSmallDeal,
  isAbleToDoCharity,
  provideLiabilities,
  renderRequesterData,
  provideCommonEstates,
  rollDiceForSplitReverse,
  getPlayersFinancialStatement
} = require("./gameHandlers");

app.fs = fs;
app.games = {};
app.createGameId = createGameId;
loadSavedGames();

app.use(logRequest);
app.use(cookieParser());
app.use(getCurrentGame);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", renderHomePage);
app.get("/acceptFtDeal", acceptFtDeal);
app.get("/getgame", getGame);
app.get("/savegame", saveGame);
app.get("/passdeal", passDeal);
app.get("/startgame", startGame);
app.get("/hascharity", hasCharity);
app.get("/cancelgame", cancelGame);
app.get("/leavegame", removePlayer);
app.get("/addcashflow", addCashFlow);
app.get("/completeturn", completeTurn);
app.get("/gamelobby", provideGameLobby);
app.get("/selectBigDeal", selectBigDeal);
app.get("/acceptCharity", acceptCharity);
app.get("/acceptBigDeal", acceptBigDeal);
app.get("/declineBigDeal", rejectBigDeal);
app.get("/addtofasttrack", addToFastTrack);
app.get("/requester", renderRequesterData);
app.get("/issharepresent", isSharePresent);
app.get("/rolldiceformlm", rollDiceForMLM);
app.get("/declineCharity", declineCharity);
app.get("/liabilities", provideLiabilities);
app.get("/selectSmallDeal", selectSmallDeal);
app.get("/acceptSmallDeal", acceptSmallDeal);
app.get("/declineSmallDeal", rejectSmallDeal);
app.get("/commonestates", provideCommonEstates);
app.get("/isabletodocharity", isAbleToDoCharity);
app.get("/financialStatement", getPlayersFinancialStatement);

app.post("/paydebt", payDebt);
app.post("/hostgame", hostGame);
app.post("/joingame", joinGame);
app.post("/rolldice", rollDice);
app.post("/takeloan", grantLoan);
app.post("/buyshares", buyShares);
app.post("/handlebid", handleBid);
app.post("/hasshares", hasShares);
app.post("/sellshares", sellShares);
app.post("/sellestate", sellEstate);
app.post("/sellgoldcoins", sellGoldCoins);
app.post("/handleauction", handleAuction);
app.post("/rolldiceforsplitreverse", rollDiceForSplitReverse);

app.use(express.static("public/"));
app.use(express.static("public/pages"));
app.use(express.static("public/images"));
app.use(express.static("public/scripts"));
app.use(express.static("public/stylesheets"));

module.exports = app;

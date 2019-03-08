const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const fs = require("fs");
const { createGameId } = require("./utils/utils");
const { renderHomePage, getCurrentGame, logRequest } = require("./handlers.js");
const {
  hostGame,
  joinGame,
  cancelGame,
  provideGameLobby
} = require("./hostAndJoinHandlers");
const { restoreGames } = require('./loadGame');

const loadSavedGames = function () {
  fs.readFile('./data/savedGames.json',"utf-8" ,(err, content) => {
    const games = restoreGames(JSON.parse(content));
    app.savedGames = games;
  })
}

const {
  getGame,
  payDebt,
  rollDice,
  saveGame,
  hasShares,
  buyShares,
  startGame,
  grantLoan,
  handleBid,
  hasCharity,
  sellEstate,
  sellShares,
  completeTurn,
  handleAuction,
  sellGoldCoins,
  selectBigDeal,
  acceptBigDeal,
  acceptCharity,
  rejectBigDeal,
  addToFastTrack,
  isSharePresent,
  declineCharity,
  acceptSmallDeal,
  rejectSmallDeal,
  selectSmallDeal,
  isAbleToDoCharity,
  provideLiabilities,
  provideCommonEstates,
  rollDiceForSplitReverse,
  getPlayersFinancialStatement,
  rollDiceForMLM,
  removePlayer,
  renderRequesterData
} = require("./gameHandlers");

app.games = {};
app.createGameId = createGameId;
app.fs = fs;
loadSavedGames();
app.use(logRequest);
app.use(cookieParser());
app.use(getCurrentGame);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", renderHomePage);
app.get("/getgame", getGame);
app.get("/startgame", startGame);
app.get("/hascharity", hasCharity);
app.get("/completeturn", completeTurn);
app.get("/gamelobby", provideGameLobby);
app.get("/selectBigDeal", selectBigDeal);
app.get("/acceptCharity", acceptCharity);
app.get("/acceptBigDeal", acceptBigDeal);
app.get("/declineBigDeal", rejectBigDeal);
app.get("/issharepresent", isSharePresent);
app.get("/declineCharity", declineCharity);
app.get("/liabilities", provideLiabilities);
app.get("/selectSmallDeal", selectSmallDeal);
app.get("/addtofasttrack", addToFastTrack);
app.get("/acceptSmallDeal", acceptSmallDeal);
app.get("/declineSmallDeal", rejectSmallDeal);
app.get("/commonestates", provideCommonEstates);
app.get("/isabletodocharity", isAbleToDoCharity);
app.get("/financialStatement", getPlayersFinancialStatement);
app.get("/rolldiceformlm", rollDiceForMLM);
app.get("/leavegame", removePlayer);
app.get("/savegame", saveGame);
app.get("/requester", renderRequesterData);
app.get("/cancelgame", cancelGame);

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

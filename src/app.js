const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const { createGameId } = require("./utils/utils");
const {
  hostGame,
  provideGameLobby,
  joinGame,
  getPlayers,
  startGame,
  getGame,
  canJoin,
  getPlayersFinancialStatement,
  acceptCharity,
  declineCharity,
  rollDice,
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
  hasCharity
} = require("./gameHandlers");
const { renderHomePage, getCurrentGame, logRequest } = require("./handlers.js");

app.games = {};
app.createGameId = createGameId;
app.use(logRequest);
app.use(cookieParser());
app.use(getCurrentGame);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/", renderHomePage);
app.get("/gamelobby", provideGameLobby);
app.get("/getgame", getGame);
app.get("/startgame", startGame);
app.get("/getPlayerProfessions", getPlayers);
app.get("/selectSmallDeal", selectSmallDeal);
app.get("/selectBigDeal", selectBigDeal);
app.get("/liabilities", provideLiabilities);
app.get("/acceptCharity", acceptCharity);
app.get("/financialStatement", getPlayersFinancialStatement);
app.get("/acceptSmallDeal", acceptSmallDeal);
app.get("/declineSmallDeal", rejectSmallDeal);
app.get("/acceptBigDeal", acceptBigDeal);
app.get("/declineBigDeal", rejectBigDeal);
app.get("/declineCharity", declineCharity);
app.get("/isabletodocharity", isAbleToDoCharity);
app.get("/hascharity", hasCharity);
app.post("/canjoin", canJoin);
app.post("/joingame", joinGame);
app.post("/takeloan", grantLoan);
app.post("/paydebt", payDebt);
app.post("/hostgame", hostGame);
app.post("/rolldice", rollDice);
app.use(express.static("public/"));
app.use(express.static("public/pages"));
app.use(express.static("public/scripts"));
app.use(express.static("public/stylesheets"));
app.use(express.static("public/images"));

module.exports = app;

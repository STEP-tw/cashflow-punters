const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const { createGameId } = require("./utils/utils");
const { renderHomePage, getCurrentGame, logRequest } = require("./handlers.js");
const {
  canJoin,
  hostGame,
  joinGame,
  provideGameLobby
} = require("./hostAndJoinHandlers");
const {
  getGame,
  payDebt,
  rollDice,
  startGame,
  grantLoan,
  getPlayers,
  hasCharity,
  selectBigDeal,
  acceptBigDeal,
  acceptCharity,
  rejectBigDeal,
  declineCharity,
  acceptSmallDeal,
  rejectSmallDeal,
  selectSmallDeal,
  isAbleToDoCharity,
  provideLiabilities,
  getPlayersFinancialStatement
} = require("./gameHandlers");

app.games = {};
app.createGameId = createGameId;
app.use(logRequest);
app.use(cookieParser());
app.use(getCurrentGame);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", renderHomePage);
app.get("/getgame", getGame);
app.get("/startgame", startGame);
app.get("/hascharity", hasCharity);
app.get("/gamelobby", provideGameLobby);
app.get("/selectBigDeal", selectBigDeal);
app.get("/acceptCharity", acceptCharity);
app.get("/acceptBigDeal", acceptBigDeal);
app.get("/declineBigDeal", rejectBigDeal);
app.get("/declineCharity", declineCharity);
app.get("/liabilities", provideLiabilities);
app.get("/getPlayerProfessions", getPlayers);
app.get("/selectSmallDeal", selectSmallDeal);
app.get("/acceptSmallDeal", acceptSmallDeal);
app.get("/declineSmallDeal", rejectSmallDeal);
app.get("/isabletodocharity", isAbleToDoCharity);
app.get("/financialStatement", getPlayersFinancialStatement);

app.post("/paydebt", payDebt);
app.post("/canjoin", canJoin);
app.post("/joingame", joinGame);
app.post("/hostgame", hostGame);
app.post("/rolldice", rollDice);
app.post("/takeloan", grantLoan);

app.use(express.static("public/"));
app.use(express.static("public/pages"));
app.use(express.static("public/images"));
app.use(express.static("public/scripts"));
app.use(express.static("public/stylesheets"));

module.exports = app;

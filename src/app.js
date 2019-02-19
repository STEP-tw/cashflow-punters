const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
<<<<<<< HEAD
const { createGameId } = require("./utils/utils");
const {
  hostGame,
  provideGameLobby,
  joinGame,
  getPlayers,
  getGame
} = require("./gameHandlers");
=======
const { createGameId } = require('./utils/utils');
const { hostGame, provideGameLobby, joinGame,startGame, getPlayers, getGame } = require('./gameHandlers');
>>>>>>> 40a2ce385122eb95b8807d70ca70f676b5f81078
const {
  renderHomePage,
  getCurrentGame,
  logRequest,
  rollDie
} = require("./handlers.js");

app.games = {};
app.createGameId = createGameId;
app.use(cookieParser());
app.use(logRequest);
app.use(getCurrentGame);
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", renderHomePage);
app.get("/gamelobby", provideGameLobby);
app.post("/hostgame", hostGame);
app.get("/rolldie", rollDie);
app.get("/getgame", getGame);
app.get("/startgame", startGame);
app.post("/joingame", joinGame);
app.use(bodyParser.json());
app.get("/getPlayerProfessions", getPlayers);
app.use(express.static("public/"));
app.use(express.static("public/pages"));
app.use(express.static("public/scripts"));
app.use(express.static("public/stylesheets"));
app.use(express.static("public/images"));

module.exports = app;

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const {hostGame, renderPlayerNames,getPlayerProfessions} = require('./gameHandlers');

const {
  renderHomePage,
  getCurrentGame,
  logRequest,
  startGame,
  rollDie
} = require("./handlers.js");

app.games = {};
app.use(cookieParser());
app.use(logRequest);

app.use(getCurrentGame);
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", renderHomePage);
app.get("/playernames", renderPlayerNames);
app.post("/hostgame", hostGame);
app.get("/rolldie", rollDie);
app.get("/startgame", startGame);
app.use(bodyParser.json());
app.use(express.static('public/pages'));
app.use(express.static('public/scripts'));
app.use(express.static('public/stylesheets'));
app.get('/getPlayerProfessions',getPlayerProfessions);
app.use(express.static('public/images'));
app.use(express.static("public/"));

module.exports = app;

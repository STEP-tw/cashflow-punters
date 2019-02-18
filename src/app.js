const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const { createGameId } = require('./utils/utils');
const { hostGame, provideGameLobby, joinGame, getPlayers, getGame } = require('./gameHandlers');
const {
  renderHomePage,
  getCurrentGame,
  logRequest,
  startGame,
  rollDie
} = require('./handlers.js');

app.games = {};
app.createGameId = createGameId;
app.use(cookieParser());
app.use(logRequest);
app.use(getCurrentGame);
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', renderHomePage);
app.get('/gamelobby', provideGameLobby);
app.post('/hostgame', hostGame);
app.get('/rolldie', rollDie);
app.get('/getgame', getGame);
app.get('/startgame', startGame);
app.post('/joingame', joinGame);
app.use(bodyParser.json());
app.get('/getPlayerProfessions', getPlayers);
app.use(express.static('public/'));
app.use(express.static('public/pages'));
app.use(express.static('public/scripts'));
app.use(express.static('public/stylesheets'));
app.use(express.static('public/images'));

module.exports = app;

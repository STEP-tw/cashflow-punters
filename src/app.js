const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const { createGameId } = require('./utils/utils');
const {
  hostGame,
  provideGameLobby,
  joinGame,
  getPlayers,
  startGame,
  getGame,
  canJoin

} = require('./gameHandlers');
const {
  renderHomePage,
  getCurrentGame,
  logRequest,
  rollDie
} = require('./handlers.js');

app.games = {};
app.createGameId = createGameId;
app.use(logRequest);
app.use(cookieParser());
app.use(getCurrentGame);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', renderHomePage);
app.get('/gamelobby', provideGameLobby);
app.get('/getgame', getGame);
app.get('/rolldie', rollDie);
app.get('/startgame', startGame);
app.get('/getPlayerProfessions', getPlayers);
app.post('/canjoin', canJoin);
app.post('/joingame', joinGame);
app.post('/hostgame', hostGame);
app.use(express.static('public/'));
app.use(express.static('public/pages'));
app.use(express.static('public/scripts'));
app.use(express.static('public/stylesheets'));
app.use(express.static('public/images'));

module.exports = app;

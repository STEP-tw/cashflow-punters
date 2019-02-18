const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const {hostGame, getCurrentGame, renderPlayerNames} = require('./gameHandlers');
const {renderHomePage, logRequest, startGame} = require('./handlers.js');

app.games = {};
app.use(cookieParser());
app.use(logRequest);
app.use(getCurrentGame);
app.use(bodyParser.urlencoded({extended: false}));
app.get('/', renderHomePage);
app.get('/playernames', renderPlayerNames);
app.post('/hostgame', hostGame);
app.use(bodyParser.json());
app.use(express.static('public/pages'));
app.use(express.static('public/scripts'));
app.use(express.static('public/stylesheets'));
app.get('/startgame', startGame);
app.use(express.static('public/images'));

module.exports = app;

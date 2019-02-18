const request = require('supertest');
const {expect} = require('chai');
const app = require('../src/app');
const {hostGame, provideGameLobby, joinGame,getPlayers} = require('../src/gameHandlers');

describe('hostGame', function() {
  it('should redirect to url /waiting.html with statusCode 302', function(done) {
    request(app)
      .post('/hostgame')
      .send('playerName=player')
      .expect(302)
      .expect('Location', '/waiting.html')
      .end(done);
  });
});

describe('hostGame', function() {
  let req, res;

  beforeEach(() => {
    req = {};
    req.body = {playerName: 'player'};
    res = {};
    res['Set-Cookie'] = '';
    res.cookie = function(key, value) {
      res['Set-Cookie'] = res['Set-Cookie'] + `${key}=${value};`;
    };
    res.redirect = function(location) {
      res.Location = location;
    };
    res.app = {};
    res.app.games = {};
    res.app.createGameId = () => 1234;
  });

  it('should create an instantce of gamein app.games', function() {
    hostGame(req, res);
    expect(res)
      .to.have.property('app')
      .to.have.property('games')
      .to.have.property('1234')
      .to.be.an('Object')
      .to.have.property('players')
      .to.be.an('Array')
      .to.deep.equals([{name: 'player', currentSpace: 0}]);
  });
  it('should set cookie as gameId and player name', function() {
    hostGame(req, res);
    expect(res)
      .to.have.property('Set-Cookie')
      .to.equal('gameId=1234;playerName=player;');
  });
  it('should rediect to /waiting.html', function() {
    hostGame(req, res);
    expect(res)
      .to.have.property('Location')
      .to.equal('/waiting.html');
  });
});

describe('provideGameLobby', function() {
  it('should send gameId and playerslist', function() {
    const req = {};
    const res = {};
    req.game = {
      getPlayerNames: () => {
        return ['player1', 'player2'];
      }
    };
    req.cookies = {gameId: '1234'};
    res.send = function(response) {
      res.content = response;
    };

    provideGameLobby(req, res);

    expect(res)
      .to.have.property('content')
      .to.equal('{"players":["player1","player2"],"gameId":"1234"}');
  });
});

describe('joinGame', function() {
  it('should add player in the game of given gameId', function() {
    const req = {};
    const res = {};
    req.body = {gameId: '1234', playerName: 'player'};
    res['Set-Cookie'] = '';
    res.cookie = function(key, value) {
      res['Set-Cookie'] = res['Set-Cookie'] + `${key}=${value};`;
    };
    res.redirect = function(location) {
      res.Location = location;
    };
    res.app = {};
    res.app.games = {
      '1234': {
        players: [],
        addPlayer: function(player) {
          this.players.push(player);
        }
      }
    };
    joinGame(req, res);

    expect(res)
      .to.have.property('app')
      .to.have.property('games')
      .to.have.property('1234')
      .to.have.property('players')
      .to.deep.equals([{name: 'player', currentSpace: 0}]);
  });
});


describe('getgame', function() {
  it('should return game', function(done) {
    request(app)
    .get('/getgame')
    .expect(200)
   .end(done)
  });
});

describe('getgame', function() {
  it('should return game', function() {
    const req = {game:{player:[1,2]}};
    const res = {send:()=>{
      expect(req.game.player).to.eql([1,2])
    }};
    getPlayers(req,res);
  });
});
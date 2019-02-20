const request = require("supertest");
const sinon = require("sinon");
const { expect } = require("chai");
const app = require("../src/app");
const {
  hostGame,
  provideGameLobby,
  getPlayersFinancialStatement,
  joinGame,
  getPlayers,
  canJoin,
  getGame,
  startGame,
  acceptCharity,
  declineCharity
} = require("../src/gameHandlers");

describe("hostGame", function() {
  it("should redirect to url /waiting.html with statusCode 302", function(done) {
    request(app)
      .post("/hostgame")
      .send("playerName=player")
      .expect(302)
      .expect("Location", "/waiting.html")
      .end(done);
  });
});

describe("hostGame", function() {
  let req, res;

  beforeEach(() => {
    req = {};
    req.body = { playerName: "player" };
    res = {};
    res["Set-Cookie"] = "";
    res.cookie = function(key, value) {
      res["Set-Cookie"] = res["Set-Cookie"] + `${key}=${value};`;
    };
    res.redirect = function(location) {
      res.Location = location;
    };
    res.app = {};
    res.app.games = {};
    res.app.createGameId = () => 1234;
  });

  it("should create an instantce of gamein app.games", function() {
    hostGame(req, res);
    expect(res)
      .to.have.property("app")
      .to.have.property("games")
      .to.have.property("1234")
      .to.be.an("Object")
      .to.have.property("players")
      .to.be.an("Array")
      .to.deep.equals([
        {
          childrenCount: 0,
          name: "player",
          didUpdateSpace: false,
          currentSpace: 0,
          passiveIncome: 0
        }
      ]);
  });
  it("should set cookie as gameId and player name", function() {
    hostGame(req, res);
    expect(res)
      .to.have.property("Set-Cookie")
      .to.equal("gameId=1234;playerName=player;");
  });
  it("should rediect to /waiting.html", function() {
    hostGame(req, res);
    expect(res)
      .to.have.property("Location")
      .to.equal("/waiting.html");
  });
});

describe("provideGameLobby", function() {
  it("should send gameId and playerslist", function() {
    const req = {};
    const res = {};
    req.game = {
      getPlayerNames: () => {
        return ["player1", "player2"];
      },
      host: "player1"
    };
    req.cookies = { gameId: "1234", playerName: "player2" };
    res.send = function(response) {
      res.content = response;
    };

    provideGameLobby(req, res);

    expect(res)
      .to.have.property("content")
      .to.equal(
        '{"players":["player1","player2"],"gameId":"1234","isHost":false}'
      );
  });
});

describe("joinGame", function() {
  it("should add player in the game of given gameId", function() {
    const req = {};
    const res = {};
    req.body = { gameId: "1234", playerName: "player" };
    res["Set-Cookie"] = "";
    res.cookie = function(key, value) {
      res["Set-Cookie"] = res["Set-Cookie"] + `${key}=${value};`;
    };
    res.redirect = function(location) {
      res.Location = location;
    };
    res.app = {};
    res.app.games = {
      "1234": {
        players: [],
        addPlayer: function(player) {
          this.players.push(player);
        }
      }
    };
    joinGame(req, res);

    expect(res)
      .to.have.property("app")
      .to.have.property("games")
      .to.have.property("1234")
      .to.have.property("players")
      .to.deep.equals([
        {
          name: "player",
          childrenCount: 0,
          didUpdateSpace: false,
          currentSpace: 0,
          passiveIncome: 0
        }
      ]);
  });
});

describe("canJoin", function() {
  const req = {};
  const res = {};

  beforeEach(() => {
    req.body = { gameId: "1234" };
    res["Set-Cookie"] = "";
    res.cookie = function(key, value) {
      res["Set-Cookie"] = res["Set-Cookie"] + `${key}=${value};`;
    };
    res.redirect = function(location) {
      res.Location = location;
    };
    res.app = {};
    res.app.games = {
      "1234": {
        players: [{ name: "player1" }, { name: "player2" }],
        hasStarted: false,

        isPlaceAvailable: function() {
          return this.players.length < 6;
        }
      }
    };
    res.send = function(response) {
      res.content = response;
    };
  });

  it("should send an object in response with key isGameJoinable as true", function() {
    canJoin(req, res);

    expect(res)
      .to.have.property("content")
      .to.be.deep.equals('{"isGameJoinable":true}');
  });

  it("should send game not found error for non existing game id", function() {
    req.body = { gameId: "456" };
    canJoin(req, res);

    expect(res)
      .to.have.property("content")
      .to.be.deep.equals(
        '{"error":"Sorry! No Game with this Id..","isGameJoinable":false}'
      );
  });

  it("should send No place error if total number of players is 6", function() {
    const players = [
      { name: "player1" },
      { name: "player2" },
      { name: "player3" },
      { name: "player4" },
      { name: "player5" },
      { name: "player6" }
    ];

    res.app.games["1234"].players = players;
    canJoin(req, res);

    expect(res)
      .to.have.property("content")
      .to.be.deep.equals(
        '{"error":"Sorry! No place available in the Game..","isGameJoinable":false}'
      );
  });

  it("should send No place error if total number of players is 6", function() {
    res.app.games["1234"].hasStarted = true;

    canJoin(req, res);

    expect(res)
      .to.have.property("content")
      .to.be.deep.equals(
        '{"error":"Sorry! The Game has already started..","isGameJoinable":false}'
      );
  });
});

describe("getgame", function() {
  const res = {};
  const req = {};
  beforeEach(function() {
    req.game = {
      currentPlayer: {
        name: "tilak"
      }
    };
    req.cookies = {
      playerName: "tilak"
    };
    res.send = function(response) {
      res.content = response;
    };
  });
  it("should return game with isMyTurn true when currentPlayer is request player", function() {
    getGame(req, res);

    expect(req.game.isMyTurn).to.be.true;
  });
  it("should return game with isMyTurn false when currentPlayer is request player", function() {
    req.cookies["playerName"] = "swapnil";
    getGame(req, res);
    expect(req.game.isMyTurn).to.be.false;
  });
});

describe("getPlayers", function() {
  it("should return game", function() {
    const req = {
      game: {
        player: [1, 2]
      }
    };
    const res = {
      send: () => {
        expect(req.game.player).to.eql([1, 2]);
      }
    };
    getPlayers(req, res);
  });
});

describe("startGame", function() {
  it("should redirect to board.html", function() {
    let req = {
      game: {
        hasStarted: false,
        getInitialDetails: () => {}
      }
    };
    let res = {
      end: () => {}
    };
    startGame(req, res);

    expect(req.game)
      .to.have.property("hasStarted")
      .to.be.equal(true);
  });
});

describe("getPlayersFinancialStatement", function() {
  it("should give financial statement of current player", function() {
    let req = {
      cookies: { playerName: "anu" },
      game: { players: [{ name: "anu" }] }
    };

    let res = {
      send: player => {
        expect(player).that.eql('{"name":"anu"}');
      }
    };
    getPlayersFinancialStatement(req, res);
  });
});

describe("acceptCharity", function() {
  let req, res;
  beforeEach(() => {
    req = {
      game: {
        currentPlayer: { gotCharitySpace: true, charityTurns: 0 },
        nextPlayer: sinon.spy()
      }
    };
    res = { end: sinon.spy() };
  });
  it("should add charity turns to currentPlayer", function() {
    acceptCharity(req, res);
    expect(req.game.currentPlayer.charityTurns).equal(3);
  });

  it("should not add charity turns to currentPlayer when currentPlayer doesnt get charity space", function() {
    req.game.currentPlayer.gotCharitySpace = false;
    acceptCharity(req, res);
    expect(req.game.currentPlayer.charityTurns).equal(0);
  });
});

describe("declineCharity", function() {
  it("should add charity turns to currentPlayer", function() {});
  const req = {
    game: {
      nextPlayer: sinon.spy()
    }
  };
  const res = { end: sinon.spy() };
  declineCharity(req, res);
  expect(req.game.nextPlayer.calledOnce).to.be.true;
});

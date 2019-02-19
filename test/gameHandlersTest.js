const request = require("supertest");
const {expect} = require("chai");
const app = require("../src/app");
const {
  hostGame,
  provideGameLobby,
  joinGame,
  getPlayers,
  canJoin
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
    req.body = {playerName: "player"};
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
        {name: "player", didUpdateSpace: false, currentSpace: 0}
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
    req.cookies = {gameId: "1234", playerName: "player2"};
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
    req.body = {gameId: "1234", playerName: "player"};
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
        {name: "player", didUpdateSpace: false, currentSpace: 0}
      ]);
  });
});

describe("canJoin", function() {
  it("should send an object in response if the place is available and is game started", function() {
    const req = {};
    const res = {};
    req.body = {gameId: "1234"};
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
        players: [{name: "player1"}, {name: "player2"}],
        hasStarted: false,

        isPlaceAvailable: function() {
          return this.players.length < 6;
        }
      }
    };
    res.send = function(response) {
      res.content = response;
    };
    canJoin(req, res);

    expect(res)
      .to.have.property("content")
      .to.be.deep.equals('{"hasStarted":false,"isPlaceAvailable":true}');
  });
});

describe("getgame", function() {
  beforeEach(function() {
    req = {
      game: {
        currentPlayer: {
          name: "tilak"
        }
      },
      cookies: {
        playerName: "tilak"
      }
    };
    it("should return game", function(done) {
      request(app)
        .get("/getgame")
        .expect(200)
        .end(done);
    });
    it("should return game with isMyTurn true when currentPlayer is request player", function() {
      getPlayers(req, res);
      expect(req.game.isMyTurn).to.be.true;
    });
    it("should return game with isMyTurn false when currentPlayer is request player", function() {
      req.cookies["playerName"] = "swapnil";
      getPlayers(req, res);
      expect(req.game.isMyTurn).to.be.false;
    });
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

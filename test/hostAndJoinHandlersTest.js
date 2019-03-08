const request = require("supertest");
const { expect } = require("chai");
const app = require("../src/app");

const {
  joinGame,
  canJoin,
  hostGame,
  provideGameLobby
} = require("../src/hostAndJoinHandlers");

describe("hostGame", function () {
  it("should redirect to url /waiting.html with statusCode 302", function (done) {
    request(app)
      .post("/hostgame")
      .send("playerName=player")
      .expect(302)
      .expect("Location", "/waiting.html")
      .end(done);
  });
});

describe("hostGame", function () {
  let req, res;

  beforeEach(() => {
    req = {};
    req.body = { playerName: "player" };
    res = {};
    res["Set-Cookie"] = "";
    res.cookie = function (key, value) {
      res["Set-Cookie"] = res["Set-Cookie"] + `${key}=${value};`;
    };
    res.redirect = function (location) {
      res.Location = location;
    };
    res.app = {};
    res.app.games = {};
    res.app.createGameId = () => 1234;
  });

  it("should create an instantce of gamein app.games", function () {
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
          MLMTurns: 0,
          MLMCardsCount: 0,
          bankrupt: false,
          bankruptcy: false,
          charityTurns: 0,
          notifyEscape: false,
          notification: "",
          MLMProfit: 0,
          childrenCount: 0,
          isTurnComplete: true,
          dice: {
            diceValues: []
          },
          notification: "Welcome to CashFlow",
          downSizedForTurns: 0,
          name: "player",
          hasMLM: false,
          entries: [],
          hasMLM: false,
          didUpdateSpace: false,
          currentSpace: 0,
          passiveIncome: 0,
          bankrupted: false,
          turn: 1
        }
      ]);
  });
  it("should set cookie as gameId and player name", function () {
    hostGame(req, res);
    expect(res)
      .to.have.property("Set-Cookie")
      .to.equal("gameId=1234;playerName=player;");
  });
  it("should rediect to /waiting.html", function () {
    hostGame(req, res);
    expect(res)
      .to.have.property("Location")
      .to.equal("/waiting.html");
  });
});

describe("provideGameLobby", function () {
  it("should send gameId and playerslist", function () {
    const req = {};
    const res = {};
    req.game = {
      getPlayerNames: () => {
        return ["player1", "player2"];
      },
      host: "player1"
    };
    req.cookies = { gameId: "1234", playerName: "player2" };
    res.send = function (response) {
      res.content = response;
    };

    provideGameLobby(req, res);

    expect(res)
      .to.have.property("content")
      .to.equal(
        '{"players":["player1","player2"],"gameId":"1234","isHost":false,"isGamePresent":true}'
      );
  });
});

describe("joinGame", function () {
  it("should add player in the game of given gameId", function () {
    const req = {};
    const res = {};
    req.body = { gameId: "1234", playerName: "player", action: "join" };
    res["Set-Cookie"] = "";
    res.cookie = function (key, value) {
      res["Set-Cookie"] = res["Set-Cookie"] + `${key}=${value};`;
    };
    res.json = function (content) {
      this.content = content;
    }
    res.redirect = function (location) {
      res.Location = location;
    };
    res.app = {};
    res.app.savedGames = {};
    res.app.games = {
      "1234": {
        players: [],
        addPlayer: function (player) {
          this.players.push(player);
        },
        isPlaceAvailable: () => true,
        incJoinedPlayerCount: () => { }
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
          MLMCardsCount: 0,
          bankrupt: false,
          MLMTurns: 0,
          bankruptcy: false,
          charityTurns: 0,
          notifyEscape: false,
          MLMProfit: 0,
          notification: "",
          MLMProfit: 0,
          name: "player",
          dice: {
            diceValues: []
          },
          isTurnComplete: true,
          charityTurns: 0,
          downSizedForTurns: 0,
          hasMLM: false,
          isTurnComplete: true,
          entries: [],
          childrenCount: 0,
          hasMLM: false,
          didUpdateSpace: false,
          currentSpace: 0,
          passiveIncome: 0,
          bankrupted: false
        }
      ]);
  });
});

describe("canJoin", function () {
  const req = {};
  const res = {};

  beforeEach(() => {
    req.body = { gameId: "1234" };
    res["Set-Cookie"] = "";
    res.cookie = function (key, value) {
      res["Set-Cookie"] = res["Set-Cookie"] + `${key}=${value};`;
    };
    res.json = function (content) {
      this.content = content;
    }
    res.redirect = function (location) {
      res.Location = location;
    };
    res.app = {};
    res.app.savedGames = {};
    res.app.games = {
      "1234": {
        players: [],
        addPlayer: function (player) {
          this.players.push(player);
        },
        isPlaceAvailable: function () {
          return this.players.length < 6;
        },
        incJoinedPlayerCount: () => { }
      }
    };
    
  });

  it("should send an object in response with key isGameJoinable as true", function () {
    expect(canJoin(req, res))
      .to.be.deep.equals({isAble:true});
  });

  it("should send game not found error for non existing game id", function () {
    req.body = { gameId: "456" };

    expect(canJoin(req, res))
      .to.be.deep.equals(
        {error:"Sorry! No Game with this Id..",isAble:false}
      );
  });

  it("should send No place error if total number of players is 6", function () {
    const players = [
      { name: "player1" },
      { name: "player2" },
      { name: "player3" },
      { name: "player4" },
      { name: "player5" },
      { name: "player6" }
    ];

    res.app.games["1234"].players = players;
    expect(canJoin(req, res))
      .to.be.deep.equals(
        {error:"Sorry! No place available in the Game..",isAble:false}
      );
  });

  it("should send No place error if total number of players is 6", function () {
    res.app.games["1234"].hasStarted = true;
    expect(canJoin(req, res))
      .to.be.deep.equals(
        {error:"Sorry! The Game has already started..",isAble:false}
      );
  });
});

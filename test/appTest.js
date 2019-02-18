const request = require("supertest");
const app = require("../src/app.js");

describe("/", () => {
  it("should start game if at least 2 players are present", done => {
    request(app)
      .get("/")
      .expect(302)
      .expect("Location", "/homepage.html")
      .end(done);
  });
});

describe("startGame", () => {
  it("should start game if at least 2 players are present", done => {
    request(app)
      .get("/startgame")
      .expect(302)
      .expect("Location", "/board.html")
      .end(done);
  });
});

const request = require('supertest');
const app = require('../src/app');

describe('hostGame', function() {
  it('should redirect to url /waiting.html with statusCode 302', function(done) {
    request(app)
      .post('/hostgame')
      .send('playerName=player')
      .expect(302)
      .expect('Set-Cookie', 'gameId=game; Path=/,playerName=player; Path=/')
      .expect('Location', '/waiting.html')
      .end(done);
  });
});

describe('renderPlayerNames', function() {
  it('should send list of player names as response with statusCode 200', function(done) {
    request(app)
      .get('/playernames')
      .set('Cookie', 'gameId=game;playerName=player')
      .expect(200)
      .end(done);
  });
});

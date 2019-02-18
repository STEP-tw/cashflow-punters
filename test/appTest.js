const request = require('supertest');
const app = require('../src/app.js');

describe('/', () => {
  it('should render homepage.html when requested for GET / ', done => {
    request(app)
      .get('/')
      .expect(302)
      .expect('Location', '/homepage.html')
      .end(done);
  });
});

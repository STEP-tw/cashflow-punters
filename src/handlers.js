const renderHomePage = function (req, res) {
  res.redirect('/homepage.html');
};

const logRequest = function (req, res, next) {
  console.log('URL --> ', req.url);
  console.log('Method  --> ', req.method);
  next();
};

const startGame = function (req, res) {
  req.game.getInitialDetails();
  res.redirect('/board.html');
};

module.exports = { renderHomePage, logRequest, startGame };

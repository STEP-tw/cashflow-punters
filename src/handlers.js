const renderHomePage = function(req, res) {
  if (req.game) {
    res.redirect("board.html");
    return;
  }
  res.redirect("/homepage.html");
};

const getCurrentGame = function(req, res, next) {
  const { gameId } = req.cookies;
  req.game = res.app.games[gameId];
  req.fs = res.app.fs;
  next();
};

const logRequest = function(req, res, next) {
  console.log("URL --> ", req.url);
  console.log("Method  --> ", req.method);
  next();
};

module.exports = {
  renderHomePage,
  logRequest,
  getCurrentGame
};

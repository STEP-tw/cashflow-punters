const renderHomePage = function(req, res) {
  res.redirect('/homepage.html');
};

const logRequest = function(req, res, next) {
  console.log('URL --> ', req.url);
  console.log('Method  --> ', req.method);
  next();
};

module.exports = {renderHomePage, logRequest};

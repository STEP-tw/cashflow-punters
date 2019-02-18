const express = require("express");
const app = express();
const { renderHomePage, logRequest, startGame } = require("./handlers.js");

app.use(logRequest);
app.get("/", renderHomePage);
app.get("/startgame", startGame);
app.use(express.static("public/pages"));
app.use(express.static("public/scripts"));
app.use(express.static("public/stylesheets"));
app.use(express.static("public/images"));
module.exports = app;

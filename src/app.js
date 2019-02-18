const express = require('express');
const app = express();
const {renderHomePage, logRequest} = require('./handlers.js');

app.use(logRequest);
app.get('/', renderHomePage);
app.use(express.static('public/pages'));
app.use(express.static('public/scripts'));
app.use(express.static('public/stylesheets'));
module.exports = app;

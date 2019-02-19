const http = require("http");
const app = require("./src/app.js");

const server = http.createServer(app);
const PORT = process.env.PORT || 8080;
server.listen(PORT);

console.log("Server listening at port ", PORT);

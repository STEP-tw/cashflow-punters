const isChangeInLobby = function({ players }) {
  const playersInLobby = document.getElementsByTagName("li");
  let playerNo = 0;
  return players.every(({ name }) => {
    return (
      players.length != playersInLobby.length ||
      name != playersInLobby[playerNo++].innerText
    );
  });
};

const displayLobby = function(gameDetails) {
  if (isChangeInLobby(gameDetails)) {
    const gameIdSpace = getElementById("gameId");
    const playerList = getElementById("playersList");
    const playernamesHtml = getPlayerNamesHtml(gameDetails.players);
    gameIdSpace.innerText = gameDetails.gameId;
    appendChildren(playerList, playernamesHtml);
  }
  return gameDetails;
};

const goToGame = function(gameDetails) {
  if (gameDetails.hasStarted) window.location.href = "/board.html";
  return gameDetails;
};

const convertToListElement = function(text) {
  const listElement = createElement("li");
  listElement.innerText = text;
  return listElement;
};

const getPlayerNamesHtml = function(players) {
  return players.map(convertToListElement);
};

const startNewGame = function() {
  event.target.onclick = null;
  fetch("/startGame");
};

const checkPlayersCount = function({ players, isHost }) {
  const buttonSpace = getElementById("start_button_space");
  buttonSpace.innerHTML = "";
  if (players.length >= 2 && isHost) {
    const startButton = createButton("Start Game", "button", "", "button");
    startButton.onclick = startNewGame;
    appendChildren(buttonSpace, [startButton]);
  }
};

const leaveGame = function() {
  fetch("/leavegame").then(res => {
    window.location = "/";
  });
};

const cancelGame = function() {
  fetch("/cancelgame");
};

const insertButtons = function({ isHost }) {
  const buttonsSpace = getElementById("buttons_space");
  let button = createButton("Leave Game", "button", "", "button", leaveGame);
  if (isHost) {
    button = createButton("Cancel Game", "button", "", "button", cancelGame);
  }
  buttonsSpace.appendChild(button);
};

const isGamePresent = function(game) {
  if (!game.isGamePresent) {
    window.location = "/";
  }
  return game;
};

window.onload = () => {
  fetch("/gamelobby")
    .then(res => res.json())
    .then(displayLobby)
    .then(goToGame)
    .then(insertButtons);

  setInterval(() => {
    fetch("/gamelobby")
      .then(res => res.json())
      .then(isGamePresent)
      .then(displayLobby)
      .then(goToGame)
      .then(checkPlayersCount);
  }, 1000);
};

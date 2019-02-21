const displayLobby = function(gameDetails) {
  const gameIdSpace = getElementById("gameId");
  const playerList = getElementById("playersList");
  const playernamesHtml = getPlayerNamesHtml(gameDetails.players);
  gameIdSpace.innerText = gameDetails.gameId;
  appendChildren(playerList, playernamesHtml);
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
  if (players.length >= 1 && isHost) {
    const buttonSpace = getElementById("start_button_space");
    const startButton = createButton("Start Game", "button", "button");
    startButton.onclick = startNewGame;
    appendChildren(buttonSpace, [startButton]);
  }
};

const insertButtons = function({ isHost }) {
  const buttonsSpace = getElementById("buttons_space");
  let button = createButton("Leave Game", "button", "button");
  if (isHost) {
    button = createButton("Cancel Game", "button", "button");
  }
  buttonsSpace.appendChild(button);
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
      .then(displayLobby)
      .then(goToGame)
      .then(checkPlayersCount);
  }, 1000);
};

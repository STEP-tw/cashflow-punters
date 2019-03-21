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

const goToGame = function(checkStartGame, gameDetails) {
  if (gameDetails.hasStarted) {
    let waitingSecs = 5;
    const waitingGif = document.getElementsByClassName("waiting-gif")[0];
    const starting = createElement("div");
    starting.innerText = "Starting Game in " + waitingSecs + " seconds";
    starting.className = "starting-msg";
    const main = getElementById("waiting-main");
    main.replaceChild(starting, waitingGif);
    clearInterval(checkStartGame);
    setInterval(() => {
      waitingSecs--;
      starting.innerText = "Starting Game in " + waitingSecs + " seconds";
      if (waitingSecs <= 0) {
        window.location.href = "/board.html";
      }
    }, 1000);
  }
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

const leaveGame = function() {
  fetch("/leavegame").then(res => {
    window.location = "/";
  });
};

const cancelGame = function() {
  fetch("/cancelgame").then(res => {
    goToHome();
  });
};

const openCancelGame = function() {
  openOverlay("cancel-game");
};

const insertButtons = function({ isHost }) {
  const buttonsSpace = getElementById("buttons_space");
  let button = createButton("Leave Game", "button", "", "button", leaveGame);
  if (isHost) {
    button = createButton(
      "Cancel Game",
      "button",
      "",
      "button",
      openCancelGame
    );
  }
  buttonsSpace.appendChild(button);
};

const goToHome = function() {
  window.location = "/";
};

const isGamePresent = function(game) {
  if (!game.isGamePresent) {
    openOverlay("notify-cancel-game");
    return game;
  }
  return game;
};

window.onload = () => {
  fetch("/gamelobby")
    .then(res => res.json())
    .then(displayLobby)
    .then(goToGame.bind(null, undefined))
    .then(insertButtons);

  const checkStartGame = setInterval(() => {
    fetch("/gamelobby")
      .then(res => res.json())
      .then(isGamePresent)
      .then(displayLobby)
      .then(goToGame.bind(null, checkStartGame));
  }, 1000);
};

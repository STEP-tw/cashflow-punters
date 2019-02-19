const displayLobby = function(gameDetails) {
  const gameIdSpace = document.getElementById('gameId');
  gameIdSpace.innerText = gameDetails.gameId;
  const playerList = document.getElementById('playersList');
  const playernamesHtml = getPlayerNamesHtml(gameDetails.players);
  appendChildren(playerList, playernamesHtml);
};

const getPlayerNamesHtml = function(players) {
  return players.map(playerName => {
    const listElement = document.createElement('li');
    listElement.innerText = playerName;
    return listElement;
  });
};

const checkPlayersCount = function({players, isHost}) {
  if (players.length >= 2 && isHost) {
    const buttonSpace = document.getElementById('start_button_space');
    const startButton = createButton('Start Game', 'button', 'button');
    appendChildren(buttonSpace, [startButton]);
  }
};

const insertButtons = function({isHost}) {
  const buttonsSpace = document.getElementById('buttons_space');
  let button = createButton('Leave Game', 'button', 'button');
  if (isHost) {
    button = createButton('Cancel Game', 'button', 'button');
  }
  buttonsSpace.appendChild(button);
};

window.onload = () => {
  fetch('/gamelobby')
    .then(res => res.json())
    .then(gameDetails => {
      insertButtons(gameDetails);
      return gameDetails;
    });

  setInterval(() => {
    fetch('/gamelobby')
      .then(res => res.json())
      .then(gameDetails => {
        displayLobby(gameDetails);
        return gameDetails;
      })
      .then(gameDetails => checkPlayersCount(gameDetails));
  }, 1000);
};

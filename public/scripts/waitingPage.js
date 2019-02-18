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

window.onload = () => {
  setInterval(() => {
    fetch('/gamelobby')
      .then(res => res.json())
      .then(displayLobby);
  }, 1000);
};

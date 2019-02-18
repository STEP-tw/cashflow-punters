const displayNames = function(gameDetails) {
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

const appendChildren = function(parentElement, childrenElements) {
  parentElement.innerHTML = '';
  childrenElements.forEach(function(child) {
    parentElement.appendChild(child);
  });
};

window.onload = () => {
  setInterval(() => {
    fetch('/playernames')
      .then(res => res.json())
      .then(displayNames);
  }, 1000);
};

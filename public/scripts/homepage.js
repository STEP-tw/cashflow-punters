const displayHostTemplate = function() {
  const optionsField = document.getElementById('gameOptionsField');
  const hostingForm = createForm('/hostgame', 'POST');
  const nameInput = createInput('playerName', 'Enter Name', 'text');
  const hostButton = createButton('HOST', 'game-options', 'submit');
  appendChildren(optionsField, [hostingForm]);
  appendChildren(hostingForm, [nameInput, hostButton]);
};

const displayJoinTemplate = function() {
  const optionsField = document.getElementById('gameOptionsField');
  const joiningForm = createForm('/joingame', 'POST');
  const gameIdInput = createInput('gameId', 'Enter GameID', 'text');
  const nameInput = createInput('playerName', 'Enter Name', 'text');
  const joinButton = createButton('JOIN', 'game-options', 'submit');
  appendChildren(optionsField, [joiningForm]);
  appendChildren(joiningForm, [nameInput, gameIdInput, joinButton]);
};

window.onload = () => {
  const hostGameButton = document.getElementById('hostGame');
  hostGameButton.onclick = displayHostTemplate;
  const joinGameButton = document.getElementById('joinGame');
  joinGameButton.onclick = displayJoinTemplate;
};

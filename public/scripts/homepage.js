const displayHostTemplate = function() {
  const optionsField = document.getElementById("gameOptionsField");
  const hostingForm = createForm("/hostgame", "POST");
  const nameInput = createInput("playerName", "Enter Name", "text");
  const hostButton = createButton("HOST", "game-options", "submit");
  appendChildren(optionsField, [hostingForm]);
  appendChildren(hostingForm, [nameInput, hostButton]);
};

const joinGame = function() {
  const gameId = document.getElementById("game_id").value;
  const playerName = document.getElementById("name").value;
  fetch("/joingame", {
    method: "POST",
    body: JSON.stringify({gameId, playerName}),
    headers: {"Content-Type": "application/json"}
  }).then(res => {
    if (res.redirected) {
      window.location.href = res.url;
    }
  });
};

const displayError = function(error) {
  const messageDiv = document.createElement("div");
  const optionsField = document.getElementById("gameOptionsField");
  messageDiv.innerText = error;
  optionsField.appendChild(messageDiv);
};

const canJoin = function() {
  const gameId = document.getElementById("game_id").value;
  fetch("/canjoin", {
    method: "POST",
    body: JSON.stringify({gameId}),
    headers: {"Content-Type": "application/json"}
  })
    .then(res => res.json())
    .then(({isGameJoinable, error}) => {
      if (isGameJoinable) {
        joinGame();
        return;
      }
      displayError(error);
    });
};

const displayJoinTemplate = function() {
  const optionsField = document.getElementById("gameOptionsField");
  const gameIdInput = createInput("gameId", "Enter GameID", "text", "game_id");
  const nameInput = createInput("playerName", "Enter Name", "text", "name");
  const joinButton = createButton("JOIN", "game-options", "submit");
  joinButton.onclick = canJoin;
  appendChildren(optionsField, [nameInput, gameIdInput, joinButton]);
};

window.onload = () => {
  const hostGameButton = document.getElementById("hostGame");
  hostGameButton.onclick = displayHostTemplate;
  const joinGameButton = document.getElementById("joinGame");
  joinGameButton.onclick = displayJoinTemplate;
};

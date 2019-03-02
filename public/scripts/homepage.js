const displayHostTemplate = function() {
  const optionsField = getElementById("gameOptionsField");
  const hostingForm = createForm("/hostgame", "POST", "host-join-form");
  const nameInput = createInput("playerName", "Enter Name", "text", "none", "textField");
  nameInput.required = true;
  const hostButton = createButton("HOST", "button");
  appendChildren(optionsField, [hostingForm]);
  appendChildren(hostingForm, [nameInput, hostButton]);
};

const joinGame = function() {
  const gameId = getElementById("game_id").value;
  const playerName = getElementById("name").value;
  fetch("/joingame", {
    method: "POST",
    body: JSON.stringify({ gameId, playerName }),
    headers: { "Content-Type": "application/json" }
  }).then(res => {
    if (res.redirected) {
      window.location.href = res.url;
    }
  });
};

const displayError = function(error) {
  const messageDiv = getElementById("messageDiv");
  messageDiv.innerText = error;
};

const isInvalidCredentials = function() {
  const gameId = getElementById("game_id").value;
  const playerName = getElementById("name").value;
  return !gameId || !playerName;
};

const canJoin = function() {
  const gameId = getElementById("game_id").value;
  if (isInvalidCredentials()) {
    const error = "Invalid GameId or Player Name";
    return displayError(error);
  }
  fetch("/canjoin", {
    method: "POST",
    body: JSON.stringify({ gameId }),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(({ isGameJoinable, error }) => {
      if (isGameJoinable) return joinGame();
      displayError(error);
    });
};

const displayJoinTemplate = function() {
	const optionsField = document.getElementById("gameOptionsField");
	const joinForm = createElement('div');
	joinForm.className = "host-join-form";
  const gameIdInput = createInput("gameId", "Enter GameID", "text" ,"game_id", "textField");
  const nameInput = createInput("playerName", "Enter Name", "text", "name", "textField");
  const joinButton = createButton("JOIN", "button");
  const messageDiv = createElement("div");
	messageDiv.id = "messageDiv";
	// optionsField.className = "host-join-form";
  joinButton.onclick = canJoin;
  appendChildren(joinForm, [
    nameInput,
    gameIdInput,
    joinButton,
    messageDiv
	]);
	appendChildren(optionsField, [joinForm]);
};

window.onload = () => {
  const hostGameButton = getElementById("hostGame");
  const joinGameButton = getElementById("joinGame");
  hostGameButton.onclick = displayHostTemplate;
  joinGameButton.onclick = displayJoinTemplate;
};

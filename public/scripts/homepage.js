const displayHostTemplate = function () {
  const optionsField = getElementById("gameOptionsField");
  const hostingForm = createForm("/hostgame", "POST", "host-join-form");
  const nameInput = createInput("playerName", "Enter Name", "text", "none", "textField");
  nameInput.required = true;
  const hostButton = createButton("HOST", "button");
  appendChildren(optionsField, [hostingForm]);
  appendChildren(hostingForm, [nameInput, hostButton]);
};

const displayError = function (error) {
  const messageDiv = getElementById("messageDiv");
  messageDiv.innerText = error;
};

const isInvalidCredentials = function () {
  const gameId = getElementById("game_id").value;
  const playerName = getElementById("name").value;
  return !gameId || !playerName;
};

const joinOrLoad = function (action) {
  const gameId = getElementById("game_id").value;
  const playerName = getElementById("name").value;
  if (isInvalidCredentials()) {
    const error = "Invalid GameId or Player Name";
    return displayError(error);
  }
  fetch("/joingame", {
    method: "POST",
    body: JSON.stringify({ gameId, playerName, action }),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(({ isAble, error, url }) => {
      if (!isAble) return displayError(error);
      window.location.href = url;
    });
};

const displayJoinTemplate = function (actionName, handler) {
  const optionsField = document.getElementById("gameOptionsField");
  const joinForm = createElement('div');
  joinForm.className = "host-join-form";
  const gameIdInput = createInput("gameId", "Enter GameID", "text", "game_id", "textField");
  const nameInput = createInput("playerName", "Enter Name", "text", "name", "textField");
  const joinButton = createButton(actionName, "button", "", "", handler);
  const messageDiv = createElement("div");
  messageDiv.id = "messageDiv";
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
  const loadGameButton = getElementById("loadGame");
  hostGameButton.onclick = displayHostTemplate;
  const joinHandler = joinOrLoad.bind(null, "join");
  const loadHandler = joinOrLoad.bind(null, "load");
  joinGameButton.onclick = displayJoinTemplate.bind(null, "JOIN", joinHandler);
  loadGameButton.onclick = displayJoinTemplate.bind(null, "LOAD", loadHandler);
};

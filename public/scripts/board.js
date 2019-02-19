const closeOverlay = function (id) {
  let overlay = document.getElementById(id);
  overlay.style.visibility = "hidden";
};

const openFinancialStatement = function () {
  let fs = document.getElementById("financial_statement");
  fs.style.visibility = "visible";
};

const getName = function() {
  return document.cookie.split(";")[0].split("=")[1];
}

const openCashLedger = function () {
  let fs = document.getElementById("cash_ledger");
  fs.style.visibility = "visible";
};

const getBoard = function () {
  let container = document.getElementById("container");
  let parent = container.parentElement;
  parent.removeChild(container);
};

const isMyName = function (player) {
  return player.name == getName();
}

const getExpense = function (expenses) {
  let values = Object.values(expenses);
  return values;
}

const createFinancialStatement = function () {
  const rightSection = document.createElement("section");
  rightSection.className = "popup";
  let fs = document.getElementById("financial_statement");
  rightSection.innerHTML = fs.innerHTML;
  return rightSection;
};

const createCashLedger = function () {
  const leftSection = document.createElement("section");
  leftSection.className = "popup";
  let cl = document.getElementById("cash_ledger");
  leftSection.innerHTML = cl.innerHTML;
  return leftSection;
}

const getFinancialStatement = function () {
  let container = document.getElementById("container");
  container.innerHTML = "";
  const rightSection = createFinancialStatement();
  const leftSection = createCashLedger();
  let button = createPopupButton("continue", getBoard);
  let top = document.createElement('div');
  top.className = "statements";
  appendChildren(top, [leftSection, rightSection])
  appendChildren(container, [top, button]);
};

const displayFinancialStatement = function () {
  getFinancialStatement();
};

const gamePiece = {
  1: "player1",
  2: "player2",
  3: "player3",
  4: "player4",
  5: "player5",
  6: "player6"
}

const getProfessionsDiv = function (player) {
  let { name, profession, turn } = player;
  let mainDiv = createDivWithClass("details");
  let container = document.getElementById('container');
  let playerName = createDiv(`Name : ${name}`);
  let playerProfession = createDiv(`Profession : ${profession.profession}`);
  let playerTurn = createDiv(`Turn : ${turn}`);
  let playerGamePiece = createDivWithClass(gamePiece[turn]);
  appendChildren(mainDiv, [playerName, playerProfession, playerTurn, playerGamePiece]);
  container.appendChild(mainDiv)
};

const getProfessions = function () {
  fetch('/getgame').then((data) => {
    return data.json();
  }).then((content) => {
    let players = content.players;
    let container = document.getElementById("container");
    players.map(getProfessionsDiv).join("");
    let button = createPopupButton("continue", displayFinancialStatement);
    container.appendChild(button);
  })
};

const enableDice = function (diceId) {
  const dice = document.getElementById(diceId);
  dice.hidden = false;
  dice.onclick = rollDie;
};

const activateDice = function (currentPlayer) {
  enableDice("dice1");
  if (currentPlayer.hasCharityTurn) {
    let askNumOfDice = document.getElementById("num_of_dices");
    askNumOfDice.style.visibility = "visible";
  }
};

const rollDie = function () {
  const dice = document.getElementById(event.target.id);
  dice.onclick = null;
  fetch("/rolldie")
    .then(res => res.text())
    .then(number => {
      dice.innerText = number;
    });
};

const polling = function(game) {
  let { currentPlayer, isMyTurn, players } = game;
  if (isMyTurn && currentPlayer.haveToActivateDice) {
    activateDice(currentPlayer);
  }
  players.forEach(updateGamePiece);
};

const updateGamePiece = function(player) {
  if (!player.didUpdateSpace) {
    return;
  }
  let gamePiece = document.getElementById("gamePiece" + player.turn);
  gamePiece.classList.add("visible");
  let space = gamePiece.parentNode;
  let newSpace = document.getElementById(player.currentSpace);
  space.removeChild(gamePiece);
  newSpace.appendChild(gamePiece);
};

const updateActivtyLog = function(activityLog) {
  const activityLogDiv = document.getElementById("activityLog");
  activityLogDiv.innerHTML = "";
  activityLog.forEach(function({ playerName, msg }) {
    const activity = document.createElement("p");
    activity.classList.add("activity");
    activity.innerText = playerName + msg;
    activityLogDiv.appendChild(activity);
  });
};

const getGame = function() {
  fetch("/getgame")
    .then(data => data.json())
    .then(game => {
      updateActivtyLog(game.activityLog);
      polling(game);
    });
};

const initialize = function () {
  setInterval(getGame, 1000);
  setTimeout(getProfessions, 1500);
  let dice2 = document.getElementById("dice2");
  dice2.hidden = true;
};

window.onload = initialize;

const closeOverlay = function(id) {
  let overlay = document.getElementById(id);
  overlay.style.visibility = "hidden";
};

const openFinancialStatement = function() {
  let fs = document.getElementById("financial_statement");
  fs.style.visibility = "visible";
};

const getName = function() {
  return document.cookie.split(";")[0].split("=")[1];
};

const openCashLedger = function() {
  let fs = document.getElementById("cash_ledger");
  fs.style.visibility = "visible";
};

const getBoard = function() {
  let container = document.getElementById("container");
  let parent = container.parentElement;
  parent.removeChild(container);
};


const updateStatementBoard = function (fsContent) {
  setInnerHTML('name', fsContent.name);
  setInnerHTML('Profession', fsContent.profession.profession);
  setInnerHTML('passiveIn', fsContent.passiveIncome);
  setInnerHTML('totalIn', fsContent.totalIncome);
  setInnerHTML('expenses', fsContent.totalExpense);
  setInnerHTML('cashflow', fsContent.cashflow);
  setInnerHTML('income', fsContent.profession.income.salary);
  setInnerHTML('LedgerBal',fsContent.cashLedger);
}

const setFinancialStatement = function (fsContent) {
  setInnerHTML('player_salary', fsContent.profession.income.salary);
  setInnerHTML('player_passiveIn', fsContent.passiveIncome);
  setInnerHTML('player_totalIn', fsContent.totalIncome);
  setInnerHTML('player_expenses', fsContent.totalExpense);
  setInnerHTML('player_cashflow', fsContent.cashflow);
  setInnerHTML('player_name', `Name : ${fsContent.name}`);
  setInnerHTML('player_profession', `Profession : ${fsContent.profession.profession}`);
  setInnerHTML('player_liabilities', `Liabilities :` + createParagraph(fsContent.profession.liabilities));
  setInnerHTML('player_expense', `Expense :` + createParagraph(fsContent.profession.expenses));
  setInnerHTML('player_income', `Income :` + createParagraph(fsContent.profession.income));
  setInnerHTML('player_assets', `assets :` + createParagraph(fsContent.profession.assets));
  updateStatementBoard(fsContent);
}

const createFinancialStatement = function () {
  const container = document.getElementById("container");
  container.innerHTML = "";
  const top = document.createElement("div");
  const leftSection = document.createElement("section");
  leftSection.className = "popup";
  top.className = "statements";
  fetch('/financialStatement').then(data => data.json()).then(fsContent => {
    setFinancialStatement(fsContent);
    const button = createPopupButton("continue", getBoard);
    const fs = document.getElementById("financial_statement");
    top.innerHTML = fs.innerHTML;
    leftSection.appendChild(top);
    appendChildren(container, [leftSection, button]);
  });
};

const gamePiece = {
  1: "player1",
  2: "player2",
  3: "player3",
  4: "player4",
  5: "player5",
  6: "player6"
};

const getProfessionsDiv = function(player) {
  let { name, profession, turn } = player;
  let mainDiv = createDivWithClass("details");
  let container = document.getElementById("container");
  let playerName = createDiv(`Name : ${name}`);
  let playerProfession = createDiv(`Profession : ${profession.profession}`);
  let playerTurn = createDiv(`Turn : ${turn}`);
  let playerGamePiece = createDivWithClass(gamePiece[turn]);
  appendChildren(mainDiv, [
    playerName,
    playerProfession,
    playerTurn,
    playerGamePiece
  ]);
  container.appendChild(mainDiv);
};

const getProfessions = function() {
  fetch("/getgame")
    .then(data => {
      return data.json();
    })
    .then(content => {
      let players = content.players;
      let container = document.getElementById("container");
      players.map(getProfessionsDiv).join("");
      let button = createPopupButton("continue", createFinancialStatement);
      container.appendChild(button);
    });
};

const enableDice = function(diceId) {
  const dice = document.getElementById(diceId);
  dice.hidden = false;
  dice.onclick = rollDie;
};

const activateDice = function(currentPlayer) {
  enableDice("dice1");
  if (currentPlayer.hasCharityTurn) {
    let askNumOfDice = document.getElementById("num_of_dices");
    askNumOfDice.style.visibility = "visible";
  }
};

const createTextDiv = function(text) {
  const textDiv = document.createElement("div");
  const textPara = document.createElement("p");
  textPara.innerText = text;
  textDiv.appendChild(textPara);
  return textDiv;
};

const showPlainCard = function(cardData) {
  const cardDisplay = document.getElementById("cardDisplay");
  cardDisplay.innerHTML = null;
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("plain-card");
  const titleDiv = createTextDiv(cardData.title);
  titleDiv.classList.add("card-title");
  const expenseDiv = createTextDiv("$ " + cardData.expenseAmount);
  titleDiv.classList.add("card-expense");
  cardDiv.appendChild(titleDiv);
  cardDiv.appendChild(expenseDiv);
  cardDisplay.appendChild(cardDiv);
};

const showCard = function(card) {
  const cardHandlers = {
    doodad: showPlainCard
  };
  cardHandlers[card.type](card.data);
};

const rollDie = function() {
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
  if (game.activeCard) {
    showCard(game.activeCard);
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

const initialize = function() {
  setInterval(getGame, 1000);
  setTimeout(getProfessions, 1500);
  let dice2 = document.getElementById("dice2");
  dice2.hidden = true;
};

window.onload = initialize;

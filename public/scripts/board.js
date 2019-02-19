let game;

const closeOverlay = function (id) {
  let overlay = document.getElementById(id);
  overlay.style.visibility = "hidden";
};

const openFinancialStatement = function () {
  let fs = document.getElementById("financial_statement");
  fs.style.visibility = "visible";
};

const openCashLedger = function () {
  let fs = document.getElementById("cash_ledger");
  fs.style.visibility = "visible";
};

const getBoard = function () {
  let container = document.getElementById('container');
  let parent = container.parentElement;
  parent.removeChild(container);
}

const createFinancialStatement = function () {
  const rightSection = document.createElement('section');
  let income = createDiv('Income');
  let expenses = createDiv('Expense');
  let assets = createDiv('Assets');
  let name = createDiv('Name');
  let profession = createDiv('Profession');
  let dream = createDiv('Dream');
  appendChildren(rightSection, [income, expenses, assets, name, profession, dream]);
  return rightSection;
}

const getFinancialStatement = function () {
  let container = document.getElementById('container');
  container.innerHTML = "";
  const rightSection = createFinancialStatement();
  const leftSection = document.createElement('section');
  let button = createPopupButton('continue', getBoard);
  appendChildren(container, [leftSection, rightSection, button])
}

const displayFinancialStatement = function () {
  getFinancialStatement();
}

const getProfessionsDiv = function (player) {
  let { name, profession, turn } = player;
  let mainDiv = createDivWithClass("details");
  let container = document.getElementById('container');
  let p_name = createDiv(name);
  let p_profession = createDiv(profession.profession);
  let p_turn = createDiv(turn);
  appendChildren(mainDiv, [p_name, p_profession, p_turn]);
  container.appendChild(mainDiv)
  return mainDiv;
}

const getProfessions = function () {
  let content = game.players;
  let container = document.getElementById('container');
  content.map(getProfessionsDiv).join('');
  let button = createPopupButton("continue", displayFinancialStatement);
  container.appendChild(button);
}


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
  fetch("/rolldie")
    .then(res => res.text())
    .then(number => {
      dice.innerText = number;
      dice.onclick = null;
    });
};

const polling = function (game) {
  let { currentPlayer } = game;
  if (isMyTurn && !currentPlayer.hasRolledDice) {
    activateDice(currentPlayer);
  }
};

const getGame = function () {
  fetch('/getgame').then((data) => {
    return data.json();
  }).then((content) => {
    game = content;
  })
}

const initialize = function () {
  setInterval(getGame, 1000);
  setTimeout(getProfessions, 1500);
  let dice2 = document.getElementById("dice2");
  dice2.hidden = true;
};

window.onload = initialize;

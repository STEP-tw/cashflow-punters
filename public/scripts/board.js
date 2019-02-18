const openFinancialStatement = function() {
  let fs = document.getElementById("financial_statement");
  fs.style.visibility = "visible";
};

const openCashLedger = function() {
  let fs = document.getElementById("cash_ledger");
  fs.style.visibility = "visible";
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

const closeOverlay = function(id) {
  let overlay = document.getElementById(id);
  overlay.style.visibility = "hidden";
};

const rollDie = function() {
  const dice = document.getElementById(event.target.id);
  fetch("/rolldie")
    .then(res => res.text())
    .then(number => {
      dice.innerText = number;
      dice.onclick = null;
    });
};

const polling = function(game) {
  let { currentPlayer } = game;
  if (isMyTurn && !currentPlayer.hasRolledDice) {
    activateDice(currentPlayer);
  }
};

const initialize = function() {
  let dice2 = document.getElementById("dice2");
  dice2.hidden = true;
};

window.onload = initialize;

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

const setCashLedger = function(player) {
  setInnerHTML("LedgerBalance", player.ledgerBalance);
  setInnerHTML("ledger-balance", player.ledgerBalance);
};

const getCashLedger = function() {
  const container = document.getElementById("container");
  container.innerHTML = "";
  const top = document.createElement("div");
  const leftSection = document.createElement("section");
  leftSection.className = "popup";
  top.className = "statements";
  fetch("/financialStatement")
    .then(data => data.json())
    .then(content => {
      setCashLedger(content);
      const button = createPopupButton("continue", getBoard);
      const cashLedger = document.getElementById("cash_ledger");
      top.innerHTML = cashLedger.innerHTML;
      appendChildren(container, [top, button]);
    });
};

const updateStatementBoard = function(player) {
  setInnerHTML("name", player.name);
  setInnerHTML("Profession", player.profession);
  setInnerHTML("passiveIn", player.passiveIncome);
  setInnerHTML("totalIn", player.totalIncome);
  setInnerHTML("expenses", player.totalExpense);
  setInnerHTML("cashflow", player.cashflow);
  setInnerHTML("income", player.income.salary);
  setInnerHTML("ledger-balance", player.ledgerBalance);
};

const setFinancialStatement = function(player) {
  setInnerHTML("player_salary", player.income.salary);
  setInnerHTML("player_passiveIn", player.passiveIncome);
  setInnerHTML("player_totalIn", player.totalIncome);
  setInnerHTML("player_expenses", player.totalExpense);
  setInnerHTML("player_cashflow", player.cashflow);
  setInnerHTML("player_name", `Name : ${player.name}`);
  setInnerHTML("player_profession", `Profession : ${player.profession}`);
  setInnerHTML(
    "player_liabilities",
    `Liabilities :` + createParagraph(player.liabilities)
  );
  setInnerHTML(
    "player_expense",
    `Expense :` + createParagraph(player.expenses)
  );
  setInnerHTML("player_income", `Income :` + createParagraph(player.income));
  setInnerHTML("player_assets", `assets :` + createParagraph(player.assets));
  updateStatementBoard(player);
};

const createFinancialStatement = function() {
  const container = document.getElementById("container");
  container.innerHTML = "";
  const top = document.createElement("div");
  const leftSection = document.createElement("section");
  leftSection.className = "popup";
  top.className = "statements";
  fetch("/financialStatement")
    .then(data => data.json())
    .then(player => {
      setFinancialStatement(player);
      const button = createPopupButton("continue", getCashLedger);
      const fs = document.getElementById("financial_statement");
      top.innerHTML = fs.innerHTML;
      appendChildren(container, [top, button]);
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
  let { name, turn } = player;
  let mainDiv = createDivWithClass("details");
  let container = document.getElementById("container");
  let playerName = createDiv(`Name : ${name}`);
  let playerProfession = createDiv(`Profession : ${player.profession}`);
  let playerTurn = createDiv(`Turn : ${turn}`);
  let playerGamePiece = createDivWithClass(gamePiece[turn]);
  playerGamePiece.classList.add("gamePiece");
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

const createTextDiv = function(text) {
  const textDiv = document.createElement("div");
  const textPara = document.createElement("p");
  textPara.innerText = text;
  textDiv.appendChild(textPara);
  return textDiv;
};

const acceptCharity = function() {
  closeOverlay("askCharity");
  hideCardOverLay();
  fetch("/acceptCharity")
    .then(res => res.json())
    .then(charityDetail => {
      const msgContainer = getElementById("notification");
      msgContainer.innerText = charityDetail.msg;
      const ledgerBalance = getElementById("ledger-balance");
      ledgerBalance.innerText = charityDetail.ledgerBalance;
    });
};

const declineCharity = function() {
  closeOverlay("askCharity");
  hideCardOverLay();
  fetch("/declineCharity");
};

const showPlainCard = function(title, expenseAmount, type) {
  const cardDiv = document.getElementById("card");
  cardDiv.style.visibility = "visible";
  cardDiv.innerHTML = null;
  cardDiv.classList = [];
  cardDiv.classList.add("plain-card");
  cardDiv.classList.add(type);
  const titleDiv = createTextDiv(title);
  titleDiv.classList.add("card-title");
  const expenseDiv = createTextDiv("Pay $ " + expenseAmount);
  expenseDiv.classList.add("card-expense");
  cardDiv.appendChild(titleDiv);
  cardDiv.appendChild(expenseDiv);
};

const showCard = function(card) {
  const cardHandlers = {
    doodad: showPlainCard.bind(
      null,
      card.data.title,
      card.data.expenseAmount,
      "doodad-card"
    ),
    market: showPlainCard.bind(
      null,
      card.data.title,
      card.data.cash,
      "market-card"
    )
  };
  cardHandlers[card.type]();
};

const handlerCharity = function() {
  const askCharity = document.getElementById("askCharity");
  showCardOverLay();
  askCharity.style.visibility = "visible";
};

const showCardOverLay = function() {
  const cardOverlay = document.getElementById("card-overlay");
  cardOverlay.style.display = "block";
};

const hideCardOverLay = function() {
  const cardOverlay = document.getElementById("card-overlay");
  cardOverlay.style.display = "none";
};

const handlerDeal = function() {
  const selectDeal = document.getElementById("select-deal");
  showCardOverLay();
  selectDeal.style.visibility = "visible";
};

const selectSmallDeal = function() {
  closeOverlay("select-deal");
  hideCardOverLay();
  fetch("/selectSmallDeal");
};

const selectBigDeal = function() {
  closeOverlay("select-deal");
  hideCardOverLay();
  fetch("/selectBigDeal");
};

const rollDie = function() {
  const spacesHandlers = {
    charity: handlerCharity,
    deal: handlerDeal
  };
  const dice = document.getElementById("dice1");
  fetch("/rolldie")
    .then(res => res.json())
    .then(({ diceValue, spaceType }) => {
      dice.innerText = diceValue || dice.innerText;
      spacesHandlers[spaceType] && spacesHandlers[spaceType]();
      getElementById("notification").innerText = null;
    });
};

const polling = function(game) {
  let { players } = game;
  if (game.activeCard) {
    showCard(game.activeCard);
  }
  players.forEach(updateGamePiece);
};

const updateGamePiece = function(player) {
  let gamePiece = document.getElementById("gamePiece" + player.turn);
  gamePiece.classList.add("visible");
  let space = gamePiece.parentNode;
  let newSpace = document.getElementById(player.currentSpace);
  space.removeChild(gamePiece);
  newSpace.appendChild(gamePiece);
};

const showHover = function(parent) {
  const anchor = parent.children[0];
  anchor.style.visibility = "visible";
};

const hideHover = function(parent) {
  const anchor = parent.children[0];
  anchor.style.visibility = "hidden";
};

const createActivity = function({ playerName, msg, time }) {
  const activity = document.createElement("div");
  const activityPara = document.createElement("p");
  const timeHoverPara = document.createElement("p");
  timeHoverPara.classList.add("hover");
  timeHoverPara.innerText = new Date(time).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true
  });
  activity.onmouseover = showHover.bind(null, activity);
  activity.onmouseleave = hideHover.bind(null, activity);
  activity.classList.add("activity");
  activityPara.innerText = playerName + msg;
  activity.appendChild(timeHoverPara);
  activity.appendChild(activityPara);
  return activity;
};

const updateActivityLog = function(activityLog) {
  const activityLogDiv = document.getElementById("activityLog");
  const localActivitiesCount = activityLogDiv.children.length;
  if (activityLog.length == localActivitiesCount) {
    return;
  }
  const newActivities = activityLog.slice(localActivitiesCount);
  newActivities.forEach(activity => {
    let activityDiv = createActivity(activity);
    activityLogDiv.insertBefore(activityDiv, activityLogDiv.firstChild);
  });
};

const getGame = function() {
  fetch("/getgame")
    .then(data => data.json())
    .then(game => {
      updateActivityLog(game.activityLog);
      polling(game);
    });
};

const displayLoanForm = function() {
  const form = document.getElementById("manage-debt-form");
  document.getElementById("debt-button").onclick = takeLoan;
  document.getElementById("debt-button").innerHTML = "Take Loan";
  form.style.visibility = "visible";
};

const payDebt = function() {};

const displayPayDebtForm = function() {
  const form = document.getElementById("manage-debt-form");
  document.getElementById("debt-button").onclick = payDebt;
  document.getElementById("debt-button").innerHTML = "Pay Debt";
  form.style.visibility = "visible";
};

const takeLoan = function() {
  const amount = document.getElementById("debt-input").value;
  fetch("/takeloan", {
    method: "POST",
    body: JSON.stringify({ amount }),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(updateStatementBoard);
  closeOverlay("manage-debt-form");
};

const initialize = function() {
  setInterval(getGame, 1000);
  setTimeout(getProfessions, 1500);
  let dice2 = document.getElementById("dice2");
  dice2.hidden = true;

  document.getElementById("loan-form-button").onclick = displayLoanForm;
  document.getElementById("pay-debt-form-button").onclick = displayPayDebtForm;
};

window.onload = () => {
  initialize();
  const acceptCharityButton = getElementById("acceptCharity");
  acceptCharityButton.onclick = acceptCharity;
  const declineCharityButton = getElementById("declineCharity");
  declineCharityButton.onclick = declineCharity;
};

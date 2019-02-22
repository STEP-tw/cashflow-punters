const closeOverlay = function(id) {
  const element = document.getElementById(id);
  element.style.visibility = "hidden";
};

const showOverlay = function(id) {
  const element = getElementById(id);
  element.style.visibility = "visible";
};

const openFinancialStatement = function() {
  let fs = document.getElementById("financial_statement");
  fs.style.visibility = "visible";
};

const getBoard = function() {
  let container = document.getElementById("container");
  let parent = container.parentElement;
  parent.removeChild(container);
};

const setCashLedger = function(player) {
  setInnerText("LedgerBalance", player.ledgerBalance);
  setInnerText("ledger-balance", player.ledgerBalance);
};

const getCashLedger = function() {
  const container = getElementById("container");
  container.innerHTML = "";
  const top = createElement("div");
  const leftSection = createElement("section");
  leftSection.className = "popup";
  top.className = "statements";
  fetch("/financialStatement")
    .then(data => data.json())
    .then(content => {
      setCashLedger(content);
      const button = createPopupButton("continue", getBoard);
      const cashLedger = getElementById("cash_ledger");
      top.innerHTML = cashLedger.innerHTML;
      appendChildren(container, [top, button]);
    });
};

const updateStatementBoard = function(player) {
  setInnerText("name", player.name);
  setInnerText("Profession", player.profession);
  setInnerText("passiveIn", player.passiveIncome);
  setInnerText("totalIn", player.totalIncome);
  setInnerText("expenses", player.totalExpense);
  setInnerText("cashflow", player.cashflow);
  setInnerText("income", player.income.salary);
  setInnerText("ledger-balance", player.ledgerBalance);
  return player;
};

const setFinancialStatement = function(player) {
  setInnerText("player_salary", player.income.salary);
  setInnerText("player_passiveIn", player.passiveIncome);
  setInnerText("player_totalIn", player.totalIncome);
  setInnerText("player_expenses", player.totalExpense);
  setInnerText("player_cashflow", player.cashflow);
  setInnerText("player_name", `Name : ${player.name}`);
  setInnerText("player_profession", `Profession : ${player.profession}`);
  setInnerText("player_expense", `Expense : ${createPara(player.expenses)}`);
  setInnerText("player_income", `Income : ${createPara(player.income)}`);
  setInnerText("player_assets", `assets : ${createPara(player.assets)}`);
  setInnerText(
    "player_liabilities",
    `Liabilities : ${createPara(player.liabilities)}`
  );
  updateStatementBoard(player);
};

const createFinancialStatement = function() {
  const container = getElementById("container");
  container.innerHTML = "";
  const top = createElement("div");
  const leftSection = createElement("section");
  leftSection.className = "popup";
  top.className = "statements";
  fetch("/financialStatement")
    .then(data => data.json())
    .then(player => {
      setFinancialStatement(player);
      const button = createPopupButton("continue", getCashLedger);
      const fs = getElementById("financial_statement");
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
    .then(data => data.json())
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

const doCharity = function() {
  closeOverlay("askCharity");
  hideCardOverLay();
  fetch("/acceptCharity")
    .then(res => res.json())
    .then(charityDetail => {
      const ledgerBalance = getElementById("ledger-balance");
      ledgerBalance.innerText = charityDetail.ledgerBalance;
    });
};

const acceptCharity = function() {
  fetch("/isabletodocharity")
    .then(res => res.json())
    .then(({ isAble, msg }) => {
      const msgContainer = getElementById("notification");
      msgContainer.innerText = msg;
      if (isAble) doCharity();
    });
};

const declineCharity = function() {
  closeOverlay("askCharity");
  hideCardOverLay();
  fetch("/declineCharity");
};

const acceptSmallDeal = function(event) {
  let parent = event.target.parentElement;
  parent.style.display = "none";
  fetch("/acceptSmallDeal");
};

const declineSmallDeal = function() {
  let parent = event.target.parentElement;
  parent.style.display = "none";
  fetch("/declineSmallDeal");
};

const acceptBigDeal = function(event) {
  let parent = event.target.parentElement;
  parent.style.display = "none";
  fetch("/acceptBigDeal");
};

const declineBigDeal = function() {
  let parent = event.target.parentElement;
  parent.style.display = "none";
  fetch("/declineBigDeal");
};

const createCardButtons = function(actions) {
  const buttons = createElement("div");
  const button1 = createButton(
    "Accept",
    "button_div",
    "accept",
    "button",
    actions[0]
  );

  const button2 = createButton(
    "decline",
    "button_div",
    "reject",
    "button",
    actions[1]
  );
  appendChildren(buttons, [button1, button2]);
  return buttons;
};

const createCardDiv = function(type) {
  const cardDiv = getElementById("card");
  cardDiv.style.visibility = "visible";
  cardDiv.innerHTML = null;
  cardDiv.classList = [];
  cardDiv.classList.add("plain-card");
  cardDiv.classList.add(type);
  return cardDiv;
};

const createSharesSmallDeal = function(actions, card) {
  const { title, message, symbol, historicTradingRange, currentPrice } = card;
  const cardDiv = createCardDiv("smallDeal");
  const titleDiv = createTextDiv(title);
  const messageDiv = createTextDiv(message);
  const symbolDiv = createTextDiv(`Company Name : ${symbol}`);
  const rangeDiv = createTextDiv(historicTradingRange);
  const currentPriceDiv = createTextDiv(currentPrice);
  const bottomDiv = createElement("div");
  bottomDiv.classList.add("card-bottom");
  const buttons = createCardButtons(actions);
  appendChildren(bottomDiv, [symbolDiv, rangeDiv, currentPriceDiv]);
  appendChildren(cardDiv, [titleDiv, messageDiv, bottomDiv, buttons]);
};

const createRealEstateDealCard = function(actions, card, isMyTurn) {
  const { title, message, cost, mortgage, downPayment, cashflow } = card;
  const cardDiv = createCardDiv("smallDeal");
  const titleDiv = createTextDiv(title);
  const messageDiv = createTextDiv(message);
  const mortgageDiv = createTextDiv(mortgage);
  const costDiv = createTextDiv(cost);
  const downPaymentDiv = createTextDiv(downPayment);
  const cashflowDiv = createTextDiv(cashflow);
  const bottomDiv1 = createElement("div");
  const bottomDiv2 = createElement("div");
  bottomDiv1.classList.add("card-bottom");
  bottomDiv2.classList.add("card-bottom");
  appendChildren(bottomDiv1, [costDiv, cashflowDiv]);
  appendChildren(bottomDiv2, [mortgageDiv, downPaymentDiv]);
  appendChildren(cardDiv, [titleDiv, messageDiv, bottomDiv1, bottomDiv2]);
  if (isMyTurn) cardDiv.appendChild(createCardButtons(actions));
};

const createGoldSmallDeal = function(actions, card, isMyTurn) {
  const { title, message, numberOfCoins, cost } = card;
  const cardDiv = createCardDiv("smallDeal");
  const titleDiv = createTextDiv(title);
  const messageDiv = createTextDiv(message);
  const numberDiv = createTextDiv(numberOfCoins);
  const costDiv = createTextDiv(cost);
  const bottomDiv = createElement("div");
  bottomDiv.classList.add("card-bottom");
  appendChildren(bottomDiv, [numberDiv, costDiv]);
  appendChildren(cardDiv, [titleDiv, messageDiv, bottomDiv]);
  if (isMyTurn) cardDiv.appendChild(createCardButtons(actions));
};

const showSmallDealCard = function(title, expenseAmount, type) {
  const cardDiv = createCardDiv(type);
  const titleDiv = createTextDiv(title);
  titleDiv.classList.add("card-title");
  const expenseDiv = createTextDiv("Pay $ " + expenseAmount);
  expenseDiv.classList.add("card-expense");
  cardDiv.appendChild(titleDiv);
  cardDiv.appendChild(expenseDiv);
};

const showPlainCard = function(title, expenseAmount, type) {
  const cardDiv = getElementById("card");
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

const nothing = () => {};

const getSmallDealHandler = function(card, isMyTurn, actions) {
  const dealCardTypes = {
    shares: createSharesSmallDeal.bind(null, actions),
    goldCoins: createGoldSmallDeal.bind(null, actions),
    realEstate: createRealEstateDealCard.bind(null, actions)
  };
  if (card.dealDone) return nothing;
  return (
    dealCardTypes[card.data.relatedTo] &&
    dealCardTypes[card.data.relatedTo].bind(null, card.data, isMyTurn)
  );
};

const getCardTitle = function() {
  let card = getElementById("card");
  return card.children[0] && card.children[0].children[0].innerText;
};

const isSameCard = function(cardTitle) {
  return cardTitle == getCardTitle();
};

const showCard = function(card, isMyTurn) {
  if (isSameCard(card.data.title)) return;
  const bigDealactions = [acceptBigDeal, declineBigDeal];
  const smallDealactions = [acceptSmallDeal, declineSmallDeal];
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
    ),
    smallDeal: getSmallDealHandler(card, isMyTurn, smallDealactions),
    bigDeal: createRealEstateDealCard.bind(
      null,
      bigDealactions,
      card.data,
      isMyTurn
    )
  };
  cardHandlers[card.type] && cardHandlers[card.type]();
};

const handleCharity = function() {
  const askCharity = getElementById("askCharity");
  showCardOverLay();
  askCharity.style.visibility = "visible";
  const acceptCharityButton = getElementById("acceptCharity");
  acceptCharityButton.onclick = acceptCharity;
  const declineCharityButton = getElementById("declineCharity");
  declineCharityButton.onclick = declineCharity;
};

const showCardOverLay = function() {
  const cardOverlay = getElementById("card-overlay");
  cardOverlay.style.display = "block";
};

const hideCardOverLay = function() {
  const cardOverlay = getElementById("card-overlay");
  cardOverlay.style.display = "none";
};

const handleDeal = function() {
  showCardOverLay();
  showOverlay("select-deal");
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

const displayDiceValue = function(diceValue, count) {
  const diceFaces = {
    1: "&#x2680",
    2: "&#x2681",
    3: "&#x2682",
    4: "&#x2683",
    5: "&#x2684",
    6: "&#x2685"
  };
  const diceDiv = getElementById("dice" + count);
  diceDiv.innerHTML = diceFaces[diceValue];
};

const showDice = function(diceValues) {
  let count = 1;
  diceValues.forEach(diceValue => {
    if (+diceValue) {
      displayDiceValue(diceValue, count);
    }
    count++;
  });
};

const rollDice = function(numberOfDice) {
  closeOverlay("num_of_dice");
  const spacesHandlers = {
    charity: handleCharity,
    deal: handleDeal
  };
  fetch("/rolldice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ numberOfDice })
  })
    .then(res => res.json())
    .then(({ diceValues, spaceType }) => {
      showDice(diceValues);
      spacesHandlers[spaceType] && spacesHandlers[spaceType]();
      getElementById("notification").innerText = null;
    });
};

const rollOneDice = function() {
  disableDice("dice2");
  rollDice(1);
};

const rollDie = function() {
  fetch("/hascharity")
    .then(res => res.json())
    .then(({ hasCharityTurns }) => {
      if (hasCharityTurns) {
        showOverlay("num_of_dice");
        const oneDiceButton = getElementById("one_dice_button");
        oneDiceButton.onclick = rollOneDice;
        const twoDiceButton = getElementById("two_dice_button");
        twoDiceButton.onclick = () => {
          enableDice("dice2");
          rollDice(2);
        };
        return;
      }
      rollOneDice();
    });
};

const polling = function(game) {
  let { players, requestedPlayer } = game;
  if (game.activeCard) {
    showCard(game.activeCard, game.isMyTurn);
  }
  updateStatementBoard(requestedPlayer);
  setFinancialStatement(requestedPlayer);
  showNotification(requestedPlayer.notification);
  players.forEach(updateGamePiece);
};

const showNotification = function(notification) {
  if (!notification) return;
  const notificationDiv = createTextDiv(notification);
  const time = new Date().toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true
  });
  const timeDiv = createTextDiv(time);
  const notificationsDiv = getElementById("notification-div");
  notificationsDiv.innerHTML = "";
  notificationsDiv.appendChild(notificationDiv);
  notificationsDiv.appendChild(timeDiv);
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
  const activity = createElement("div");
  const activityPara = createElement("p");
  const timeHoverPara = createElement("p");
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
  const activityLogDiv = getElementById("activityLog");
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

const getPlayerData = function(playersData) {
  const { playerName } = parseCookie();
  const playerData = playersData.filter(({ name }) => name == playerName)[0];
  return playerData;
};

const getGame = function() {
  fetch("/getgame")
    .then(data => data.json())
    .then(game => {
      updateActivityLog(game.activityLog);
      polling(game);
    });
};

const enableDice = function(id) {
  const dice = getElementById(id);
  dice.style.visibility = "visible";
};

const disableDice = function(id) {
  const dice = getElementById(id);
  dice.style.visibility = "hidden";
};

const initialize = function() {
  setInterval(getGame, 1000);
  setTimeout(getProfessions, 1500);
};

window.onload = () => {
  initialize();
};

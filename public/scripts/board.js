const openFinancialStatement = function() {
  let fs = document.getElementById("financial_statement");
  fs.style.visibility = "visible";
};

const getBoard = function() {
  const container = document.getElementById("container");
  const parent = container.parentElement;
  parent.removeChild(container);
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

const createFinancialStatement = function() {
  closeOverlay("professions");
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

const doCharity = function() {
  hideOverlay("askCharity");
  closeOverlay("card-overlay");
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
    .then(({ isAble }) => {
      if (isAble) doCharity();
    });
};

const declineCharity = function() {
  hideOverlay("askCharity");
  closeOverlay("card-overlay");
  fetch("/declineCharity");
};

const isSameCard = function(card) {
  const { title, message } = card;
  const cardTitleDiv = getElementById("card-title");
  const cardMessageDiv = getElementById("card-message");
  const cardTitle = cardTitleDiv && cardTitleDiv.innerText;
  const cardMessage = cardMessageDiv && cardMessageDiv.innerText;
  return cardTitle == title && cardMessage == message;
};

const showPlainCard = function(title, expenseAmount, type, msg) {
  const cardDiv = getElementById("card");
  cardDiv.style.visibility = "visible";
  cardDiv.innerHTML = null;
  cardDiv.classList = [];
  cardDiv.classList.add("plain-card");
  cardDiv.classList.add(type);
  const titleDiv = createTextDiv(title, "card-title");
  titleDiv.classList.add("card-title");
  const expenseDiv = createTextDiv("Pay $ " + expenseAmount, "card-message");
  expenseDiv.classList.add("card-expense");
  cardDiv.appendChild(titleDiv);
  cardDiv.appendChild(expenseDiv);
};

const handleCharity = function() {
  const askCharity = getElementById("askCharity");
  openOverlay("card-overlay");
  askCharity.style.visibility = "visible";
  const acceptCharityButton = getElementById("acceptCharity");
  acceptCharityButton.onclick = acceptCharity;
  const declineCharityButton = getElementById("declineCharity");
  declineCharityButton.onclick = declineCharity;
};

const handleDeal = function() {
  openOverlay("card-overlay");
  showOverlay("select-deal");
};

const selectSmallDeal = function() {
  hideOverlay("select-deal");
  closeOverlay("card-overlay");
  fetch("/selectSmallDeal");
};

const selectBigDeal = function() {
  hideOverlay("select-deal");
  closeOverlay("card-overlay");
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
  diceDiv.style.visibility = "visible";
  diceDiv.style.display = "block";
};

const showDice = function(diceValues) {
  let count = 1;
  diceValues.forEach(diceValue => {
    if (diceValue) displayDiceValue(diceValue, count);
    count++;
  });
};

const showRandomDiceFace = function() {
  const diceFaces = {
    1: "&#x2680",
    2: "&#x2681",
    3: "&#x2682",
    4: "&#x2683",
    5: "&#x2684",
    6: "&#x2685"
  };
  const dice1 = document.getElementById("dice1");
  const dice2 = document.getElementById("dice2");
  let randomFaceVal = Math.ceil(Math.random() * 6);
  dice1.innerHTML = diceFaces[randomFaceVal];
  dice2.innerHTML = diceFaces[randomFaceVal];
};

const rollDice = function(numberOfDice) {
  hideOverlay("num_of_dice");
  closeOverlay("num_of_dice");
  const diceBlock = getElementById("dice_block");
  diceBlock.onclick = null;
  const spacesHandlers = {
    charity: handleCharity,
    deal: handleDeal
  };

  const diceAnimationInterval = setInterval(() => {
    showRandomDiceFace();
  }, 150);
  setTimeout(() => {
    fetch("/rolldice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numberOfDice })
    })
      .then(res => res.json())
      .then(({ diceValues, spaceType }) => {
        clearInterval(diceAnimationInterval);
        showDice(diceValues);
        spacesHandlers[spaceType] && spacesHandlers[spaceType]();
      });
  }, 900);
};

const rollOneDice = function() {
  closeOverlay("num_of_dice");
  hideOverlay("num_of_dice");
  closeOverlay("dice2");
  rollDice(1);
};

const rollDie = function() {
  fetch("/hascharity")
    .then(res => res.json())
    .then(({ hasCharityTurns }) => {
      if (!hasCharityTurns) return rollOneDice();
      showOverlay("num_of_dice");
      openOverlay("num_of_dice");
      const oneDiceButton = getElementById("one_dice_button");
      oneDiceButton.onclick = rollOneDice;
      const twoDiceButton = getElementById("two_dice_button");
      twoDiceButton.onclick = () => {
        showOverlay("dice2");
        rollDice(2);
      };
    });
};

const displayOutOfGameMsg = function() {
  const notifyDiv = getElementById("bankruptedMsg");
  if (notifyDiv.style.display == "none") {
    return;
  }
  notifyDiv.style.visibility = "visible";
};

const polling = function(game) {
  let { players, requester } = game;
  if (requester.removed) {
    displayOutOfGameMsg();
  }
  if (game.activeCard) {
    showCard(game.activeCard, game.isMyTurn, requester);
  }
  updateStatementBoard(requester);
  setFinancialStatement(requester);
  setCashLedger(requester);
  showNotification(requester.notification);
  players.forEach(updateGamePiece);
  if (game.isMyTurn) {
    const diceBlock = getElementById("dice_block");
    diceBlock.onclick = rollDie;
  }
  if (requester.removed) {
    displayOutOfGameMsg();
  }
};

const showCard = function(card, isMyTurn, player) {
  if (isSameCard(card.data)) return;
  const bigDealactions = [acceptBigDeal, declineBigDeal, createAuction];
  const cardHandlers = {
    doodad: showPlainCard.bind(
      null,
      card.data.title,
      card.data.expenseAmount,
      "doodad-card"
    ),
    market: showMarketCard.bind(null, card, player),
    smallDeal: getSmallDealHandler(card, isMyTurn),
    bigDeal: createRealEstateDealCard.bind(
      null,
      bigDealactions,
      card.data,
      isMyTurn
    )
  };
  cardHandlers[card.type] && cardHandlers[card.type]();
};

const showNotification = function(notification) {
  const odlNotifDiv = document.getElementById("notification-div").children[0];
  const oldNotification = odlNotifDiv && odlNotifDiv.children[0].innerText;
  if (!notification || oldNotification == notification) return;
  const notificationDiv = createTextDiv(notification);
  notificationDiv.classList.add("scrollable-notification");
  const time = new Date().toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true
  });
  const timeDiv = createTextDiv(time);
  timeDiv.classList.add("time-notification");
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

const createActivity = function({ playerName, msg, time }) {
  const activity = createElement("div");
  const activityPara = createElement("p");
  activity.classList.add("activity");
  activityPara.innerText =
    formatTime(new Date(time)) + "   " + playerName + msg;
  activity.appendChild(activityPara);
  return activity;
};

const updateActivityLog = function({ activityLog }) {
  const activityLogDiv = getElementById("activityLog");
  const localActivitiesCount = activityLogDiv.children.length;
  if (activityLog.length == localActivitiesCount) return;
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
      joinAuction(game);
      polling(game);
    });
};

const initialize = function() {
  setInterval(getGame, 1000);
  setTimeout(getProfessions, 1500);
};

window.onload = () => {
  initialize();
};

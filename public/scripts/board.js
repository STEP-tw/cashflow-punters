const openFinancialStatement = function() {
  let fs = getElementById("financial_statement");
  fs.style.visibility = "visible";
};

const getBoard = function() {
  const container = getElementById("container");
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

const updateLedgerBalance = function(ledgerBalance) {
  const ledgerBalanceElement = getElementById("ledger-balance");
  const oldLedgerBalance = ledgerBalanceElement.innerText;
  if (oldLedgerBalance != ledgerBalance) {
    ledgerBalanceElement.classList.remove("blinking");
    void ledgerBalanceElement.offsetWidth; // reflow method to trigger animation
    ledgerBalanceElement.classList.add("blinking");
    setTimeout(() => setInnerText("ledger-balance", ledgerBalance), 200);
  }
};

const updateStatementBoard = function(player) {
  setInnerText("name", player.name);
  getElementById("name").style.color = playerColours[player.turn];
  setInnerText("Profession", player.profession);
  setInnerText("passiveIn", player.passiveIncome);
  setInnerText("totalIn", player.totalIncome);
  setInnerText("expenses", player.totalExpense);
  setInnerText("cashflow", player.cashflow);
  setInnerText("income", player.income.salary);
  updateLedgerBalance(player.ledgerBalance);
  return player;
};

const createInvestmentCell = function(value) {
  const cell = createElement("td");
  cell.innerText = value;
  return cell;
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
  const ftCardTitle = getElementById("ft-card-title");
  const cardTitle = cardTitleDiv && cardTitleDiv.innerText;
  const cardMessage = cardMessageDiv && cardMessageDiv.innerText;
  if (!cardMessage) return cardTitle == title;
  return (cardTitle == title && cardMessage == message) || ftCardTitle == title;
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
  const expenseDiv = createTextDiv(msg, "card-message");
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
  const diceDiv = getElementById("dice" + count);
  diceDiv.src = `Dice-${diceValue}.png`;
  diceDiv.style.visibility = "visible";
  diceDiv.style.display = "block";
};

const showDice = function(diceValues) {
  hideOverlay("dice1");
  hideOverlay("dice2");
  hideOverlay("ft-dice1");
  hideOverlay("ft-dice2");
  let count = 1;
  diceValues.forEach(diceValue => {
    if (diceValue) displayDiceValue(diceValue, count);
    count++;
  });
  count = 1;
  diceValues.forEach(diceValue => {
    if (diceValue) displayFasttrackDiceValue(diceValue, count);
  });
};

const showRandomDiceFace = function() {
  const diceFaces = {
    1: "/Dice-1.png",
    2: "/Dice-2.png",
    3: "/Dice-3.png",
    4: "/Dice-4.png",
    5: "/Dice-5.png",
    6: "/Dice-6.png"
  };
  const dice1 = getElementById("dice1");
  const dice2 = getElementById("dice2");
  const fasttrackDice1 = getElementById("ft-dice1");
  const fasttrackDice2 = getElementById("ft-dice2");
  let randomFaceVal = Math.ceil(Math.random() * 6);
  dice1.src = diceFaces[randomFaceVal];
  dice2.src = diceFaces[randomFaceVal];
  fasttrackDice1.src = diceFaces[randomFaceVal];
  fasttrackDice2.src = diceFaces[randomFaceVal];
};

const disableDice = () => {
  const dice1 = getElementById("dice1");
  const dice2 = getElementById("dice2");
  dice1.onclick = null;
  dice2.onclick = null;
};

const rollDice = function(numberOfDice) {
  hideOverlay("num_of_dice");
  hideOverlay("ft-num_of_dice");
  closeOverlay("num_of_dice");
  closeOverlay("ft-num_of_dice");
  const diceBlock = getElementById("dice_block");
  const ftDiceBlock = getElementById("ft-dice-block");
  ftDiceBlock.onclick = null;
  diceBlock.onclick = null;

  const spacesHandlers = {
    charity: handleCharity,
    deal: handleDeal
  };

  const diceAnimationInterval = setInterval(() => {
    showRandomDiceFace();
  }, 100);

  setTimeout(() => {
    fetch("/rolldice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numberOfDice })
    })
      .then(res => res.json())
      .then(({ spaceType, isBankrupted, isEligibleForMLM, isFastTrack }) => {
        clearInterval(diceAnimationInterval);
        if (isBankrupted) {
          disableDice();
          return displayOutOfGameMsg();
        }
        if (isEligibleForMLM) return rollDiceForMLM();
        spacesHandlers[spaceType] && spacesHandlers[spaceType]();
      });
  }, 900);
};

const rollDiceForMLM = function() {
  const dice = getElementById("dice1");
  dice.onclick = handleMLM;
};

const handleMLM = function() {
  const diceBlock = getElementById("dice1");
  diceBlock.onclick = null;
  const spacesHandlers = {
    charity: handleCharity,
    deal: handleDeal
  };
  const diceAnimationInterval = setInterval(() => {
    showRandomDiceFace();
  }, 150);
  fetch("/rolldiceformlm")
    .then(res => res.json())
    .then(({ diceValue, spaceType, isMLMTurnLeft }) => {
      clearInterval(diceAnimationInterval);
      if (isMLMTurnLeft) {
        return rollDiceForMLM();
      }
      spacesHandlers[spaceType] && spacesHandlers[spaceType]();
    });
};

const rollOneDice = function() {
  closeOverlay("num_of_dice");
  closeOverlay("ft-num_of_dice");
  hideOverlay("num_of_dice");
  hideOverlay("ft-num_of_dice");
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
      showOverlay("ft-num_of_dice");
      openOverlay("ft-num_of_dice");
      const oneDiceButton = getElementById("one_dice_button");
      oneDiceButton.onclick = rollOneDice;
      const twoDiceButton = getElementById("two_dice_button");
      twoDiceButton.onclick = () => {
        showOverlay("dice2");
        showOverlay("ft-dice2");
        rollDice(2);
      };
    });
};

const displayOutOfGameMsg = function() {
  const notifyDiv = getElementById("bankruptedMsg");
  notifyDiv.style.visibility = "visible";
};

const removeGamePiece = function(player) {
  closeOverlay("gamePiece" + player.turn);
};

const isFasttrackPlayer = function(fasttrackPlayers, player) {
  return fasttrackPlayers.some(fasttrackPlayer => {
    return fasttrackPlayer.name == player.name;
  });
};

const getRatRicePlayers = function(allPlayer, fasttrackPlayers) {
  return allPlayer.filter(
    player =>
      !isFasttrackPlayer(fasttrackPlayers, player) &&
      !player.bankrupted &&
      !player.hasLeftGame
  );
};

const polling = function(game) {
  let { players, requester, fasttrackPlayers } = game;
  if (requester.notifyEscape) {
    notifyEscape();
  }
  if (game.activeCard.data) {
    showCard(game.activeCard, game.isMyTurn, requester);
  }
  const { diceValues } = game.dice;
  showDice(diceValues);
  showAllPlayerInfo(players, requester);
  updateStatementBoard(requester);
  if (requester.isFasttrackPlayer) setFtBoardStatement(requester);
  showNotification(requester.notification);
  players.forEach(removeGamePiece);
  const ratRacePlayers = getRatRicePlayers(players, fasttrackPlayers);
  ratRacePlayers.forEach(updateGamePiece);
  fasttrackPlayers.forEach(updateFasttrackGamePiece);
  const ftDiceBlock = getElementById("ft-dice-block");
  const diceBlock = getElementById("dice_block");
  if (game.isMyTurn) {
    if (isFasttrackPlayer(fasttrackPlayers, requester)) {
      ftDiceBlock.onclick = rollDie;
      return;
    }
    diceBlock.onclick = rollDie;
  }
};

const acceptFasttrackDeal = function() {
  fetch("/acceptFtDeal")
    .then(res => res.json())
    .then(({ hasWon, playerName }) => {
      hideOverlay("card-button-container");
      if (hasWon) showWin(playerName);
    });
};

const showWin = function(playerName) {
  const confirmationDiv = getElementById("ft-leave-game");
  const informationDiv = createElement("div");
  informationDiv.className = "top-popup";
  const message = `${playerName} has won the game`;
  const messageDiv = createParagraph(message);
  const okayButton = createElement("button");
  okayButton.innerText = "OK";
  okayButton.onclick = hideOverlay.bind(null, "ft-leave-game");
  appendChildren(informationDiv, [messageDiv, okayButton]);
  appendChildren(confirmationDiv, [informationDiv]);
  openOverlay("ft-leave-game");
};

const declineFasttrackDeal = function() {
  hideOverlay("card-button-container");
  fetch("/declineSmallDeal");
};

const getFastTrackCardDiv = function(type) {
  const cardDiv = getElementById("card-container");
  cardDiv.style.visibility = "visible";
  cardDiv.innerHTML = null;
  cardDiv.className = "ft-card";
  return cardDiv;
};

const createFasttrackButtons = function(actions) {
  let buttons = getElementById("card-button-container");
  if (buttons == undefined)
    buttons = createElement("div", "card-button-container");
  buttons.classList.add("buttons-div");
  buttons.style.display = "flex";
  const accept = createAcceptButton(actions[0]);
  const decline = createDeclineButton(actions[1]);
  appendChildren(buttons, [accept, decline]);
  return buttons;
};

const handleFastTrackDeal = function(cardData, isMyTurn) {
  const card = cardData.data;
  const { playerName } = parseCookie();
  const fastTrackDealactions = [acceptFasttrackDeal, declineFasttrackDeal];
  const { title, cashflow, downPayment } = card;
  const cardDivContainer = getFastTrackCardDiv("fasttrack-card");
  const titleDiv = createHeadingDiv(4, title, "card-title");
  titleDiv.id = "ft-card-title";
  const cashflowDiv = createTextDiv(`Cashflow : ${cashflow}`);
  const downPaymentDiv = createTextDiv(`Down Payment : ${downPayment}`);
  const bottomDiv = createElement("div");
  bottomDiv.classList.add("card-bottom");
  appendChildren(bottomDiv, [cashflowDiv, downPaymentDiv]);
  appendChildren(cardDivContainer, [titleDiv, bottomDiv]);
  if (cardData.drawnBy == playerName)
    cardDivContainer.appendChild(createFasttrackButtons(fastTrackDealactions));
};

const handlePenalty = function(card) {
  const { title, Message } = card;
  const cardDiv = getFastTrackCardDiv("fasttrack-card");
  const titleDiv = createHeadingDiv(4, title, "card-title");
  titleDiv.id = "ft-card-title";
  const messageDiv = createTextDiv(Message);
  appendChildren(cardDiv, [titleDiv, messageDiv]);
};

const acceptFtCharity = function() {
  hideOverlay("card-button-container");
  fetch("/acceptCharity");
};

const declineFtCharity = function() {
  hideOverlay("card-button-container");
  fetch("/declineCharity");
};

const handleFtCharity = function(card, isMyTurn, drawnBy) {
  fetch("/isabletodocharity")
    .then(data => data.json())
    .then(isAble => {
      const charityHandlers = [acceptFtCharity, declineFtCharity];
      const { title, Message } = card;
      const { playerName } = parseCookie();
      const cardDiv = getFastTrackCardDiv("fasttrack-card");
      const titleDiv = createHeadingDiv(4, title, "card-title");
      titleDiv.id = "ft-card-title";
      const messageDiv = createTextDiv(Message);
      appendChildren(cardDiv, [titleDiv, messageDiv]);
      if (isAble && drawnBy == playerName) {
        cardDiv.appendChild(createFasttrackButtons(charityHandlers));
      }
    });
};

const handleCashFlowDay = function() {
  fetch("/addcashflow").then(() => {
    const cardDiv = getFastTrackCardDiv("fasttrack-card");
    const message = "Monthly cashflow is added into your cash ledger.";
    const titleDiv = createHeadingDiv(1, message, "card-title");
    titleDiv.id = "ft-card-title";
    appendChildren(cardDiv, [titleDiv]);
  });
};

const showCard = function(card, isMyTurn, player) {
  if (isSameCard(card.data)) return;
  const bigDealactions = [acceptBigDeal, declineBigDeal, createAuction];
  const cardHandlers = {
    doodad: showPlainCard.bind(
      null,
      card.data.title,
      card.data.expenseAmount,
      "doodad-card",
      card.data.message
    ),
    market: showMarketCard.bind(null, card, player),
    smallDeal: getSmallDealHandler(card, isMyTurn),
    bigDeal: createRealEstateDealCard.bind(
      null,
      bigDealactions,
      card.data,
      card.drawnBy
    ),
    fasttrackDeal: handleFastTrackDeal.bind(null, card, isMyTurn),
    penalty: handlePenalty.bind(null, card.data, isMyTurn),
    charity: handleFtCharity.bind(null, card.data, isMyTurn, card.drawnBy),
    cashflowDay: handleCashFlowDay
  };
  cardHandlers[card.type] && cardHandlers[card.type]();
};

const showNotification = function(notification) {
  const odlNotifDiv = getElementById("notification-div").children[0];
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
  updateFtNotification(notificationDiv, timeDiv);
  notificationsDiv.innerHTML = "";
  notificationsDiv.appendChild(notificationDiv);
  notificationsDiv.appendChild(timeDiv);
};

const updateFtNotification = function(notificationDiv, timeDiv) {
  const ftnotificationsDiv = getElementById("ft-notification-div");
  ftnotificationsDiv.innerHTML = "";
  ftnotificationsDiv.appendChild(notificationDiv.cloneNode(true));
  ftnotificationsDiv.appendChild(timeDiv.cloneNode(true));
};

const updateGamePiece = function(player) {
  const gamePiece = getElementById("gamePiece" + player.turn);
  openOverlay("gamePiece" + player.turn);
  const space = gamePiece.parentNode;
  let newSpace = getElementById(player.currentSpace);
  if (player.isFasttrackPlayer) {
    newSpace = getElementById(`ft-${player.currentSpace}`);
  }
  space.removeChild(gamePiece);
  newSpace.appendChild(gamePiece);
};

const createActivity = function({ playerName, msg, time }) {
  const activity = createElement("div");
  const timeStamp = formatTime(new Date(time));
  const activityMessage = `${timeStamp}   ${playerName}${msg}`;
  const activityPara = createParagraph(activityMessage);
  activity.classList.add("activity");
  activity.appendChild(activityPara);
  return activity;
};

const updateActivityLog = function({ activityLog }) {
  const activityLogDiv = getElementById("activityLog");
  const newLog = getElementById("ftactivityLog");
  const localActivitiesCount = activityLogDiv.children.length;
  if (activityLog.length == localActivitiesCount) return;
  const newActivities = activityLog.slice(localActivitiesCount);
  newActivities.forEach(activity => {
    const activityDiv = createActivity(activity);
    activityLogDiv.insertBefore(activityDiv, activityLogDiv.firstChild);
  });
  newLog.innerHTML = activityLogDiv.innerHTML;
};

const getPlayerData = function(playersData) {
  const { playerName } = parseCookie();
  const playerData = playersData.filter(({ name }) => name == playerName)[0];
  return playerData;
};

const handleAuctionCard = function(game) {
  const { playerName } = parseCookie();
  const { activeCard, currentAuction } = game;
  const { soldTo } = activeCard;
  const { present } = currentAuction;
  if (present && currentAuction.data.host.name == playerName)
    return closeOverlay("card-button-container");
  if (soldTo != playerName) return;
  showPurchasedCard(activeCard);
};

const getGame = function() {
  fetch("/getgame")
    .then(data => data.json())
    .then(game => {
      updateActivityLog(game.activityLog);
      handleAuctionCard(game);
      joinAuction(game);
      polling(game);
    });
};

const flipBoard = function(deg) {
  const game = getElementById("main-game");
  game.style.transform = "rotateY(" + deg + "deg)";
};

const saveGame = function(gameType) {
  fetch("/savegame")
    .then(res => res.json())
    .then(({ isSuccessful, gameId }) => {
      let message = "Your game is in unstable stage, so you can't save it.";
      if (isSuccessful) {
        const gameIdDiv = getElementById(gameType + "saved-game-id");
        gameIdDiv.innerText = `Game Id: ${gameId}`;
        message = "You have saved the current state of game.";
      }
      const notification = getElementById(
        gameType + "save-game-notification-msg"
      );
      notification.innerText = message;
      openOverlay(gameType + "save-game");
    });
};

const initialize = function() {
  setInterval(getGame, 1000);
  setTimeout(getProfessions, 1500);
};

window.onload = () => {
  initialize();
};

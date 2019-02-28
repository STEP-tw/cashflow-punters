const openFinancialStatement = function() {
  let fs = document.getElementById("financial_statement");
  fs.style.visibility = "visible";
};

const getBoard = function() {
  const container = document.getElementById("container");
  const parent = container.parentElement;
  parent.removeChild(container);
};

const getEntriesHtml = function(entry) {
  const { time, type, amount, currentBalance, event } = entry;
  const symbols = { debit: "-", credit: "+" };
  const currentTime = formatTime(new Date(time));
  const entryDiv = createElement("div");
  entryDiv.className = "entry";
  const eventDiv = createElement("div");
  const totalAmountDiv = createElement("div");
  const symbol = symbols[type];
  eventDiv.innerHTML = `${symbol} ${amount} --> ${event} ${currentTime}`;
  totalAmountDiv.innerHTML = `= ${currentBalance}`;
  appendChildren(entryDiv, [eventDiv, totalAmountDiv]);
  return entryDiv;
};

const setCashLedger = function(player) {
  const { entries } = player;
  const entriesDiv = getElementById("cash-ledger-entries");
  const entriesHtml = entries.map(getEntriesHtml);
  appendChildren(entriesDiv, entriesHtml);
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

const createTableRow = function (tableData) {
	let tableRow = createElement('tr');
	tableData.forEach( data => {
		let tableDataHtml = createElement('td');
		tableDataHtml.innerText = data;
		tableRow.appendChild(tableDataHtml);
	})
	return tableRow;
};

const updateTableRows = function(id, rowData, properties) {
	let dataDiv = getElementById(id);
	dataDiv.innerHTML = '';
	rowData.forEach( data => {
		let tableData = [data.title];
		properties.forEach(property => {
			let value = data[property];
			tableData.push(value);
		});
		let rowDataHtml = createTableRow(tableData);
		dataDiv.appendChild(rowDataHtml);
	});
};

const setIncome = function(player) {
	setInnerText("salary",player.income.salary);
	let realEstates = player.income.realEstates;
	updateTableRows('RealEstate-cashflow', realEstates, ["cashflow"]);
};

const setExpenses = function(player) {
	setInnerText("taxes", player.expenses["taxes"]);
	setInnerText("home-mortage-payment", player.expenses["Home Mortgage Payment"]);
	setInnerText("school-loan-payment", player.expenses["School Loan Payment"]);
	setInnerText("car-loan-payment", player.expenses["Car Loan Payment"]);
	setInnerText("credit-card-payment", player.expenses["Credit Card Payment"]);
	setInnerText("other-expenses", player.expenses["Other Expenses"]);
	setInnerText("bank-loan-payment", player.expenses["Bank Loan Payment"]);
	setInnerText("total-child-expense", player.expenses["Child Expenses"]);
};

const updateShares = function(player){
	let stocksDiv = getElementById('stocks-funds');
	stocksDiv.innerHTML = '';
	let stocks = player.assets.shares;
	let stockNames = Object.keys(stocks);
	stockNames.forEach( stockName => {
		let row = createElement('tr');
		let name = createElement('td');
		name.innerText = stockName;
		row.appendChild(name);
		let number = createElement('td');
		number.innerText = stocks[stockName]["numberOfShares"];
		row.appendChild(number);
		let price = createElement('td');
		price.innerText = stocks[stockName]["currentPrice"];
		row.appendChild(price);
		stocksDiv.appendChild(row);
	});
};

const setAssets = function(player){
	setInnerText("savings", player.assets.savings);
	setInnerText("gold-coin-number", player.assets.goldCoins);
	updateShares(player);
	let realEstates = player.assets.realEstates;
	updateTableRows("RealEstate-downpayment", realEstates, ["downPayment", "cost"]);
};

const setLiabilities = function(player){
	setInnerText("home-mortage", player.liabilities["Home Mortgage"]);
	setInnerText("school-loans", player.liabilities["School Loan"]);
	setInnerText("car-loans", player.liabilities["Car Loan"]);
	setInnerText("credit-card-debt", player.liabilities["Credit Card"]);
	setInnerText("bank-loan", player.liabilities["Bank Loan"]);
	let realEstates = player.liabilities.realEstates;
	updateTableRows("RealEstate-mortage", realEstates, ["mortgage"]);
};

const setBasicFinancialDetails = function(player){
	setInnerText("fs-name", player.name);
  setInnerText("fs-profession", player.profession);
  setInnerText("fs-income", player.income.salary);
  setInnerText("passive-income", player.passiveIncome);
  setInnerText("total-income", player.totalIncome);
  setInnerText("fs-expenses", player.totalExpense);
	setInnerText("fs-cashflow", player.cashflow);
}

const setFinancialStatement = function(player) {
	setBasicFinancialDetails(player);
	setIncome(player);
	setExpenses(player);
	setAssets(player);
	setLiabilities(player);
  updateStatementBoard(player);
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

const updateRealEstateDiv = function(player) {
  let realEstates = player.assets.realEstates;
  let selectDiv = getElementById("Real-Estate");
  selectDiv.innerHTML = "";
  let bankDiv = getElementById("bankruptcyNotification");
  realEstates.forEach(({ title, downPayment }) => {
    selectDiv.appendChild(createRealEstateCheckList(title, downPayment));
  });
  let msg = player.notification;
  const bankruptcyMsgDiv = getElementById("bankruptcyMsg");
  if (msg == "please sell other asset your cash flow is stil negative") {
    showNotification(msg);
    updateStatementBoard(player);
    setFinancialStatement(player);
    setCashLedger(player);
    bankruptcyMsgDiv.innerText = msg;
    bankDiv.style.visibility = "visible";
    return;
  }
  showNotification(msg);
  hideOverlay("bankruptcyNotification");
};

const sellAsset = function() {
  let selectDiv = getElementById("Real-Estate");
  let allAssets = selectDiv.children;
  let selectedAsset = [];
  for (let pos = 0; pos < allAssets.length; pos++) {
    if (allAssets[pos].children[0].checked == true) {
      selectedAsset.push(allAssets[pos].children[0].value);
    }
  }
  fetch("/sellAssets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ selectedAsset })
  })
    .then(res => res.json())
    .then(updateRealEstateDiv);
};

const createRealEstateCheckList = function(realestate, downPayment) {
  let checkbox = createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = realestate;
  let realEstate = createElement("span");
  realEstate.innerText = realestate + " -- " + downPayment;
  let lineBreaker = createElement("br");
  let realEstateOption = createElement("div");
  realEstateOption.appendChild(checkbox);
  realEstateOption.appendChild(realEstate);
  realEstateOption.appendChild(lineBreaker);
  return realEstateOption;
};

const processBankruptcy = function(requester) {
  let realEstates = requester.assets.realEstates;
  let selectDiv = getElementById("Real-Estate");
  let bankDiv = getElementById("bankruptcyNotification");
  realEstates.forEach(({ title, downPayment }) => {
    if (bankDiv.style.visibility == "") {
      selectDiv.appendChild(createRealEstateCheckList(title, downPayment));
    }
  });
  bankDiv.style.visibility = "visible";
};

const displayOutOfGameMsg = function() {
  const notifyDiv =  getElementById("bankruptedMsg")
  if(notifyDiv.style.display == "none"){
    return;
  }
  notifyDiv.style.visibility = "visible";
};

const polling = function(game) {
  let { players, requester } = game;
 
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
  const bigDealactions = [acceptBigDeal, declineBigDeal];

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

const updateActivityLog = function(activityLog) {
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

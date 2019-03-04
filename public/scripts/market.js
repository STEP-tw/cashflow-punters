const getCommon = function(list1, list2) {
  return list2.reduce((prev, curr) => {
    if (list1.includes(curr.type)) {
      prev.push(curr);
    }
    return prev;
  }, []);
};

const sellCoins = function(player, card) {
  const { goldCoins } = player.assets;
  const cost = card.cash;
  const numberOfCoins = getElementById("gold-coin").value;
  const msg = `Sorry! You have only ${goldCoins} gold coins.`;
  if (numberOfCoins > goldCoins) {
    return displaySellGoldCoinForm(player, card, msg);
  }
  fetch("/sellgoldcoins", {
    method: "POST",
    body: JSON.stringify({ cost, numberOfCoins }),
    headers: { "Content-Type": "application/json" }
  });
  completeTurn();
};

const displaySellGoldCoinForm = function(player, card, msg) {
  const marketDiv = getElementById("market-card-div");
  const sellGoldCoins = sellCoins.bind(null, player, card);
  const goldCoinCount = createInput("goldCoins", "", "number", "gold-coin");
  const sellButton = createPopupButton("Sell Coins", sellGoldCoins);
  const msgBox = createElement("p");

  msgBox.innerText = msg;
  appendChildren(marketDiv, [goldCoinCount, sellButton, msgBox]);
  hideOverlay("card");
  showOverlay("market-card-div");
};

const completeTurn = function() {
  hideOverlay("card");
  hideOverlay("market-card-div");
  fetch("/completeturn");
};

const sellEstate = function(estate) {
  fetch("/sellestate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(estate)
  });
  showCommonEstates();
};

const createRow = data => {
  const row = createElement("tr");
  const title = createElement("td");
  title.innerText = data.type;
  const price = createElement("td");
  price.innerText = data.mortgage;
  const button = createElement("td");
  const sellButton = createElement("button");
  sellButton.innerText = "Sell";
  sellButton.onclick = sellEstate.bind(null, data);
  button.appendChild(sellButton);
  appendChildren(row, [title, price, button]);
  return row;
};

const createTableHtml = function(estates) {
  const table = createElement("table");
  const tableRows = estates.map(createRow);

  appendChildren(table, tableRows);
  return table;
};

const showCommonEstates = function() {
  fetch("/commonestates")
    .then(res => res.json())
    .then(displayEstates);
};

const displayEstates = function(commonEstates) {
  if (commonEstates.length == 0) return completeTurn();
  const estateDiv = getElementById("market-card-div");
  const estateTable = createTableHtml(commonEstates);
  const doneButton = createPopupButton("Done", completeTurn);
  appendChildren(estateDiv, [estateTable, doneButton]);
  hideOverlay("card");
  showOverlay("market-card-div");
};

const handleGoldCoin = function(player, card) {
  const cardDiv = getElementById("card");
  const msg = "Enter number of coins you want to sell";
  const sellForm = displaySellGoldCoinForm.bind(null, player, card, msg);
  if (player.assets.goldCoins > 0 && !player.isTurnComplete) {
    const sellButton = createPopupButton("Sell", sellForm);
    const cancelButton = createPopupButton("Cancel", completeTurn);
    cardDiv.appendChild(sellButton);
    cardDiv.appendChild(cancelButton);
  }
};

const handleRealEstate = function(player, { relatedRealEstates }) {
  const playerRealEstates = player.liabilities.realEstates;
  const commonEstates = getCommon(relatedRealEstates, playerRealEstates);
  const cardDiv = getElementById("card");
  const displayCommonEstates = displayEstates.bind(null, commonEstates);

  if (commonEstates.length > 0 && !player.isTurnComplete) {
    const sellButton = createPopupButton("Sell", displayCommonEstates);
    const cancelButton = createPopupButton("Cancel", completeTurn);
    cardDiv.appendChild(cancelButton);
    cardDiv.appendChild(sellButton);
  }
};

const rollDiceForSplitReverse = function(symbol) {
  const diceBlock = getElementById("dice1");
  diceBlock.onclick = null;
  fetch("/rolldiceforsplitreverse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symbol })
  })
    .then(res => res.json())
    .then(showDice)
    .then(completeTurn);
};

const enableDiceForMarket = function(symbol) {
  const dice1 = getElementById("dice1");
  dice1.onclick = rollDiceForSplitReverse.bind(null, symbol);
  const dice2 = getElementById("dice2");
  dice2.style.display = "none";
};

const handleShares = function(player, symbol, { hasShares }) {
  if (!hasShares) return;
  if (!player.isTurnComplete) {
    enableDiceForMarket(symbol);
  }
};

const handleSplitReverse = function(player, card) {
  const { symbol } = card;
  fetch("/hasshares", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symbol })
  })
    .then(res => res.json())
    .then(handleShares.bind(null, player, symbol));
};

const handleMarketCard = function(player, card) {
  const { relatedTo } = card;
  const marketHandlers = {
    realEstate: handleRealEstate,
    goldCoin: handleGoldCoin,
    splitOrReverse: handleSplitReverse,
    expense: () => {}
  };
  marketHandlers[relatedTo](player, card);
};

const showMarketCard = function(card, player) {
  const { title, message } = card.data;
  const cardDiv = getElementById("card");
  const titleDiv = createHeadingDiv(4, title, "card-title");
  const messageDiv = createTextDiv(message, "card-message");
  cardDiv.className = "plain-card market-card";
  titleDiv.className = "card-title";
  messageDiv.className = "card-message";
  appendChildren(cardDiv, [titleDiv, messageDiv]);

  handleMarketCard(player, card.data);
  showOverlay("card");
};

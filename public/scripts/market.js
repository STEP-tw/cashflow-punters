const getCommon = function(list1, list2) {
  return list2.reduce((prev, curr) => {
    if (list1.includes(curr.type)) {
      prev.push(curr);
    }
    return prev;
  }, []);
};

const handleRealEstate = function(player, {relatedRealEstates}) {
  const playerRealEstates = player.liabilities.realEstate;
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

const handleGoldCoin = function() {};
const handleMarketCard = function(player, card) {
  const {relatedTo} = card;
  const marketHandlers = {
    realEstate: handleRealEstate,
    goldCoin: handleGoldCoin
  };

  marketHandlers[relatedTo](player, card);
};

const showMarketCard = function(card, player) {
  const {title, message} = card.data;
  const cardDiv = getElementById("card");
  const titleDiv = createTextDiv(title, "card-title");
  const messageDiv = createTextDiv(message, "card-message");
  cardDiv.className = "plain-card market-card";
  titleDiv.className = "card-title";
  messageDiv.className = "card-message";
  appendChildren(cardDiv, [titleDiv, messageDiv]);

  handleMarketCard(player, card.data);
  showOverlay("card");
};

const completeTurn = function() {
  hideOverlay("card");
  hideOverlay("market-card-div");
  fetch("/completeturn");
};

const sellEstate = function(estate) {
  fetch("/sellestate", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(estate)
  });
  showCommonEstates();
};

const createRow = data => {
  const row = createElement("tr");
  const title = createElement("td");
  title.innerText = data.type;
  const price = createElement("td");
  price.innerText = data.cost;
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
  hideOverlay("card");
  const estateDiv = getElementById("market-card-div");
  const estateTable = createTableHtml(commonEstates);
  const doneButton = createPopupButton("Done", completeTurn);
  appendChildren(estateDiv, [estateTable, doneButton]);
  showOverlay("market-card-div");
};

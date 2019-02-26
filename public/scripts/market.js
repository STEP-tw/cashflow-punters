const getCommon = function(list1, list2) {
  return list2.reduce((prev, curr) => {
    if (list1.includes(curr.type)) {
      prev.push(curr);
    }
    return prev;
  }, []);
};

const showMarketCard = function(card, player) {
  const { title, message, relatedRealEstates } = card.data;
  const cardDiv = getElementById("card");
  showOverlay("card");
  cardDiv.classList = [];
  cardDiv.classList.add("plain-card");
  cardDiv.classList.add("market-card");
  const titleDiv = createTextDiv(title);
  titleDiv.classList.add("card-title");
  const messageDiv = createTextDiv(message);
  messageDiv.classList.add("card-message");
  appendChildren(cardDiv, [titleDiv, messageDiv]);
  const playerRealEstates = player.liabilities.realEstate;
  const commonEstates = getCommon(relatedRealEstates, playerRealEstates);
  if (commonEstates.length > 0 && !player.isTurnComplete) {
    const sellButton = createPopupButton(
      "Sell",
      displayEstates.bind(null, commonEstates)
    );
    const cancelButton = createPopupButton("Cancel", completeTurn);
    appendChildren(cardDiv, [titleDiv, messageDiv, sellButton, cancelButton]);
  }
};

const completeTurn = function() {
  hideOverlay("card");
  hideOverlay("real-estate-div");
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
  const estateDiv = getElementById("real-estate-div");
  const estateTable = createTableHtml(commonEstates);
  const doneButton = createPopupButton("Done", completeTurn);
  appendChildren(estateDiv, [estateTable, doneButton]);
  showOverlay("real-estate-div");
};

const getCardDiv = function(type) {
  const cardDiv = getElementById("card");
  cardDiv.style.visibility = "visible";
  cardDiv.innerHTML = null;
  cardDiv.classList = [];
  cardDiv.classList.add("plain-card");
  cardDiv.classList.add(type);
  return cardDiv;
};

const acceptSmallDeal = function(event) {
  let parent = event.target.parentElement;
  fetch("/acceptSmallDeal")
    .then(data => data.json())
    .then(({ isSuccessful }) => {
      if (isSuccessful) {
        parent.style.display = "none";
        return;
      }
      openOverlay("low-balance", "flex");
    });
};

const declineSmallDeal = function() {
  let parent = event.target.parentElement;
  parent.style.display = "none";
  fetch("/declineSmallDeal");
};

const acceptBigDeal = function(event) {
  fetch("/acceptBigDeal")
    .then(data => data.json())
    .then(({ isSuccessful }) => {
      if (isSuccessful) {
        let parent = event.target.parentElement;
        parent.style.display = "none";
        return;
      }
      openOverlay("low-balance", "flex");
    });
};

const declineBigDeal = function() {
  let parent = event.target.parentElement;
  parent.style.display = "none";
  fetch("/declineBigDeal");
};

const createAcceptButton = actions =>
  createButton("Accept", "button_div", "accept", "button", actions);

const createDeclineButton = actions =>
  createButton("Decline", "button_div", "reject", "button", actions);

const createCardSellButton = action =>
  createButton("Sell Card", "button_div", "sell-card", "button", action);

const createShareSellButton = function(shareCost) {
  return createButton(
    "Sell",
    "button_div",
    "sell",
    "button",
    shareForm.bind(null, sellShares, "sell", "Sell", shareCost)
  );
};

const createShareBuyButton = shareCost => {
  return createButton(
    "Buy",
    "button_div",
    "buy",
    "button",
    shareForm.bind(null, buyShares, "buy", "Buy", shareCost)
  );
};

const nothing = () => {};

const passDeal = () => closeOverlay("buttons-container");

const showNotEnoughBalance = function() {
  const shareMsg = getElementById("share-notification");
  shareMsg.innerText = "You don't have enough balance.";
};

const showInvalidShareCount = function() {
  const shareMsg = getElementById("share-notification");
  shareMsg.innerText = "You don't have enough shares.";
};

const createCardButtons = function(actions) {
  let buttons = getElementById("card-button-container");
  if (buttons == undefined) buttons = createElement("div");
  buttons.classList.add("buttons-div");
  buttons.style.display = "flex";
  buttons.id = "card-button-container";
  const accept = createAcceptButton(actions[0]);
  const decline = createDeclineButton(actions[1]);
  const sell = createCardSellButton(actions[2]);
  appendChildren(buttons, [accept, decline, sell]);
  return buttons;
};

const createRealEstateDealCard = function(actions, card, isMyTurn) {
  const { title, message, cost, mortgage, downPayment, cashflow } = card;
  const cardDisplayDiv = getElementById("cardDisplay");
  const cardDiv = getCardDiv("smallDeal");
  const titleDiv = createHeadingDiv(4, title, "card-title");
  const messageDiv = createTextDiv(message, "card-message");
  const mortgageDiv = createTextDiv(`Mortgage : ${mortgage}`);
  const costDiv = createTextDiv(`Cost : ${cost}`);
  const downPaymentDiv = createTextDiv(`Down Payment : ${downPayment}`);
  const cashflowDiv = createTextDiv(`Cashflow ${cashflow}`);
  const bottomDiv1 = createElement("div");
  const bottomDiv2 = createElement("div");
  bottomDiv1.classList.add("card-bottom");
  bottomDiv2.classList.add("card-bottom");
  appendChildren(bottomDiv1, [costDiv, cashflowDiv]);
  appendChildren(bottomDiv2, [mortgageDiv, downPaymentDiv]);
  appendChildren(cardDiv, [titleDiv, messageDiv, bottomDiv1, bottomDiv2]);
  if (isMyTurn) cardDisplayDiv.appendChild(createCardButtons(actions));
};

const createGoldSmallDeal = function(actions, card, isMyTurn) {
  const { title, message, numberOfCoins, cost } = card;
  const cardDisplayDiv = getElementById("cardDisplay");
  const cardDiv = getCardDiv("smallDeal");
  const titleDiv = createHeadingDiv(4, title, "card-title");
  const messageDiv = createTextDiv(message, "card-message");
  const numberDiv = createTextDiv(`Coins : ${numberOfCoins}`);
  const costDiv = createTextDiv(`Cost : ${cost}`);
  const bottomDiv = createElement("div");
  bottomDiv.classList.add("card-bottom");
  appendChildren(bottomDiv, [numberDiv, costDiv]);
  appendChildren(cardDiv, [titleDiv, messageDiv, bottomDiv]);
  if (isMyTurn) cardDisplayDiv.appendChild(createCardButtons(actions));
};

const createCard = function(card) {
  const { title, message, symbol, historicTradingRange, currentPrice } = card;
  const cardDiv = getCardDiv("smallDeal");
  const titleDiv = createHeadingDiv(4, title, "card-title");
  const messageDiv = createTextDiv(message, "card-message");
  const symbolDiv = createTextDiv(`Company Name : ${symbol}`);
  const rangeDiv = createTextDiv(`Range : ${historicTradingRange}`);
  const currentPriceDiv = createTextDiv(`current price : ${currentPrice}`);
  const bottomDiv = createElement("div");
  bottomDiv.classList.add("card-bottom");
  appendChildren(cardDiv, [titleDiv, messageDiv, bottomDiv]);
  appendChildren(bottomDiv, [symbolDiv, rangeDiv, currentPriceDiv]);
  return cardDiv;
};

const buyShares = function() {
  const numberOfShares = getElementById("share-count").value;
  fetch("/buyshares", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ numberOfShares })
  })
    .then(res => res.json())
    .then(({ isCapable }) => {
      if (!isCapable) return showNotEnoughBalance();
      closeOverlay("share-card");
      hideOverlay("share-background");
      closeOverlay("buttons-container");
    });
};

const sellShares = function() {
  const numberOfShares = getElementById("share-count").value;
  fetch("/sellshares", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ numberOfShares })
  })
    .then(res => res.json())
    .then(({ isCapable }) => {
      if (!isCapable) return showInvalidShareCount();
      closeOverlay("share-card");
      hideOverlay("share-background");
      closeOverlay("buttons-container");
    });
};

const shareForm = function(func, id, value, shareCost) {
  showOverlay("share-background");
  const form = getElementById("share-card");
  form.style.display = "flex";
  const input = createInput(
    "amount",
    "Enter No of Shares",
    "number",
    "share-count",
    "debt-input"
  );
  input.classList.add("textField");
  const submit = createButton(value, "form-button", id, "", func);
  const closeButton = createButton("&times;", "close");
  const message = "Enter no of shares you want to " + id;
  const msgDiv = createDiv(message, "share-notification", "debt-form-msg");
  const priceDiv = createElement("div");
  const priceVal = document.createElement("span");
  input.onkeyup = updatePrice.bind(null, shareCost);
  priceDiv.innerText = "Price:";
  priceVal.id = "shares-price";
  priceVal.innerText = "0";
  priceDiv.appendChild(priceVal);
  closeButton.onclick = hideOverlay.bind(null, "share-background");
  appendChildren(form, [closeButton, input, priceDiv, submit, msgDiv]);
};

const updatePrice = function(shareCost) {
  const priceVal = getElementById("shares-price");
  const priceInput = getElementById("share-count");
  priceVal.innerText = +priceInput.value * +shareCost;
};

const showOptions = function(isAbleToSell, shareCost) {
  const buttonDiv = getElementById("buttons-container");
  const buy = createShareBuyButton(shareCost);
  appendChildren(buttonDiv, [buy]);
  if (isAbleToSell) {
    const sell = createShareSellButton(shareCost);
    buttonDiv.appendChild(sell);
  }
};

const showBuyAndSellOptions = function(card) {
  const cardDisplayDiv = getElementById("cardDisplay");
  createCard(card);
  const buttons = getElementById("buttons-container");
  buttons.style.display = "flex";
  const buy = createShareBuyButton(card.currentPrice);
  const sell = createShareSellButton(card.currentPrice);
  const decline = createDeclineButton(declineSmallDeal);
  cardDisplayDiv.appendChild(buttons);
  appendChildren(buttons, [buy, sell, decline]);
};

const showBuyOption = function(card) {
  const cardDisplayDiv = getElementById("cardDisplay");
  createCard(card);
  const buttons = getElementById("buttons-container");
  buttons.style.display = "flex";
  const buy = createShareBuyButton(card.currentPrice);
  const decline = createDeclineButton(declineSmallDeal);
  cardDisplayDiv.appendChild(buttons);
  appendChildren(buttons, [buy, decline]);
};

const showSellOption = function(card) {
  const cardDisplayDiv = getElementById("cardDisplay");
  createCard(card);
  const buttons = getElementById("buttons-container");
  buttons.style.display = "flex";
  const sell = createShareSellButton(card.currentPrice);
  const pass = createButton("Pass", "button_div", "pass", "button", passDeal);
  appendChildren(buttons, [sell, pass]);
  cardDisplayDiv.appendChild(buttons);
};

const handleSharesSmallDeal = function(card, isMyTurn) {
  fetch("/issharepresent")
    .then(data => data.json())
    .then(({ hasShares }) => {
      if (hasShares && isMyTurn) return showBuyAndSellOptions(card);
      if (hasShares) return showSellOption(card);
      if (isMyTurn) return showBuyOption(card);
      createCard(card);
    });
};

const createMLMCard = function(actions, card, isMyTurn) {
  const { title, message, cost } = card;
  const cardDisplayDiv = getElementById("cardDisplay");
  const cardDiv = getCardDiv("smallDeal");
  const titleDiv = createHeadingDiv(4, title, "card-title");
  const messageDiv = createTextDiv(message, "card-message");
  const costDiv = createTextDiv(`Cost : ${cost}`);
  const bottomDiv = createElement("div");
  bottomDiv.classList.add("card-bottom");
  appendChildren(bottomDiv, [costDiv]);
  appendChildren(cardDiv, [titleDiv, messageDiv, bottomDiv]);
  if (isMyTurn) cardDisplayDiv.appendChild(createCardButtons(actions));
};

const getSmallDealHandler = function(card, isMyTurn) {
  const smallDealactions = [acceptSmallDeal, declineSmallDeal, createAuction];
  const dealCardTypes = {
    shares: handleSharesSmallDeal,
    goldCoins: createGoldSmallDeal.bind(null, smallDealactions),
    realEstate: createRealEstateDealCard.bind(null, smallDealactions),
    MLM: createMLMCard.bind(null, smallDealactions)
  };
  return (
    dealCardTypes[card.data.relatedTo] &&
    dealCardTypes[card.data.relatedTo].bind(null, card.data, isMyTurn)
  );
};

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
    .then(({isSuccessful}) => {
      if (isSuccessful) {
        parent.style.visibility = "hidden";
        return;
      }
      openOverlay("low-balance");
    });
};

const declineSmallDeal = function() {
  let parent = event.target.parentElement;
  parent.style.visibility = "hidden";
  fetch("/declineSmallDeal");
};

const acceptBigDeal = function(event) {
  fetch("/acceptBigDeal")
    .then(data => data.json())
    .then(({isSuccessful}) => {
      if (isSuccessful) {
        let parent = event.target.parentElement;
        parent.style.visibility = "hidden";
        return;
      }
      openOverlay("low-balance");
    });
};

const declineBigDeal = function() {
  let parent = event.target.parentElement;
  parent.style.visibility = "hidden";
  fetch("/declineBigDeal");
};

const createAcceptButton = actions =>
  createButton("Accept", "button_div", "accept", "button", actions);

const createDeclineButton = actions =>
  createButton("decline", "button_div", "reject", "button", actions);

const createSellButton = function() {
  return createButton(
    "Sell",
    "button_div",
    "sell",
    "button",
    shareForm.bind(null, sellShares, "sell", "Sell")
  );
};

const createBuyButton = () => {
  return createButton(
    "Buy",
    "button_div",
    "buy",
    "button",
    shareForm.bind(null, buyShares, "buy", "Buy")
  );
};

const nothing = () => {};

const passDeal = () => closeOverlay("buttons-container");

const showNotEnoughBalance = function() {
  alert(`you don't have enough balance`);
};

const showInvalidShareCount = function() {
  alert(`you don't have enough shares`);
};

const createCardButtons = function(actions) {
  const buttons = createElement("div");
  buttons.classList.add("buttons-div");
  const accept = createAcceptButton(actions[0]);
  const decline = createDeclineButton(actions[1]);
  appendChildren(buttons, [accept, decline]);
  return buttons;
};

const createRealEstateDealCard = function(actions, card, isMyTurn) {
  const {title, message, cost, mortgage, downPayment, cashflow} = card;
  const cardDiv = getCardDiv("smallDeal");
  const titleDiv = createTextDiv(title);
  const messageDiv = createTextDiv(message);
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
  if (isMyTurn) cardDiv.appendChild(createCardButtons(actions));
};

const createGoldSmallDeal = function(actions, card, isMyTurn) {
  const {title, message, numberOfCoins, cost} = card;
  const cardDiv = getCardDiv("smallDeal");
  const titleDiv = createTextDiv(title);
  const messageDiv = createTextDiv(message);
  const numberDiv = createTextDiv(`Coins : ${numberOfCoins}`);
  const costDiv = createTextDiv(`Cost : ${cost}`);
  const bottomDiv = createElement("div");
  bottomDiv.classList.add("card-bottom");
  appendChildren(bottomDiv, [numberDiv, costDiv]);
  appendChildren(cardDiv, [titleDiv, messageDiv, bottomDiv]);
  if (isMyTurn) cardDiv.appendChild(createCardButtons(actions));
};

const createCard = function(card) {
  const {title, message, symbol, historicTradingRange, currentPrice} = card;
  const cardDiv = getCardDiv("smallDeal");
  const titleDiv = createTextDiv(title);
  const messageDiv = createTextDiv(message);
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
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({numberOfShares})
  })
    .then(res => res.json())
    .then(({isCapable}) => {
      if (!isCapable) return showNotEnoughBalance();
      closeOverlay("share-card");
      closeOverlay("buttons-container");
    });
};

const sellShares = function() {
  const numberOfShares = getElementById("share-count").value;
  fetch("/sellshares", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({numberOfShares})
  })
    .then(res => res.json())
    .then(({isCapable}) => {
      if (!isCapable) return showInvalidShareCount();
      closeOverlay("share-card");
      closeOverlay("buttons-container");
    });
};

const shareForm = function(func, id, value) {
  const shareCard = getElementById("share-card");
  shareCard.style.display = "flex";
  const numberOfShares = createInput(
    "shareCount",
    "Enter No of shares",
    "text",
    "share-count"
  );
  const submit = createButton(value, "", id, "", func);
  appendChildren(shareCard, [numberOfShares, submit]);
};

const showOptions = function(isAbleToSell) {
  const buttonDiv = getElementById("buttons-container");
  const buy = createBuyButton();
  appendChildren(buttonDiv, [buy]);
  if (isAbleToSell) {
    const sell = createSellButton();
    buttonDiv.appendChild(sell);
  }
};

const showBuyAndSellOptions = function(card) {
  const cardDiv = createCard(card);
  const buttons = createElement("div", "buttons-container");
  buttons.classList.add("buttons-div");
  const accept = createAcceptButton(showOptions.bind(null, true));
  const decline = createDeclineButton(declineSmallDeal);
  cardDiv.appendChild(buttons);
  appendChildren(buttons, [accept, decline]);
};

const showBuyOption = function(card) {
  const cardDiv = createCard(card);
  const buttons = createElement("div", "buttons-container");
  buttons.classList.add("buttons-div");
  const accept = createAcceptButton(showOptions.bind(null, false));
  const decline = createDeclineButton(declineSmallDeal);
  cardDiv.appendChild(buttons);
  appendChildren(buttons, [accept, decline]);
};

const showSellOption = function(card) {
  const cardDiv = createCard(card);
  const buttons = createElement("div", "buttons-container");
  buttons.classList.add("buttons-div");
  const sell = createSellButton();
  const pass = createButton("Pass", "button_div", "pass", "button", passDeal);
  cardDiv.appendChild(buttons);
  appendChildren(buttons, [sell, pass]);
};

const handleSharesSmallDeal = function(card, isMyTurn) {
  fetch("/issharepresent")
    .then(data => data.json())
    .then(({hasShares}) => {
      if (hasShares && isMyTurn) return showBuyAndSellOptions(card.data);
      if (hasShares) return showSellOption(card.data);
      if (isMyTurn) return showBuyOption(card.data);
      createCard(card.data);
    });
};

const getSmallDealHandler = function(card, isMyTurn) {
  const smallDealactions = [acceptSmallDeal, declineSmallDeal];
  const dealCardTypes = {
    shares: handleSharesSmallDeal.bind(null, card, isMyTurn),
    goldCoins: createGoldSmallDeal.bind(null, smallDealactions),
    realEstate: createRealEstateDealCard.bind(null, smallDealactions)
  };
  if (card.dealDone) return nothing;
  return (
    dealCardTypes[card.data.relatedTo] &&
    dealCardTypes[card.data.relatedTo].bind(null, card.data, isMyTurn)
  );
};

const pass = function () {
  handleBid(false);
};

const updateAuction = function (currentBid, bidder) {
  const bidPrice = getElementById("bid-price");
  const currentBidder = getElementById("bidder");
  bidPrice.innerText = currentBid;
  currentBidder.innerText = bidder;
};

const handleBid = function (wantToBid) {
  let currentBid = wantToBid && getElementById("bid-value").value;
  fetch("/handlebid", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wantToBid, currentBid })
  })
    .then(data => data.json())
    .then(({ message }) => {
      getElementById("bid-notification").innerText = message;
      getElementById("bid-value").value = null;
    });
};

const bid = function () {
  handleBid(true);
};

const isSame = function (playerName) {
  return parseCookie().playerName == playerName;
};

const setAuctionFeed = function (playerName, price) {
  const currentBid = getElementById("current-bid");
  const currentBidder = getElementById("current-bidder");
  currentBid.innerText = price;
  currentBidder.innerText = playerName;
};

const isBidder = function (bidders) {
  return bidders.some(({ name }) => isSame(name));
};

const hasAuctionFeeds = function(){
  const currentBid = getElementById("current-bid");
  const currentBidder = getElementById("current-bidder");
  return currentBid.innerText != "" && currentBidder.innerText != "";
}

const joinAuction = function (game) {
  const { currentAuction } = game;
  const { present } = currentAuction;
  if (!present && hasAuctionFeeds()) return closeAuction();
  if (!present) return closeOverlay('auction-div');
  const { currentBid, host, bidder, bidders } = currentAuction.data;
  if (isSame(host.name)) {
    openOverlay("auction-form", "flex");
    setAuctionFeed(bidder.name, currentBid);
    return;
  }
  if (isBidder(bidders)) {
    openOverlay("auction-div", "flex");
    updateAuction(currentBid, bidder.name);
  }
};

const closeAuction = function () {
  setAuctionFeed("", "");
  const sellCard = getElementById("submit-base-price");
  sellCard.innerText = "Sell";
  openOverlay("auction-base-price");
  closeOverlay("auction-form");
  closeOverlay('auction-div');
}

const heldAuction = function (action) {
  const basePrice = action && getElementById("auction-base-price").value;
  fetch("/handleauction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ basePrice, action })
  })
    .then(res => res.json())
    .then(({ isAuction, basePrice, playerName }) => {
      if (!isAuction) return closeAuction();
      closeOverlay("auction-base-price");
      setAuctionFeed(playerName, basePrice);
      const sellCard = getElementById("submit-base-price");
      sellCard.onclick = heldAuction.bind(null, false);
      sellCard.innerText = "Close";
    });
};

const createAuction = function () {
  openOverlay("auction-form", "flex");
  closeOverlay("card-button-container");
  const sellCard = getElementById("submit-base-price");
  sellCard.onclick = heldAuction.bind(null, true);
};

const showPurchasedCard = function (card) {
  const { type } = card;
  const { relatedTo } = card.data;
  if ((type != "smallDeal" && type != "bigDeal") || relatedTo == "shares") return;
  const handlers = {};
  handlers.smallDeal = [acceptSmallDeal, declineSmallDeal, createAuction];
  handlers.bigDeal = [acceptBigDeal, declineBigDeal, createAuction];
  const cardDisplayDiv = getElementById("cardDisplay");
  const buttons = createCardButtons(handlers[type]);
  cardDisplayDiv.appendChild(buttons);
}
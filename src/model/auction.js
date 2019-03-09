const {
  NOT_ENOUGH_MONEY_TO_BID,
  LOW_BIDING_AMOUNT
} = require("../constant.js");

class Auction {
  constructor(host, currentPrice, bidders) {
    this.bidders = bidders.slice();
    this.host = host;
    this.bidder = host;
    this.currentBid = currentPrice;
  }

  getBidder(playerName) {
    return this.bidders.filter(({ name }) => name == playerName)[0];
  }

  setCurrentBid(amount, player) {
    const bidder = this.getBidder(player);
    if (bidder.ledgerBalance < amount) {
      bidder.setNotification("You don't have enough money to raise bid.");
      return { ableToBid: false, message: NOT_ENOUGH_MONEY_TO_BID };
    }
    if (this.currentBid >= amount) {
      return { ableToBid: false, message: LOW_BIDING_AMOUNT };
    }
    this.currentBid = amount;
    this.bidder = bidder;
    this.bidder.setNotification(`You have set the bid at ${amount}`);
    return { ableToBid: true, message: "Bid of current active card" };
  }

  passBid(player) {
    if (player == this.bidder.name)
      return { isAbleToPass: false, isAuctionClosed: false };
    this.bidders = this.bidders.filter(({ name }) => name != player);
    if (this.bidders.length <= 0)
      return { isAbleToPass: true, isAuctionClosed: true };
    return { isAbleToPass: true, isAuctionClosed: false };
  }

  sellDeal() {
    if (this.bidder.name == this.host.name) return;
    this.bidder.setNotification("You have won the auction.");
    this.bidder.deductLedgerBalance(this.currentBid);
    this.bidder.addDebitEvent(
      this.currentBid,
      " purchased the deal in auction"
    );
    this.bidder.setNotification(`You purchased the deal in ${this.currentBid}`);
    this.host.addToLedgerBalance(this.currentBid);
    this.host.setNotification(`You sold the deal in ${this.currentBid}`);
    this.host.addCreditEvent(this.currentBid, " sold deal");
  }
}

module.exports = Auction;

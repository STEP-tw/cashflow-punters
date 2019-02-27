const {NOT_ENOUGH_MONEY_TO_BID, LOW_BIDING_AMOUNT} = require("../constant.js");

class Auction {
  constructor(host, currentPrice, bidders) {
    this.bidders = bidders.slice();
    this.host = host;
    this.bidder = host;
    this.currentBid = currentPrice;
  }

  getBidder(playerName) {
    return this.bidders.filter(({name}) => name == playerName)[0];
  }

  setCurrentBid(amount, player) {
    const bidder = this.getBidder(player);
    if (bidder.ledgerBalance < amount) {
      return {ableToBid: false, message: NOT_ENOUGH_MONEY_TO_BID};
    }
    if (this.currentBid < amount) {
      this.currentBid = amount;
      this.bidder = bidder;
      return {ableToBid: true, message: "Bid of current active card"};
    }
    return {ableToBid: false, message: LOW_BIDING_AMOUNT};
  }

  passBid(player) {
    this.bidders = this.bidders.filter(({name}) => name != player);
    if (this.bidders.length == 0) return this.sellDeal();
  }

  sellDeal() {
    if (this.bidder.name != this.host.name) {
      this.bidder.deductLedgerBalance(this.currentBid);
      this.host.addToLedgerBalance(this.currentBid);
    }
    return true;
  }
}

module.exports = Auction;

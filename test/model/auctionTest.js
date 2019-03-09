const Auction = require("../../src/model/auction");
const chai = require("chai");
const sinon = require("sinon");

describe("getBidder", function() {
  it("should return bidder", function() {
    const auction = new Auction("mustakim", 100, [
      {
        name: "tilak"
      }
    ]);
    let bidder = auction.getBidder("tilak");
    chai.expect(bidder).to.eqls({ name: "tilak" });
  });
});

describe("setCurrentBid", function() {
  it("should set current bid if the bid amount is greater than previous bid and has ledger balance", function() {
    const auction = new Auction("mustakim", 100, [
      {
        name: "tilak",
        ledgerBalance: 2000,
        setNotification: sinon.spy()
      },
      { name: "shubham", ledgerBalance: 300, setNotification: sinon.spy() }
    ]);
    let bid = auction.setCurrentBid(101, "tilak");
    chai
      .expect(bid)
      .to.eql({ ableToBid: true, message: "Bid of current active card" });
  });
  it("should return low balance msg if player doesn't have enough amount to make a bid ", function() {
    const auction = new Auction("mustakim", 100, [
      {
        name: "tilak",
        ledgerBalance: 20,
        setNotification: sinon.spy()
      },
      { name: "shubham", ledgerBalance: 300, setNotification: sinon.spy() }
    ]);
    let bid = auction.setCurrentBid(101, "tilak");
    chai.expect(bid).to.eql({
      ableToBid: false,
      message: "Sorry! you don't have enough money to bid."
    });
  });
  it("should not be able to bid if the bidding amount is less than previous bid", function() {
    const auction = new Auction("mustakim", 100, [
      {
        name: "tilak",
        ledgerBalance: 2000,
        setNotification: sinon.spy()
      },
      { name: "shubham", ledgerBalance: 300, setNotification: sinon.spy() }
    ]);
    let bid = auction.setCurrentBid(50, "tilak");
    chai.expect(bid).to.eql({
      ableToBid: false,
      message: "Sorry! you have entered less money than current bid."
    });
  });
});

describe("passBid", function() {
  it("should pass the bid", function() {
    const auction = new Auction({ name: "mustakim" }, 100, [
      {
        name: "tilak",
        ledgerBalance: 2000,
        setNotification: sinon.spy()
      },
      { name: "shubham", ledgerBalance: 300, setNotification: sinon.spy() }
    ]);
    let bid = auction.passBid("shubham");
    chai.expect(bid).to.eql({ isAbleToPass: true, isAuctionClosed: false });
  });

  it("should not able to pass the bid if player is host", function() {
    const auction = new Auction({ name: "mustakim" }, 100, [
      {
        name: "tilak",
        ledgerBalance: 2000,
        setNotification: sinon.spy()
      },
      { name: "shubham", ledgerBalance: 300, setNotification: sinon.spy() }
    ]);
    let bid = auction.passBid("mustakim");
    chai.expect(bid).to.eql({ isAbleToPass: false, isAuctionClosed: false });
  });
  it("should be able to pass the bid if he is not current bidder and has multiple bidders remained in bidders stack", function() {
    const auction = new Auction({ name: "mustakim" }, 100, [
      {
        name: "tilak",
        ledgerBalance: 2000,
        setNotification: sinon.spy()
      },
      { name: "shubham", ledgerBalance: 300, setNotification: sinon.spy() },
      { name: "swapnil", ledgerBalance: 300, setNotification: sinon.spy() }
    ]);
    let bid = auction.passBid("swapnil");
    chai.expect(bid).to.eql({ isAbleToPass: true, isAuctionClosed: false });
  });
});

describe("sellDeal", function() {
  it("should sell deal to the current bidder", function() {
    const auction = new Auction(
      {
        name: "mustakim",
        ledgerBalance: 300,
        setNotification: sinon.spy(),
        addToLedgerBalance: sinon.spy(),
        addCreditEvent: amount => {
          chai.expect(amount).to.eql(101);
        }
      },
      100,
      [
        {
          name: "tilak",
          ledgerBalance: 2000,
          setNotification: sinon.spy(),
          deductLedgerBalance: sinon.spy(),
          addDebitEvent: sinon.spy()
        },
        { name: "shubham", ledgerBalance: 300, setNotification: sinon.spy() }
      ]
    );
    auction.setCurrentBid(101, "tilak");
    auction.sellDeal();
  });
});

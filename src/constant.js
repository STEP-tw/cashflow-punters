const gameSpaces = [
  "deal",
  "doodad",
  "deal",
  "charity",
  "deal",
  "payday",
  "deal",
  "market",
  "deal",
  "doodad",
  "deal",
  "downsized",
  "deal",
  "payday",
  "deal",
  "market",
  "deal",
  "doodad",
  "deal",
  "baby",
  "deal",
  "payday",
  "deal",
  "market"
];

const CHARITY_MSG =
  "You have done charity, So you can optionally use one or two dice for your next 3 turns";

const UNABLE_TO_DO_CHARITY_MSG =
  "Sorry! your ledger balance is not enough to do charity.";

const NOT_ENOUGH_MONEY_TO_BID = "Sorry! you don't have enough money to bid.";

const LOW_BIDING_AMOUNT = "Sorry! you have entered less money than current bid.";
const ESCAPE_ERROR = "As a current bidder you can't drop out from the game.";
const NOT_A_PLAYER_TO_LOAD = "Since you are not a player in this game, you can't load this game."
const NOT_A_PLAYER = "Since you are not a player in this game, you can't join this game."

module.exports = {
  gameSpaces,
  CHARITY_MSG,
  UNABLE_TO_DO_CHARITY_MSG,
  NOT_ENOUGH_MONEY_TO_BID,
  LOW_BIDING_AMOUNT,
  ESCAPE_ERROR,
  NOT_A_PLAYER_TO_LOAD,
  NOT_A_PLAYER
};

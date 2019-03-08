const isInvalidLoanAmount = amount => amount % 1000 != 0 || amount == 0;
const isBankLiability = liability => liability == "Bank Loan";

const isInvalidBankLoanAmount = function(
  { liability, liabilityPrice },
  player
) {
  return (
    (isInvalidLoanAmount(liabilityPrice) && isBankLiability(liability)) ||
    liabilityPrice > player.liabilities[liability]
  );
};

const displayPayDebtForm = function() {
  fetch("/liabilities")
    .then(res => res.json())
    .then(displayLiabilityOptions);
};

const createOptionTag = function(value) {
  const optionTag = createElement("option");
  optionTag.value = value;
  optionTag.innerText = value;
  return optionTag;
};

const appendOptions = function(parent, option) {
  const optionTag = createOptionTag(option);
  parent.appendChild(optionTag);
  return parent;
};

const displayLoanForm = function() {
  const form = getElementById("manage-debt-form");
  const input = createInput("amount", "Enter amount", "number", "debt-input");
  input.classList.add("textField");
  const loanButton = createButton("Take Loan", "form-button");
  const closeButton = createButton("&times;", "close");
  const message = "Enter amount in Multiples of 1000";
  const msgDiv = createDiv(message, "debt-form-msg-Box", "debt-form-msg");
  closeButton.onclick = hideOverlay.bind(null, "manage-debt-form");
  loanButton.id = "debt-button";
  loanButton.onclick = takeLoan;
  appendChildren(form, [closeButton, input, loanButton, msgDiv]);
};

const displayInvalidAmount = function() {
  const msgBox = getElementById("debt-form-msg-Box");
  const message = "Invalid debt amount.. Please enter valid debt amount";
  msgBox.innerHTML = message;
};

const takeLoan = function() {
  const amount = getElementById("debt-input").value;
  if (isInvalidLoanAmount(amount)) return displayInvalidAmount();
  fetch("/takeloan", {
    method: "POST",
    body: JSON.stringify({ amount }),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(updateStatementBoard)
    .then(setFinancialStatement)
    .then(setCashLedger);
  hideOverlay("manage-debt-form");
};

const getLiabilityDetails = function(player) {
  const liability = getElementById("options").value;
  const { expenses, liabilities } = player;
  const expense = `${liability} Payment`;
  let liabilityPrice = +liabilities[liability];
  let expenseAmount = expenses[expense];
  if (liability == "Bank Loan") {
    liabilityPrice = getElementById("debt-input").value;
    expenseAmount = liabilityPrice / 10;
  }
  return { liability, liabilityPrice, expense, expenseAmount };
};

const notEnoughCash = function({ liabilityPrice }, { ledgerBalance }) {
  return ledgerBalance < liabilityPrice;
};

const displayNotEnoughMoney = function() {
  const msgBox = getElementById("debt-form-msg-Box");
  const message = "You don't have enough money to pay..";
  msgBox.innerHTML = message;
  hideOverlay("debt-input");
};

const payDebt = function(player, intervalId) {
  clearInterval(intervalId);
  const liabilityDetails = getLiabilityDetails(player);
  if (isInvalidBankLoanAmount(liabilityDetails, player))
    return displayInvalidAmount();
  if (notEnoughCash(liabilityDetails, player)) return displayNotEnoughMoney();
  fetch("/paydebt", {
    method: "POST",
    body: JSON.stringify(liabilityDetails),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(updateStatementBoard)
    .then(setFinancialStatement)
    .then(setCashLedger);
  hideOverlay("manage-debt-form");
  hideOverlay("debt-input");
};

const showBankForm = function() {
  const form = getElementById("manage-debt-form");
  const closeButton = createButton("&times;", "close");
  const loanButton = createButton("Take Loan", "form-button");
  const payDebtButton = createButton("Pay Debt", "form-button");
  closeButton.onclick = hideOverlay.bind(null, "manage-debt-form");
  loanButton.onclick = displayLoanForm;
  payDebtButton.onclick = displayPayDebtForm;
  appendChildren(form, [closeButton, loanButton, payDebtButton]);
  showOverlay("manage-debt-form");
};

const getPayableLiabilities = function(playerLiabilities) {
  const payableLiabilities = {};
  const liabilitiyTitles = Object.keys(playerLiabilities);
  liabilitiyTitles.forEach(title => {
    if (playerLiabilities[title] && title != "realEstates") {
      payableLiabilities[title] = playerLiabilities[title];
    }
  });
  return Object.keys(payableLiabilities);
};

const displayLiabilityOptions = function(player) {
  const form = getElementById("manage-debt-form");
  const selectTag = createElement("select", "options");
  selectTag.className = "select-tag";
  const payableLiabilities = getPayableLiabilities(player.liabilities);
  const options = payableLiabilities.reduce(appendOptions, selectTag);
  const amountInput = createInput(
    "amount",
    "Enter amount",
    "number",
    "debt-input"
  );
  amountInput.className = "debt-input";
  const intervalId = setInterval(() => {
    const options = getElementById("options");
    if (isBankLiability(options.value)) return showOverlay("debt-input");
    hideOverlay("debt-input");
  }, 100);
  const closeButton = createButton("&times;", "close");
  closeButton.onclick = hideOverlay.bind(null, "manage-debt-form");
  amountInput.style.visibility = "hidden";
  const payButton = createButton("Pay", "form-button");
  payButton.id = "debt-button";
  const message = "Enter amount in Multiples of 1000";
  const msgDiv = createDiv(message, "debt-form-msg-Box", "debt-form-msg");
  payButton.onclick = payDebt.bind(null, player, intervalId);
  appendChildren(form, [closeButton, options, amountInput, payButton, msgDiv]);
};

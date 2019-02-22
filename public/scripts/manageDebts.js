const isInvalidLoanAmount = amount => amount % 1000 != 0;
const isBankLiability = liability => liability == "Bank Loan";

const isInvalidBankLoanAmount = function({liability, liabilityPrice}) {
  return isInvalidLoanAmount(liabilityPrice) && isBankLiability(liability);
};

const displayPayDebtForm = function() {
  const form = getElementById("manage-debt-form");
  const debtButton = getElementById("debt-button");
  debtButton.onclick = payDebt;
  debtButton.innerHTML = "Pay Debt";
  form.style.visibility = "visible";
  fetch("/liabilities")
    .then(res => res.json())
    .then(displayLiabilityOptions);
};

const displayLoanForm = function() {
  const form = getElementById("manage-debt-form");
  const debtButton = getElementById("debt-button");
  debtButton.onclick = takeLoan;
  debtButton.innerHTML = "Take Loan";
  form.style.visibility = "visible";
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

const restoreLoanForm = function() {
  const form = getElementById("manage-debt-form");
  const input = createInput("amount", "Enter amount", "number", "debt-input");
  const payButton = createButton("Pay", "debt-button");
  payButton.id = "debt-button";
  appendChildren(form, [input, payButton]);
};

const displayInvalidAmount = function() {
  const msgBox = getElementById("manage-debt-form-msg-Box");
  const message = "Invalid debt amount.. Please enter valid debt amount";
  msgBox.innerText = message;
};

const takeLoan = function() {
  const amount = getElementById("debt-input").value;
  if (isInvalidLoanAmount(amount)) return displayInvalidAmount();
  fetch("/takeloan", {
    method: "POST",
    body: JSON.stringify({amount}),
    headers: {"Content-Type": "application/json"}
  })
    .then(res => res.json())
    .then(updateStatementBoard)
    .then(setFinancialStatement);
  closeOverlay("manage-debt-form");
};

const getLiabilityDetails = function(player) {
  const liability = getElementById("options").value;
  const {expenses, liabilities} = player;
  const expense = `${liability} Payment`;
  let liabilityPrice = +liabilities[liability];
  let expenseAmount = expenses[expense];
  if (liability == "Bank Loan") {
    liabilityPrice = getElementById("debt-input").value;
    expenseAmount = liabilityPrice / 10;
  }
  return {liability, liabilityPrice, expense, expenseAmount};
};

const payDebt = function(player, intervalId) {
  clearInterval(intervalId);
  const liabilityDetails = getLiabilityDetails(player);
  if (isInvalidBankLoanAmount(liabilityDetails)) return displayInvalidAmount();
  fetch("/paydebt", {
    method: "POST",
    body: JSON.stringify(liabilityDetails),
    headers: {"Content-Type": "application/json"}
  })
    .then(res => res.json())
    .then(updateStatementBoard)
    .then(setFinancialStatement);
  closeOverlay("manage-debt-form");
  restoreLoanForm();
};

const displayLiabilityOptions = function(player) {
  const form = getElementById("manage-debt-form");
  const selectTag = createElement("select", "options");
  const liabilityTitles = Object.keys(player.liabilities);
  const options = liabilityTitles.reduce(appendOptions, selectTag);
  const amountInput = createInput(
    "amount",
    "Enter amount",
    "number",
    "debt-input"
  );
  const intervalId = setInterval(() => {
    const options = getElementById("options");
    if (isBankLiability(options.value)) return showOverlay("debt-input");
    closeOverlay("debt-input");
  }, 100);
  amountInput.style.visibility = "hidden";
  const payButton = createButton("Pay", "debt-button");
  payButton.id = "debt-button";
  payButton.onclick = payDebt.bind(null, player, intervalId);
  appendChildren(form, [options, amountInput, payButton]);
};

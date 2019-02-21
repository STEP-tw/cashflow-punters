const displayLoanForm = function() {
  const form = getElementById("manage-debt-form");
  const debtButton = getElementById("debt-button");
  debtButton.onclick = takeLoan;
  debtButton.innerHTML = "Take Loan";
  form.style.visibility = "visible";
};

const restoreLoanForm = function() {
  const form = getElementById("manage-debt-form");
  const input = createInput("amount", "Enter amount", "number", "debt-input");
  const payButton = createButton("Pay", "debt-button");
  payButton.id = "debt-button";
  appendChildren(form, [input, payButton]);
};

const payDebt = function(player, intervalId) {
  clearInterval(intervalId);
  const liability = getElementById("options").value;
  const {expenses, liabilities} = player;
  const expense = `${liability} Payment`;
  let liabilityAmount = liabilities[liability];
  let expenseAmount = expenses[expense];
  if (liability == "Bank Loan") {
    liabilityAmount = getElementById("debt-input").value;
    expenseAmount = liabilityAmount / 10;
    if (liabilityAmount % 1000 != 0) return displayInvalidAmount();
  }
  fetch("/paydebt", {
    method: "POST",
    body: JSON.stringify({liabilityAmount, liability, expense, expenseAmount}),
    headers: {"Content-Type": "application/json"}
  })
    .then(res => res.json())
    .then(updateStatementBoard)
    .then(setFinancialStatement);
  closeOverlay("manage-debt-form");
  closeOverlay("debt-input");
  restoreLoanForm();
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

const displaySelectOptions = function(player) {
  const form = getElementById("manage-debt-form");
  const selectTag = createElement("select");
  selectTag.id = "options";
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
    if (options.value == "Bank Loan") return showOverlay("debt-input");
    closeOverlay("debt-input");
  }, 100);
  amountInput.style.visibility = "hidden";
  const payButton = createButton("Pay", "debt-button");
  payButton.id = "debt-button";
  payButton.onclick = payDebt.bind(null, player, intervalId);
  appendChildren(form, [options, amountInput, payButton]);
};

const displayPayDebtForm = function() {
  const form = getElementById("manage-debt-form");
  const debtButton = getElementById("debt-button");
  debtButton.onclick = payDebt;
  debtButton.innerHTML = "Pay Debt";
  form.style.visibility = "visible";
  fetch("/liabilities")
    .then(res => res.json())
    .then(displaySelectOptions);
};

const displayInvalidAmount = function() {
  const msgBox = getElementById("manage-debt-form-msg-Box");
  const message = "Invalid debt amount.. Please enter valid debt amount";
  msgBox.innerText = message;
};

const takeLoan = function() {
  const amount = getElementById("debt-input").value;
  if (amount % 1000 != 0) return displayInvalidAmount();
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

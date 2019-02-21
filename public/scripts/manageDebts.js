const displayLoanForm = function() {
  const form = getElementById("manage-debt-form");
  const debtButton = getElementById("debt-button");
  debtButton.onclick = takeLoan;
  debtButton.innerHTML = "Take Loan";
  form.style.visibility = "visible";
};

const payDebt = function() {
  const amount = getElementById("debt-input").value;
  if (amount % 1000 != 0) return displayInvalidAmount();
  fetch("/paydebt", {
    method: "POST",
    body: JSON.stringify({amount}),
    headers: {"Content-Type": "application/json"}
  })
    .then(res => res.json())
    .then(updateStatementBoard)
    .then(setFinancialStatement);
  closeOverlay("manage-debt-form");
};

const displayPayDebtForm = function() {
  const form = getElementById("manage-debt-form");
  const debtButton = getElementById("debt-button");
  debtButton.onclick = payDebt;
  debtButton.innerHTML = "Pay Debt";
  form.style.visibility = "visible";
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

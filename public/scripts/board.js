const closeOverlay = function() {
  let closeBtn = event.target;
  let overlay = closeBtn.parentNode;
  overlay.style.visibility = "hidden";
};

const openFinancialStatement = function() {
  let fs = document.getElementById("financial_statement");
  fs.style.visibility = "visible";
};

const openCashLedger = function() {
  let fs = document.getElementById("cash_ledger");
  fs.style.visibility = "visible";
};

const rollDie = function() {
  const dice = document.getElementById("dice");
  fetch("/rolldie")
    .then(res => res.text())
    .then(number => {
      dice.innerText = number;
    });
};

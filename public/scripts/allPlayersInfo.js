const playerColours = {
  1: "rgb(237, 179, 138)",
  2: "rgb(152, 215, 116)",
  3: "rgb(228, 228, 128)",
  4: "rgb(210, 147, 237)",
  5: "rgb(130, 198, 233)",
  6: "rgb(230, 192, 192)"
};

const displayFinancialStament = function(player) {
  setFinancialStatement(player);
  showOverlay("fs_overlay");
};

const createFinancialStatmentOption = function(player) {
  const fsOption = createElement("td");
  const fsIcon = createElement("img");
  fsIcon.src = "/images/financialStatement.png";
  fsIcon.className = "other-player-Btn";
  fsIcon.onclick = displayFinancialStament.bind(null, player);
  fsOption.appendChild(fsIcon);
  return fsOption;
};

const displayCashLedger = function(player) {
  setCashLedger(player);
  showOverlay("cash-ledger-overlay");
};

const createCashLedgerOption = function(player) {
  const ledgerOption = createElement("td");
  const ledgerIcon = createElement("img");
  ledgerIcon.src = "/images/ledger.png";
  ledgerIcon.className = "other-player-Btn";
  ledgerIcon.onclick = displayCashLedger.bind(null, player);
  ledgerOption.appendChild(ledgerIcon);
  return ledgerOption;
};

const createProgressBar = function(player) {
  const progressBarContainer = createElement("td");
  const progressDiv = createElement("div");
  progressDiv.className = "progress-bar-div";
  const progressBar = createElement("div");
  progressBar.className = "current-progress";
  updateProgressBar(player, progressBar);
  progressDiv.appendChild(progressBar);
  progressBarContainer.appendChild(progressDiv);
  return progressBarContainer;
};

const createName = function(player) {
  const name = createElement("td");
  name.innerText = player.name;
  name.style.color = playerColours[player.turn];
  return name;
};

const createInfoTable = function(players) {
  const table = createElement("table");
  players.forEach(player => {
    const playerInfo = createElement("tr");
    playerInfo.appendChild(createName(player));
    playerInfo.appendChild(createProgressBar(player));
    playerInfo.appendChild(createFinancialStatmentOption(player));
    playerInfo.appendChild(createCashLedgerOption(player));
    table.appendChild(playerInfo);
  });
  return table;
};

const getProgressPercentage = function(totalExpenses, passiveIncome) {
  return (passiveIncome / totalExpenses) * 100;
};

const updateRequesterProgress = function(requester) {
  const progressBar = getElementById("progress");
  updateProgressBar(requester, progressBar);
};

const updateProgressBar = function(player, progressBar) {
  const totalExpenses = player.totalExpense;
  const passiveIncome = player.passiveIncome;
  let width = getProgressPercentage(totalExpenses, passiveIncome);
  if (width > 100) width = 100;
  progressBar.style.width = width + "%";
};

const showAllPlayerInfo = function(players, requester) {
  const playersInfoDiv = getElementById("players-information");
  const playersList = players.filter(player => player.name != requester.name);
  playersInfoDiv.innerHTML = null;
  playersInfoDiv.appendChild(createInfoTable(playersList));
  updateRequesterProgress(requester);
};

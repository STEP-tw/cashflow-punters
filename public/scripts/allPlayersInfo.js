const createFinancialStatmentOption = function(){
	const fsOption = createElement('td');
	const fsIcon = createElement('img');
	fsIcon.src = "/images/financialStatement.png";
	fsIcon.className = "other-player-Btn";
	fsOption.appendChild(fsIcon);
	return fsOption;
};

const createCashLedgerOption = function(){
	const ledgerOption = createElement('td');
	const ledgerIcon = createElement('img');
	ledgerIcon.src = "/images/ledger.png";
	ledgerIcon.className = "other-player-Btn";
	ledgerOption.appendChild(ledgerIcon);
	return ledgerOption;
};

const createProgressBar = function (player) {
	const progressBarContainer = createElement('td');
	const progressDiv = createElement('div');
	progressDiv.className = "progress-bar-div";
	const progressBar = createElement('div');
	progressBar.className = "current-progress";
	updateProgressBar(player, progressBar);
	progressDiv.appendChild(progressBar);
	progressBarContainer.appendChild(progressDiv);
	return progressBarContainer;
};

const createName = function(player) {
	const name = createElement('td');
	name.innerText = player.name;
	return name;
}

const createInfoTable = function(players) {
	const table = createElement('table');
	players.forEach(player => {
		const playerInfo = createElement("tr");
		playerInfo.appendChild(createName(player));
		playerInfo.appendChild(createProgressBar(player));
		playerInfo.appendChild(createFinancialStatmentOption());
		playerInfo.appendChild(createCashLedgerOption());
		table.appendChild(playerInfo);
	});
	return table;
};

const getProgressPercentage = function(totalExpenses, passiveIncome) {
	return (passiveIncome/totalExpenses) * 100;
};

const updateRequesterProgress = function(requester) {
	const progressBar = getElementById('progress');
	updateProgressBar(requester, progressBar);
};

const updateProgressBar = function(player, progressBar) {
	const totalExpenses = player.totalExpense;
	const passiveIncome = player.passiveIncome;
	progressBar.style.width = getProgressPercentage(totalExpenses, passiveIncome) + "%";
};

const showAllPlayerInfo = function(players, requester){
	const playersInfoDiv = getElementById("players-information");
	const playersList = players.filter(player => player.name != requester.name);
	playersInfoDiv.innerHTML = null;
	playersInfoDiv.appendChild(createInfoTable(playersList));
	updateRequesterProgress(requester);
};
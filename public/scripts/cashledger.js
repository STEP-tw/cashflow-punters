const createElementWithClass = function (data, classname) {
  const htmlElement = createElement("td");
  htmlElement.innerText = data;
  htmlElement.className = classname;
  return htmlElement;
};

const amountColor = { debit: "rgb(144, 43, 43)", credit: "rgb(66, 138, 66)" };

const createLedgerRow = function (rowContent) {
  let row = createElement("tr");
  row.className = "row-content";
  const { currentTime, event, currentAmount, currentBalance, type } = rowContent;
  let timeDiv = createElementWithClass(currentTime, "time");
  let eventDiv = createElementWithClass(event, "reason");
	let amountDiv = createElementWithClass(currentAmount, "amount");
	amountDiv.style.color = amountColor[type];
  let balance = createElementWithClass(currentBalance, "balance");
  appendChildren(row, [timeDiv, amountDiv, balance, eventDiv]);
  return row;
};

const getEntriesHtml = function (entry) {
  const { time, type, amount, currentBalance, event } = entry;
  const currentTime = formatTime(new Date(time));
  let currentAmount = amount;
  return createLedgerRow({ currentTime, event, currentAmount, currentBalance, type });
};

const setCashLedger = function (player) {
	const { entries } = player;
	const nameDiv = getElementById('name-ledger');
	nameDiv.innerText = player.name;
  const entriesDiv = getElementById("cash-ledger-content");
  const entriesHtml = entries.map(getEntriesHtml);
  appendChildren(entriesDiv, entriesHtml);
};

const showCashLedger = function () {
	fetch("/requester")
	.then(res => res.json())
	.then(player => {
		setCashLedger(player);		
		showOverlay('cash-ledger-overlay');
	});
};


const createTableRow = function (tableData) {
	let tableRow = createElement('tr');
  tableData.forEach(data => {
		let tableDataHtml = createElement('td');
		tableDataHtml.className = "tableData";
    tableDataHtml.innerText = data;
    tableRow.appendChild(tableDataHtml);
  });
  return tableRow;
};

const addEmptyRows = function (numOfRows, numOfcolumns, table) {
	let tableData = new Array(numOfcolumns).fill('');
	for(let num=0; num<numOfRows; num++){
		let row = createTableRow(tableData);
		table.appendChild(row);
	};
};

const updateTableRows = function (id, properties, minimumNoOfRows, rowData) {
  let dataDiv = getElementById(id);
	dataDiv.innerHTML = '';
  rowData.forEach(data => {
		let tableData = [data.type];
    properties.forEach(property => {
			let value = data[property];
      tableData.push(value);
    });
    let rowDataHtml = createTableRow(tableData);
		dataDiv.appendChild(rowDataHtml);
  });
	let numOfEmptyRows = minimumNoOfRows - rowData.length;
	if(numOfEmptyRows > 0){
		addEmptyRows(numOfEmptyRows, properties.length+1, dataDiv);
	};
};

const updateRealEstateAssets = updateTableRows.bind(null, "RealEstate-downpayment",["downPayment", "cost"], 4);

const updateRealEstateLiabilities = updateTableRows.bind(null, "RealEstate-mortage",["mortgage"], 4);

const updateRealEstateCashflow = updateTableRows.bind(null, "RealEstate-cashflow", ["cashflow"], 3);

const setIncome = function (player) {
  setInnerText("salary", player.income.salary);
  let realEstates = player.income.realEstates;
  updateRealEstateCashflow(realEstates);
};

const setExpenses = function (player) {
  setInnerText("taxes", player.expenses["taxes"]);
  setInnerText("home-mortage-payment", player.expenses["Home Mortgage Payment"]);
  setInnerText("school-loan-payment", player.expenses["School Loan Payment"]);
  setInnerText("car-loan-payment", player.expenses["Car Loan Payment"]);
  setInnerText("credit-card-payment", player.expenses["Credit Card Payment"]);
  setInnerText("other-expenses", player.expenses["Other Expenses"]);
  setInnerText("bank-loan-payment", player.expenses["Bank Loan Payment"]);
  setInnerText("total-child-expense", player.expenses["Child Expenses"]);
};

const updateShares = function (player) {
  let stocksDiv = getElementById('stocks-funds');
  stocksDiv.innerHTML = '';
  let stocks = player.assets.shares;
  let stockNames = Object.keys(stocks);
  stockNames.forEach(stockName => {
    let row = createElement('tr');
		let name = createElement('td');
		name.className = "tableData";
    name.innerText = stockName;
    row.appendChild(name);
		let number = createElement('td');
		number.className = "tableData";
    number.innerText = stocks[stockName]["numberOfShares"];
    row.appendChild(number);
		let price = createElement('td');
		price.className = "tableData";
    price.innerText = stocks[stockName]["currentPrice"];
    row.appendChild(price);
    stocksDiv.appendChild(row);
	});
	let numOfEmptyRows = 2 - stockNames.length;
	if(numOfEmptyRows > 0){
		addEmptyRows(numOfEmptyRows, 3, stocksDiv);
	};
};

const setAssets = function (player) {
  setInnerText("savings", player.assets.savings);
  setInnerText("gold-coin-number", player.assets.goldCoins);
  updateShares(player);
  let realEstates = player.assets.realEstates;
  updateRealEstateAssets(realEstates);
};

const setLiabilities = function (player) {
  setInnerText("home-mortage", player.liabilities["Home Mortgage"]);
  setInnerText("school-loans", player.liabilities["School Loan"]);
  setInnerText("car-loans", player.liabilities["Car Loan"]);
  setInnerText("credit-card-debt", player.liabilities["Credit Card"]);
  setInnerText("bank-loan", player.liabilities["Bank Loan"] || 0);
  let realEstates = player.liabilities.realEstates;
  updateRealEstateLiabilities(realEstates);
};

const setBasicFinancialDetails = function (player) {
  setInnerText("fs-name", player.name);
  setInnerText("fs-profession", player.profession);
  setInnerText("fs-income", player.income.salary);
  setInnerText("passive-income", player.passiveIncome);
  setInnerText("total-income", player.totalIncome);
  setInnerText("fs-expenses", player.totalExpense);
  setInnerText("fs-cashflow", player.cashflow);
}

const setFinancialStatement = function (player) {
  setBasicFinancialDetails(player);
  setIncome(player);
  setExpenses(player);
  setAssets(player);
  setLiabilities(player);
  updateStatementBoard(player);
  return player;
};

const showFinancialStatement = function() {
	fetch("/requester")
	.then(res => res.json())
	.then(player => {
		setFinancialStatement(player);	
		showOverlay('fs_overlay');
	});
};
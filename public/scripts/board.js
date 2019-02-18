const closeOverlay = function () {
  let closeBtn = event.target;
  let overlay = closeBtn.parentNode;
  overlay.style.visibility = "hidden";
};

const openFinancialStatement = function () {
  let fs = document.getElementById("financial_statement");
  fs.style.visibility = "visible";
};

const openCashLedger = function () {
  let fs = document.getElementById("cash_ledger");
  fs.style.visibility = "visible";
};

const sayHello = function() {
  let container = document.getElementById('container');
  let parent = container.parentElement;
  parent.removeChild(container);
}

const getProfessionsDiv = function (player) {
  let { name, profession, turn, gamePiece } = player;
  let mainDiv = document.createElement('div');
  let container = document.getElementById('container');
  container.className = "container";

  mainDiv.className = "details";

  let p_name = document.createElement('div');
  p_name.innerText =name;

  let p_profession = document.createElement('div');
  p_profession.innerText = profession.profession;

  let p_gamePiece = document.createElement('div');
  p_gamePiece.innerText = gamePiece;

  let p_turn = document.createElement('div');
  p_turn.innerText = turn;
  
  mainDiv.appendChild(p_name);
  mainDiv.appendChild(p_profession);
  mainDiv.appendChild(p_gamePiece);
  mainDiv.appendChild(p_turn);
  container.appendChild(mainDiv)
  return mainDiv;
}

const getProfessions = function () {
  fetch('/getPlayerProfessions').then((data) => {
    return data.json();
  }).then((content) => {
    let container = document.getElementById('container');
   content.map(getProfessionsDiv).join('');
   let button = document.createElement('button');
   button.innerText = "continue";
   button.onclick = sayHello;
   container.appendChild(button);
  })
}

window.onload = () => {
  getProfessions();
}
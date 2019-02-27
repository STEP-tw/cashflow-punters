const gamePiece = {
  1: "player1",
  2: "player2",
  3: "player3",
  4: "player4",
  5: "player5",
  6: "player6"
};

const createParagraph = function(text, classname) {
  const paragraph = document.createElement("p");
  paragraph.innerText = text;
  paragraph.className = classname;
  return paragraph;
};

const getProfessionsDiv = function(player) {
  let { name, turn, profession } = player;
  const mainDiv = createDivWithClass("professions-box ");
  const playerName = createParagraph(`Name : ${name}`, "profession-sub-header");
  const playerProfession = createParagraph(`Profession : ${profession}`);
  const playerTurn = createParagraph(`Playing Turn : ${turn}`);
  const playerGamePiece = createParagraph(``, "player" + turn);
  playerGamePiece.classList.add("center");
  appendChildren(mainDiv, [
    playerName,
    playerProfession,
    playerTurn,
    playerGamePiece
  ]);
  document.getElementById("players-info").appendChild(mainDiv);
};

const getProfessions = function() {
  fetch("/getgame")
    .then(data => data.json())
    .then(({ players }) => {
      let container = document.getElementById("profession-container");
      players.map(getProfessionsDiv).join("");
      let button = createPopupButton("continue", createFinancialStatement);
    });
};

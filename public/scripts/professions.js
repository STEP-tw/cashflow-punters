const displayProfessionCard = function({ name, turn, profession }) {
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
  getElementById("players-info").appendChild(mainDiv);
};

const createProfessionCards = function({ players }) {
  players.forEach(displayProfessionCard);
};

const getProfessions = function() {
  fetch("/getgame")
    .then(res => res.json())
    .then(createProfessionCards);
};

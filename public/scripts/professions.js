const displayProfessionCard = function({ name, turn, profession }) {
  const mainDiv = createDivWithClass("professions-box ");
  const playerName = createParagraph(`${name}`, "profession-sub-header");
  // hack
  elem = document.querySelector('.player'+turn);
  style = getComputedStyle(elem);
  color = style.backgroundColor
   //end
  mainDiv.style.backgroundColor = color;
  const playerProfession = createDetail('Profession',profession,'profession');
  appendChildren(mainDiv, [
    playerName,
    playerProfession
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

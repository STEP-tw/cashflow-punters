const updateFasttrackGamePiece = function(player) {
  if (player.currentSpace == null) return;
  const gamePiece = getElementById("gamePiece" + player.turn);
  openOverlay("gamePiece" + player.turn);
  gamePiece.classList.add("fs-game-piece");
  const space = gamePiece.parentNode;
  const newSpace = getElementById("ft-" + player.currentSpace);
  space.removeChild(gamePiece);
  newSpace.appendChild(gamePiece);
};

const displayFasttrackDiceValue = function(diceValue, count) {
  const diceDiv = getElementById("ft-dice" + count);
  diceDiv.src = `Dice-${diceValue}.png`;
  diceDiv.style.visibility = "visible";
  diceDiv.style.display = "block";
};

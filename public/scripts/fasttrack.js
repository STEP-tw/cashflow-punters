const updateFasttrackGamePiece = function(player) {
  if (player.currentSpace == null) return;
  const gamePiece = document.getElementById("gamePiece" + player.turn);
  openOverlay("gamePiece" + player.turn);
  const space = gamePiece.parentNode;
  const newSpace = document.getElementById("ft-" + (player.currentSpace+1));
  space.removeChild(gamePiece);
  newSpace.appendChild(gamePiece);
};

const displayFasttrackDiceValue = function(diceValue, count) {
  const diceDiv = getElementById("ft-dice" + count);
  diceDiv.src = `Dice-${diceValue}.png`;
  diceDiv.style.visibility = "visible";
  diceDiv.style.display = "block";
};

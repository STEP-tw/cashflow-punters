const updateFasttrackGamePiece = function(player) {
  const gamePiece = document.getElementById("gamePiece" + player.turn);
  openOverlay("gamePiece" + player.turn);
  const space = gamePiece.parentNode;
  const newSpace = document.getElementById("ft-" + player.currentSpace);
  space.removeChild(gamePiece);
  newSpace.appendChild(gamePiece);
};


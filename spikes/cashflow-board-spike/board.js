
const renderFastTrack = function() {
  const board = getElementById("board");
  board.className = null;
  void board.offsetWidth; // reflow method to trigger animation
  board.className = "rotate";
  const ratRaceBoard = getElementById("rat-race");
  ratRaceBoard.style.transform = "rotateY(180deg)";
  closeOverlay("rat-race");
  openOverlay("fasttrack");
};

const renderRatRace = function() {
  const board = getElementById("board");
  board.className = null;
  void board.offsetWidth; // reflow method to trigger animation
  board.className = "rotate";
  closeOverlay("fasttrack");
  openOverlay("rat-race");
};


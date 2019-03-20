const addToFastTrack = function() {
  closeOverlay("notify-escape");
  fetch("/addtofasttrack");
  flipBoard(180);
};

const openLeaveGame = function(){
  openOverlay("leave-game");
}

const openLeaveFtGame = function(){
  openOverlay("ft-leave-game");
}

const notifyEscape = function() {
  openOverlay("notify-escape");
  showOverlay("notify-escape");
};

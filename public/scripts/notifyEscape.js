const addToFastTrack = function() {
  closeOverlay("notify-escape");
  fetch("/addtofasttrack");
  flipBoard(180);
};

const notifyEscape = function() {
  openOverlay("notify-escape");
  showOverlay("notify-escape");
};

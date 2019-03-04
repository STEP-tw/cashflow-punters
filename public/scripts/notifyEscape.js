const addToFastTrack = function() {
  closeOverlay("notify-escape");
  fetch("/addtofasttrack");
};

const notifyEscape = function() {
  openOverlay("notify-escape");
  showOverlay("notify-escape");
};

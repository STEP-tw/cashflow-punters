const displayHostTemplate = function() {
  const optionsField = document.getElementById('gameOptionsField');
  optionsField.innerHTML = '';
  const hostingForm = document.createElement('form');
  hostingForm.action = '/hostgame';
  hostingForm.method = 'POST';
  const nameInput = document.createElement('input');
  nameInput.name = 'playerName';
  nameInput.placeholder = 'Enter Name';
  const hostButton = document.createElement('button');
  hostButton.type = 'submit';
  hostButton.innerText = 'HOST';
  hostButton.className = 'game-options';
  optionsField.appendChild(hostingForm);
  hostingForm.appendChild(nameInput);
  hostingForm.appendChild(hostButton);
};

window.onload = () => {
  const hostGameButton = document.getElementById('hostGame');
  hostGameButton.onclick = displayHostTemplate;
};

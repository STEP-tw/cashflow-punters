const createForm = function(action, method) {
  const form = document.createElement('form');
  form.action = action;
  form.method = method;
  return form;
};

const createInput = function(name, placeholder, type) {
  const input = document.createElement('input');
  input.placeholder = placeholder;
  input.name = name;
  input.type = type;
  return input;
};

const createButton = function(value, classname, type) {
  const button = document.createElement('button');
  button.innerText = value;
  button.className = classname;
  button.type = type;
  return button;
};

const appendChildren = function(parentElement, childrenElements) {
  parentElement.innerHTML = '';
  childrenElements.forEach(function(child) {
    parentElement.appendChild(child);
  });
};

const getElementById = function(id) {
  return document.getElementById(id);
};

const createElement = function(tag) {
  return document.createElement(tag);
};

const createForm = function(action, method) {
  const form = createElement("form");
  form.action = action;
  form.method = method;
  return form;
};

const createInput = function(name, placeholder, type, id) {
  const input = createElement("input");
  input.placeholder = placeholder;
  input.id = id;
  input.name = name;
  input.type = type;
  return input;
};

const createButton = function(value, classname, type) {
  const button = createElement("button");
  button.innerText = value;
  button.className = classname;
  button.type = type;
  return button;
};

const appendChildren = function(parentElement, childrenElements) {
  parentElement.innerHTML = "";
  childrenElements.forEach(function(child) {
    parentElement.appendChild(child);
  });
  return parentElement;
};

const createDiv = function(text) {
  let div = createElement("div");
  div.innerText = text;
  return div;
};

const createDivWithClass = function(classname) {
  let div = createElement("div");
  div.className = classname;
  return div;
};

const createPopupButton = function(text, func) {
  let button = createElement("button");
  button.innerText = text;
  button.onclick = func;
  return button;
};

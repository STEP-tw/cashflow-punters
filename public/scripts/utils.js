const getElementById = function(id) {
  return document.getElementById(id);
};

const setInnerText = function(id, text) {
  return (getElementById(id).innerHTML = text);
};

const createElement = function(tag, id) {
  const element = document.createElement(tag);
  element.id = id;
  return element;
};

const createPara = function(values) {
  const keys = Object.keys(values);
  return keys.map(key => `<p>${key} : ${values[key]}`).join("");
};

const createForm = function(action, method) {
  const form = createElement("form");
  form.action = action;
  form.method = method;
  return form;
};

const createInput = function(name, placeholder, type, id) {
  const input = createElement("input", id);
  input.placeholder = placeholder;
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

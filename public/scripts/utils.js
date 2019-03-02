const getElementById = function(id) {
  return document.getElementById(id);
};

const setInnerText = function(id, text) {
  return (getElementById(id).innerText = text);
};

const createElement = function(tag, id) {
  const element = document.createElement(tag);
  element.id = id;
  return element;
};

const showRealEstate = function(realEstate) {
  realEstate => {
    return Object.keys(realEstate)
      .map(key => `<p>${key} : ${realEstate[key]}`)
      .join("");
  };
};

const createPara = function(values) {
  const keys = Object.keys(values);
  const a = keys
    .map(key => {
      if (key == "realEstates") {
        return values[key].map(showRealEstate).join("");
      }
      return `<p>${key} : ${values[key]}`;
    })
    .join("");
  return a;
};

const createForm = function(action, method, className) {
  const form = createElement("form");
  form.action = action;
  form.method = method;
  form.className = className;
  return form;
};

const createInput = function(name, placeholder, type, id, className) {
  const input = createElement("input", id);
  input.placeholder = placeholder;
  input.name = name;
  input.type = type;
  input.className = className;
  return input;
};

const parseCookie = function() {
  const cookie = document.cookie;
  const keyValuePairs = cookie.split("; ");
  const parsedCookie = {};
  keyValuePairs.forEach(keyValue => {
    const [key, value] = keyValue.split("=");
    parsedCookie[decodeURI(key)] = decodeURI(value);
  });
  return parsedCookie;
};

const createButton = function(value, classname, id, type, func) {
  const button = createElement("button");
  button.innerHTML = value;
  button.className = classname;
  button.id = id;
  button.type = type;
  button.onclick = func;
  return button;
};

const appendChildren = function(parentElement, childrenElements) {
  parentElement.innerHTML = "";
  childrenElements.forEach(function(child) {
    parentElement.appendChild(child);
  });
  return parentElement;
};

const createDiv = function(text, id, className) {
  const div = createElement("div");
  div.id = id;
  div.className = className;
  div.innerHTML = text;
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
  button.className = "continue-button";
  button.onclick = func;
  return button;
};

const formatTime = function(date) {
  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: false
  });
};

const hideOverlay = function(id) {
  const element = getElementById(id);
  element.style.visibility = "hidden";
};

const closeOverlay = function(id) {
  const element = getElementById(id);
  element.style.display = "none";
};

const openOverlay = function(id, displayType = "block") {
  const element = getElementById(id);
  element.style.display = displayType;
};

const showOverlay = function(id) {
  const element = getElementById(id);
  element.style.visibility = "visible";
};

const createTextDiv = function(text, id) {
  const textDiv = document.createElement("div");
  const textPara = document.createElement("p");
  textPara.innerText = text;
  textPara.id = id;
  textDiv.appendChild(textPara);
  return textDiv;
};

const createHeadingDiv = function(headingNum, text, id) {
  const textDiv = document.createElement("div");
  const heading = document.createElement("h" + headingNum);
  heading.innerText = text;
  heading.id = id;
  textDiv.appendChild(heading);
  return textDiv;
};

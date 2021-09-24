const input = document.querySelector("#toDo");

let itemsStorage = [];

const item = {
  id: "",
  text: "",
  currentState: "",
};

function createStorageItem(text, id) {
  let newItem = Object.create(item);
  newItem.id = id;
  newItem.text = text;
  newItem.currentState = "active";
  itemsStorage.push(newItem);
  localStorage.setObject(`ID ${id}`, newItem);
}

function createItem(text, id) {
  let newItem = document.createElement("div");
  newItem.classList.add("list__item");
  newItem.classList.add("active");
  newItem.setAttribute(`draggable`, `true`);
  newItem.setAttribute("id", `${id}`);
  newItem.innerHTML = `<div class="check${id} checkbox test"></div><h2 class="check${id}">${text}</h2><div id="cross${id}" class="del__cross"></div>`;
  document.getElementById("container__todo").appendChild(newItem);
  newItem.addEventListener("dragstart", () => {
    newItem.classList.add("dragging");
  });

  newItem.addEventListener("dragend", () => {
    newItem.classList.remove("dragging");
  });
  listenForCheck(newItem, id);
  removeItem(id);
}
function listenForCheck(item, id) {
  let check = document.querySelectorAll(`.check${id}`);
  check.forEach((element) => {
    element.addEventListener("click", () => {
      let ite = itemsStorage.find((obj) => {
        return obj.id === id;
      });
      if (item.currentState === "active") {
        item.currentState = "completed";
        ite.currentState = "completed";
        item.classList.add("completed");
        item.classList.remove("active");
        localStorage.setObject(`ID ${id}`, ite);
        item.childNodes[0].classList.add("checkImg");
        item.childNodes[1].classList.add("line__through");
      } else {
        item.currentState = "active";
        ite.currentState = "active";
        item.classList.remove("completed");
        item.classList.add("active");
        localStorage.setObject(`ID ${id}`, ite);
        item.childNodes[0].classList.remove("checkImg");
        item.childNodes[1].classList.remove("line__through");
      }
      itemsLeft();
    });
  });
}
const leftCount = document.querySelector(".no__items");

function itemsLeft() {
  let count = 0;
  itemsStorage.forEach((el) => {
    if (el.currentState === "active") count++;
  });
  leftCount.innerHTML = count;
}

function removeItem(id) {
  document.getElementById(`cross${id}`).addEventListener("click", () => {
    delItem(id);
    itemsLeft();
  });
}

function delItem(id) {
  let it = itemsStorage.find((obj) => {
    return obj.id === id;
  });
  itemsStorage.splice(
    itemsStorage.findIndex((item) => item === it),
    1
  );

  document.getElementById(`${id}`).remove();
  localStorage.removeItem(`ID ${id}`);
}
const clearButton = document.querySelector(".btn__clear");

clearButton.addEventListener("click", () => {
  const items = document.querySelectorAll(".list__item");
  items.forEach((item) => {
    if (item.classList.contains("completed")) {
      delItem(item.id);
    }
  });
});

let idCount = 0;

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (input.value.replaceAll(" ", "") === "") {
      e.preventDefault();
      console.log("Text not provided");
    } else {
      createItem(input.value, idCount);
      createStorageItem(input.value, idCount);
      input.value = "";
      idCount++;
      localStorage.setObject(`ID count`, idCount);
    }
    itemsLeft();
  }
});

const radio = document.querySelectorAll(".display__radio");
const radioLabel = document.querySelectorAll(".radio__label");

radioLabel.forEach((label) => {
  label.addEventListener("click", (e) => {
    const items = document.querySelectorAll(".list__item");

    if (e.target.innerHTML === "Completed") {
      showCompleted(items);
    } else if (e.target.innerHTML === "Active") {
      showActive(items);
    } else {
      showAll(items);
    }
  });
});

function showActive(items) {
  items.forEach((item) => {
    if (item.classList.contains("completed")) item.classList.add("hidden");
    if (!item.classList.contains("completed")) item.classList.remove("hidden");
  });
}
function showCompleted(items) {
  items.forEach((item) => {
    if (item.classList.contains("list__item")) item.classList.remove("hidden");
    if (item.classList.contains("active")) item.classList.add("hidden");
  });
}
function showAll(items) {
  items.forEach((item) => {
    item.classList.remove("hidden");
  });
}

// functions that make it easier to create localStorage elements
Storage.prototype.setObject = function (key, value) {
  this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function (key) {
  var value = this.getItem(key);
  return value && JSON.parse(value);
};

function siteInit() {
  localStorage.getObject(`ID count`) === null ? (idCount = 0) : (idCount = localStorage.getObject(`ID count`));
  if (localStorage.length === 1) localStorage.setObject(`ID count`, 0);
  for (let i = 0; i < localStorage.getObject(`ID count`); i++) {
    if (localStorage.getObject(`ID ${i}`) !== null) {
      let item = localStorage.getObject(`ID ${i}`);
      createItemFromStorage(item.text, item.id, item.currentState);
      createStorageItemFromStorage(item.text, item.id, item.currentState);
    }
  }
  itemsLeft();
}
function createItemFromStorage(text, id, state) {
  let newItem = document.createElement("div");
  newItem.classList.add("list__item");
  newItem.classList.add(state);
  newItem.setAttribute("id", `${id}`);
  newItem.setAttribute(`draggable`, `true`);
  let isCompleted = "";
  state === "completed" ? (isCompleted = "line__through") : (isCompleted = "");
  let img = "";
  state === "completed" ? (img = "checkImg") : (img = "");
  newItem.innerHTML = `<div class="check${id} checkbox ${img}"></div><h2 class="check${id} ${isCompleted}">${text}</h2><div id="cross${id}" class="del__cross"></div>`;
  document.getElementById("container__todo").appendChild(newItem);
  newItem.addEventListener("dragstart", () => {
    newItem.classList.add("dragging");
  });

  newItem.addEventListener("dragend", () => {
    newItem.classList.remove("dragging");
  });
  listenForCheck(newItem, id);
  removeItem(id);
}

function createStorageItemFromStorage(text, id, state) {
  let newItem = Object.create(item);
  newItem.id = id;
  newItem.text = text;
  newItem.currentState = state;
  itemsStorage.push(newItem);
  localStorage.setObject(`ID ${id}`, newItem);
}

siteInit();

// drag & drop
const container = document.getElementById("container__todo");

container.addEventListener("dragover", (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(container, e.clientY);
  const draggable = document.querySelector(".dragging");
  if (afterElement == null) {
    container.appendChild(draggable);
  } else {
    container.insertBefore(draggable, afterElement);
  }
  container.getAttribute("height");
});

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll(".list__item:not(.dragging)")];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

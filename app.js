// ****** SELECT ITEMS **********
const alertWarn = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");
// edit option
let editElement;
let editFlag = false;
let editId = "";
// ****** EVENT LISTENERS **********
// submit form
form.addEventListener("submit", addItem);
// clear items
clearBtn.addEventListener("click", clearItems);
// load items
window.addEventListener("DOMContentLoaded", setUpItems);

// ****** FUNCTIONS **********
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();
  console.log(id);
  if (value && !editFlag) {
    createListItem(id, value);
    container.classList.add("show-container");
    // display alert
    displayAlert(`${value} added to the list`, "success");
    // add to local storage
    addToLocaleStorage(id, value);
    // set back to default
    setBackTodefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value changed", "success");
    // edit local storage
    editLocalStorage(editId, value);
    setBackTodefault();
  } else {
    displayAlert("Please enter value", "danger");
  }
}
// display alert
function displayAlert(text, action) {
  alertWarn.textContent = text;
  alertWarn.classList.add(`alert-${action}`);
  //   remove alert
  setTimeout(() => {
    alertWarn.textContent = "";
    alertWarn.classList.remove(`alert-${action}`);
  }, 1000);
}
// clear items
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  //   console.log(items);
  if (items.length > 0) {
    items.forEach((item) => {
      console.log(item);
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackTodefault();
  localStorage.removeItem("list");
}
// edit function
function editButton(e) {
  const element = e.currentTarget.parentElement.parentElement;
  //   set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  console.log(editElement);

  //   set form value
  grocery.value = editElement.innerHTML;
  console.log(grocery.value);
  editFlag = true;
  editId = element.dataset.id;
  submitBtn.textContent = "edit";
}
// delete function
function deleteButton(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert(`item removed`, `danger`);
  setBackTodefault();
  //   remove from local storage
  removeFromLocalStorage(id);
}
// set back to default
function setBackTodefault() {
  grocery.value = "";
  editFlag = false;
  editId = "";
  submitBtn.textContent = "submit";
}
// ****** LOCAL STORAGE **********
function addToLocaleStorage(id, value) {
  const grocery = { id: id, value: value };
  let items = getLocalStorage();
  console.log(items);
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
  console.log("added to local storage");
}
function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter((item) => {
    if (item.id !== id) {
      return items;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
// loaclaStorage API
// setItem
// getItem
// removeItem
// save as strings
// localStorage.setItem("orange", JSON.stringify(["item1", "item2"]));
// const oranges = JSON.parse(localStorage.getItem("orange"));
// console.log(oranges);
// localStorage.removeItem("orange");

// ****** SETUP ITEMS **********
function setUpItems() {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}
function createListItem(id, value) {
  const element = document.createElement("article");
  //   add class
  element.classList.add("grocery-item");
  // add id
  const atrr = document.createAttribute("data-id");
  atrr.value = id;
  element.setAttributeNode(atrr);
  element.innerHTML = `<p class="title">${value}</p>
              <div class="btn-container">
                <button class="edit-btn">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn">
                  <i class="fas fa-trash"></i>
                </button>
              </div>`;
  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");
  console.log(deleteBtn);
  deleteBtn.addEventListener("click", deleteButton);
  editBtn.addEventListener("click", editButton);
  //   append child
  list.appendChild(element);
}

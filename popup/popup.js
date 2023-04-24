import {
  getHost,
  retrieveHostParamsData,
  setHostParamsData,
  updateTabUrl,
  getUrl,
} from "../utils.js";

// Renders the host params table.
function renderTable() {
  if (Object.keys(queryParams).length > 0) {
    tableBody.innerHTML = "";
    Object.entries(queryParams).forEach(([key, value]) => {
      tableBody.innerHTML += `<tr><th scope="row">${key}</th><td>${value}</td><td><button id="delete-button" data-key="${key}" class="btn btn-danger btn-sm">Delete</button></td></tr>`;
    });

    clearButton.style.display = "block";
    table.style.display = "table";
  } else {
    clearButton.style.display = "none";
    table.style.display = "none";
  }
}

async function updateTable() {
  await setHostParamsData(host, queryParams);
  await updateTabUrl(await getUrl());

  renderTable();
}

// Adds a new query parameter
async function submitParamsForm(event) {
  let key = document.getElementById("key").value;
  let value = document.getElementById("value").value;
  queryParams[key] = value;

  updateTable();

  event.preventDefault();
}

// Removes all params from current host.
function clear() {
  queryParams = {};

  updateTable();
}

// Loading the stored data from local storage.
async function loadInitialData() {
  host = await getHost();
  queryParams = await retrieveHostParamsData(host);
  renderTable();
}

// Deletes a key value pair on button click.
async function removeParam(event) {
  if (event.target.id === "delete-button") {
    const key = event.target.dataset.key;

    delete queryParams[key];

    updateTable();
  }
}

// Stores the hostname of the currently active tab.
let host = ""; // Set in `loadInitialData()`

chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  let url = new URL(tabs[0].url);
  host = url.host;
});

const form = document.getElementById("query-params-form");
form.addEventListener("submit", submitParamsForm);

// const table = document.getElementById("params-table");
const table = document.getElementsByTagName("table")[0];
const tableBody = document.getElementsByTagName("tbody")[0];

const clearButton = document.getElementById("clear-button");
clearButton.addEventListener("click", clear);

// Add listener to table for delete buttons
tableBody.addEventListener("click", removeParam);

let queryParams = {};

loadInitialData();

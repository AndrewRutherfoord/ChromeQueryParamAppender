import {
  getHost,
  retrieveHostParamsData,
  setHostParamsData,
  updateTabUrl,
  getUrl,
} from "../utils.js";

function renderTable() {
  let paramsListHtml = "";
  Object.entries(paramsData).forEach(([key, value]) => {
    paramsListHtml += `<tr><th scope="row">${key}</th><td>${value}</td></tr>`;
  });

  if (Object.keys(queryParams).length > 0) {
    paramsTable.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Key</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
          <tbody id="paramsTableBody">
            ${paramsListHtml}
          </tbody>
      </table>
    `;
    clearButton.style.display = "block";
  }
}

async function storeParamsData() {
  await setHostParamsData(host, queryParams);
}

async function submitParamsForm(event) {
  let key = document.getElementById("key").value;
  let value = document.getElementById("value").value;
  queryParams[key] = value;

  await storeParamsData();
  await updateTabUrl(await getUrl());

  renderTable();

  event.preventDefault();
}

function clear() {
  queryParams = {};
  storeParamsData();

  paramsTable.innerHTML = ``;
  clearButton.style.display = "none";
}

async function loadInitialData() {
  host = await getHost();
  queryParams = await retrieveHostParamsData(host);
  console.log(JSON.stringify(queryParams));
  renderTable();
}

let host = "";

chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  let url = new URL(tabs[0].url);
  host = url.host;
});

const form = document.getElementById("query-params-form");
form.addEventListener("submit", submitParamsForm);

const paramsTable = document.getElementById("table");

const clearButton = document.getElementById("clear-button");
clearButton.addEventListener("click", clear);
clearButton.style.display = "none";

let queryParams = {};

loadInitialData();

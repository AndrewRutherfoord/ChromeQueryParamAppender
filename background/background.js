import { updateTabUrl } from "../utils.js";

// Every time the tab is updated, update the URL with the query params
async function onTabChange(id, changeInfo, tab) {
  if (changeInfo.url) {
    updateTabUrl(changeInfo.url);
  }
}

chrome.tabs.onUpdated.addListener(onTabChange);

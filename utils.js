export async function retrieveParamsData() {
  let data = await chrome.storage.local.get(["queryParameterAppender"]);
  return data.queryParameterAppender ? data.queryParameterAppender : {};
}

export async function setParamsData(data) {
  chrome.storage.local.set({ queryParameterAppender: data });
}

export async function retrieveHostParamsData(host) {
  let data = await retrieveParamsData();
  return data[host] ? data[host] : {};
}

export async function setHostParamsData(host, data) {
  let result = await retrieveParamsData();
  result[host] = data;
  setParamsData(result);
}

// Get the host of the active tab (if url https://example.com/test, host is example.com)
export async function getHost() {
  let urlStr = await getUrl();
  let url = new URL(urlStr);
  return url.host;
}

// Gets the full url for the active tab
export async function getUrl() {
  let tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  return tabs[0].url;
}

// Updates the url of the active tab with url that has query params appended
export async function updateTabUrl(urlStr) {
  let url = new URL(urlStr);
  let params = new URLSearchParams(url.search);

  // Retrieve params from local storage
  let paramsData = await retrieveHostParamsData(url.host);
  console.log(paramsData);

  Object.entries(paramsData).forEach(([key, value]) => {
    if (!params.has(key)) {
      params.set(key, value);
    }
  });

  url.search = params.toString();

  let newUrl = url.toString();

  if (urlStr !== newUrl) {
    chrome.tabs.update(undefined, { url: newUrl });
  }
}

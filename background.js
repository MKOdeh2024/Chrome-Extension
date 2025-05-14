chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "saveUrl") {
    const url = request.url;
    chrome.storage.local.get("savedUrls", function (result) {
      const savedUrls = result.savedUrls || [];
      savedUrls.push(url);
      chrome.storage.local.set({ savedUrls: savedUrls });
      chrome.runtime.sendMessage({ action: "updateSavedUrls", savedUrls: savedUrls });
    });
  } else if (request.action === "saveTab") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      const tabData = {
        title: tab.title,
        url: tab.url,
        favicon: tab.favIconUrl,
      };
      chrome.storage.local.set({ tab: tabData });
      chrome.runtime.sendMessage({ action: "updateSavedUrls", savedUrls: [tab.url] });
    });
  } else if (request.action === "deleteAll") {
    chrome.storage.local.clear();
    chrome.runtime.sendMessage({ action: "updateSavedUrls", savedUrls: [] });
 
    } else if (request.action === "getSavedUrls") {
      chrome.storage.local.get("savedUrls", function (result) {
        const savedUrls = result.savedUrls || [];
        chrome.runtime.sendMessage({ action: "updateSavedUrls", savedUrls: savedUrls });
      });
    }
  });
  
  chrome.storage.onChanged.addListener(function (changes, areaName) {
    if (areaName === "local" && changes.savedUrls) {
      const savedUrls = changes.savedUrls.newValue;
      chrome.runtime.sendMessage({ action: "updateSavedUrls", savedUrls: savedUrls });
    }
  });
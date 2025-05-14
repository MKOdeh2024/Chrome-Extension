document.addEventListener("DOMContentLoaded", function () {
  const saveUrlBtn = document.getElementById("save-url-btn");
  const saveTabBtn = document.getElementById("save-tab-btn");
  const deleteAllBtn = document.getElementById("delete-all-btn");
  const urlInput = document.getElementById("url-input");
  const savedUrlsList = document.getElementById("saved-urls-list");
  const myLeads = [];

  saveUrlBtn.addEventListener("click", function () {
    const url = urlInput.value.trim();
    if (url) {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.textContent = url;
        link.href = url;
        link.target = "_blank"; // Open link in new tab
        li.appendChild(link);
        savedUrlsList.appendChild(li);
        myLeads.push(url);
        urlInput.value = ""; // Clear the input field
    }
    chrome.runtime.sendMessage({ action: "saveUrl", url: url });
  });

  saveTabBtn.addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "saveTab" });
  });

  deleteAllBtn.addEventListener("click", function () {
    myLeads.length = 0;
    savedUrlsList.innerHTML = "";
    chrome.runtime.sendMessage({ action: "deleteAll" });
  });

  chrome.runtime.sendMessage({ action: "getSavedUrls" });

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "updateSavedUrls") {
      const savedUrls = request.savedUrls;
      savedUrlsList.innerHTML = "";
      savedUrls.forEach(function (url) {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = url;
        link.textContent = url;
        link.target = "_blank"; // Open link in new tab
        li.appendChild(link);
        savedUrlsList.appendChild(li);
      });
    }
  });
});
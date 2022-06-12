chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var activeTab = tabs[0];
  if (activeTab && activeTab.url.includes("https://www.swiggy.com")) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { message: "disable_text" },
      function (response) {
        if (response?.message === "not_logged_in") {
          document.getElementById("link").disabled = true;
        }
      }
    );
  } else {
    document.getElementById("link").disabled = true;
  }
});

document.getElementById("link").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { message: "search_account" },
      function (response) {
        console.log({ response });
        if (response.message === "found_account") {
          document.getElementById("show-total").innerText = "Loading...";
        }
      }
    );
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.totalMoney >= 0) {
    document.getElementById("show-total").innerText = request.totalMoney;
  }
});
// storage checking
chrome.storage.local.get("totalMoney", function (result) {
  document.getElementById("lastChecked").innerText = `₹ ${result?.totalMoney || 0}`;
})
chrome.storage.local.get("topFiveArr", function (result) {
  if (Array.isArray(result?.topFiveArr)) {
    createFavItems(result.topFiveArr);
    document.getElementById("notFoundInfo").style.display = "none";
  }
})

// chrome apis
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var activeTab = tabs[0];
  if (activeTab && activeTab.url.includes("https://www.swiggy.com")) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { message: "disable_text" },
      function (response) {
        if (response?.message === "not_logged_in") {
          document.getElementById("link").disabled = true;
        } else if (response?.message === "logged_in") {
          document.getElementById("instructions").style.display = "none";
        }
      }
    );
  } else {
    document.getElementById("link").disabled = true;
  }
  document.getElementById("dropHead").style.opacity = 0.5;
  document.getElementById("dropHead").style.cursor = "not-allowed";
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.totalMoney >= 0) {
    document.getElementById("loader").style.display = "none";
    document.getElementById("show-total").innerText = `₹ ${request.totalMoney}`;
    document.getElementById("years").innerText = "";
    appendDropdownOption(request.yearObj);
    document.getElementsByClassName("dish-list")[0].innerText = "";
    createFavItems(request.topFiveArr);
    document.getElementById("link").disabled = false;
    document.getElementById("dropHead").style.opacity = 1;
    document.getElementById("dropHead").style.cursor = "pointer";
  }
});

// Events
document.getElementById("link").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { message: "search_account" },
      function (response) {
        if (response?.message === "found_account") {
          document.getElementById("link").disabled = true;
          document.getElementById("loader").style.display = "block";
          document.getElementById("show-total").innerText = "";
        }
      }
    );
  });
});
document.getElementById("years").addEventListener("click", (event) => {
  const val = event.target.value;
  chrome.storage.local.get("yearObj", function (result) {
    document.getElementById("show-total").innerText = `₹ ${result.yearObj[val]}`;
    document.getElementById("years").style.display = "none";
    document.getElementById("dropHead").innerHTML = `${val} &#9660;`;
  });
})
document.getElementById("dropHead").addEventListener("click", () => {
  if (document.getElementById("years").style.display === "none" || document.getElementById("years").style.display === "") {
    document.getElementById("years").style.display = "block";
  } else {
    document.getElementById("years").style.display = "none";
  }
})

// common functions
function appendDropdownOption(obj) {
  Object.keys(obj).reverse().forEach((key) => {
    const div = document.createElement("div");
    div.value = key;
    div.innerText = key;
    document.getElementById("years").appendChild(div);
  })
}
function createFavItems(arr) {
  arr.forEach((dish, index) => {
    const divEl = document.createElement("div");
    if (index !== 0) {
      divEl.innerText = `${index + 1}: ${dish}`;
    } else {
      divEl.innerHTML = `${index + 1}: ${dish} &#127942`;
    }
    document.getElementsByClassName("dish-list")[0].appendChild(divEl);
  })
}
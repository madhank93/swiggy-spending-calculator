function getClickMoreButton() {
  const list = document.getElementsByTagName("div");
  for (let i = 0; i < list.length; i++) {
    if (list[i].textContent === "Show More Orders") {
      return list[i];
    }
  }
}
function clickMore(prevNum, el) {
  const currentNum = document.getElementsByTagName("div").length;
  if (currentNum !== prevNum && el.textContent === "Show More Orders") {
    el.click();
    setTimeout(() => {
      clickMore(currentNum, el);
    }, 600);
  } else {
    let totalMoney = 0;
    const list = document.getElementsByClassName("_3Hghg");
    for (let i = 0; i < list.length; i++) {
      totalMoney += Number(list[i].innerText);
    }
    chrome.runtime.sendMessage({ totalMoney: totalMoney });
    return;
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "disable_text") {
    const token = document.cookie.split(';').find(el => el === " _is_logged_in=1");
    if (token) {
      sendResponse({ message: "logged_in" });
    } else {
      sendResponse({ message: "not_logged_in" });
    }
  }

  if (request.message === "search_account") {
    const list = document.getElementsByTagName("a");
    for (let i = 0; i < list.length; i++) {
      if (list[i].href === "https://www.swiggy.com/my-account") {
        sendResponse({ message: "found_account" });
        list[i].click();
        setTimeout(() => {
          const el = getClickMoreButton();
          clickMore(1, el);
        }, 1000);
      }
    }
    sendResponse({ message: "not_found_account" });
  }
});

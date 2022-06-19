function timer(num) {
  const el = document.getElementsByClassName("_2pWZz")[0];
  setTimeout(() => {
    if(el.textContent === "Loading...") {
      timer(num);
    } else {
      clickMore(num);
    }
  }, 100);
}

function getYear(str) {
  return str.split("|")[1].trim().split(",")[2].trim();
}

function clickMore(prevNum) {
  const el = document.getElementsByClassName("_2pWZz")[0];
  const currentNum = document.getElementsByTagName("div").length;
  if (currentNum !== prevNum && el.textContent === "Show More Orders") {
    el.click();
    timer(currentNum);
  } else {
    let totalMoney = 0;
    const list = document.getElementsByClassName("_3Hghg");
    const yearEl = document.getElementsByClassName("_2uT6l");
    const dishEl = document.getElementsByClassName("nRCg_");
    let max = 0;
    const yearObj = {};
    const favDishObj = {};
    let topFiveArr = [];

    for (let i = 0; i < list.length; i++) {
      const year = getYear(yearEl[i].textContent);
      const dish = dishEl[i].textContent.split(',');

      if(yearObj[year]) {
        yearObj[year] += Number(list[i].innerText)
      } else {
        yearObj[year] = Number(list[i].innerText)
      }

      for(let j=0; j<dish.length; j++) {
        const dishName = dish[j].trim().split('x').map(el => el.trim());
        const key = dishName[0].split("(")[0].trim();
        if(favDishObj[key]) {
          favDishObj[key] += Number(dishName[1]);
        } else {
          favDishObj[key] = Number(dishName[1]);
        }

        if(favDishObj[key] > max) {
          max = favDishObj[key];
        }
      }

      totalMoney += Number(list[i].innerText);
    }

    const dishesArr = [];
    for(let key in favDishObj) {
      dishesArr.push({[key]: favDishObj[key]});
    }
    dishesArr.sort((a,b) => {
      return Object.values(b)[0] - Object.values(a)[0]
    }).slice(0,5).map(el => topFiveArr.push(Object.keys(el)[0]));

    yearObj['Total'] = totalMoney;
    chrome.storage.local.set({totalMoney, yearObj, topFiveArr});
    chrome.runtime.sendMessage({totalMoney, yearObj, topFiveArr});
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
          clickMore(1);
        }, 1000);
      }
    }
    sendResponse({ message: "not_found_account" });
  }
});

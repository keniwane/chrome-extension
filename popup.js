let url = chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let currentTab = tabs[0];
    console.log(currentTab.url);
    return currentTab.url
})

let ur = document.createElement('div')
ur.innerText = currentTab.url
document.getElementById(body).appendChild(url)

    // Use the URL to make your API call here
    ;
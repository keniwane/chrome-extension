chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let currentTab = tabs[0];
    console.log(currentTab.url);
    let url = currentTab.url


    let test = document.createElement('div')
    test.innerText = url
    document.body.appendChild(test)

})



    // Use the URL to make your API call here

// chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     const currentTab = tabs[0];
//     const domain = new URL(currentTab.url).hostname;
//     console.log("Sending message for tab:", currentTab, "Domain:", domain);

//     // Send a message to the background script to get the service ID and ToS details
//     chrome.runtime.sendMessage({ action: 'getToSDetails', domain: domain }, (response) => {
//         if (response) {
//             if (response.error) {
//                 document.getElementById('rating').textContent = 'Rating: Not Available';
//                 document.getElementById('summary').textContent = response.error;
//             } else {
//                 document.getElementById('rating').textContent = `Rating: ${response.class}`;
//                 document.getElementById('summary').textContent = response.summary || 'No summary available.';
//             }
//         } else {
//             document.getElementById('rating').textContent = 'Rating: Not Available';
//             document.getElementById('summary').textContent = 'Failed to get a response.';
//         }
//     });
// });


// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Display the TLDR if the message action is 'displayTLDR'
    if (message.action === 'displayTLDR' && message.tldr) {
        const tldrElement = document.getElementById('tldr'); // Replace with your element's ID
        if (tldrElement) {
            tldrElement.textContent = message.tldr;
        }
    }
});

// Get the current active tab and its domain
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const domain = new URL(currentTab.url).hostname;

    // Send a message to the background script to get the service details
    chrome.runtime.sendMessage({ action: 'getToSDetails', domain: domain }, (response) => {
        if (response && !response.error) {
            const summary = response.pointsData[Object.keys(response.pointsData)[0]].tosdr.tldr;
            // Update the rating and summary in the popup
            document.getElementById('rating').textContent = `Rating: ${response.class}`;
            document.getElementById('summary').textContent = summary || 'No summary available.';

            document.getElementById('loading').style.display = 'none';
        } else {
            document.getElementById('rating').textContent = 'Rating: Not Available';
            document.getElementById('summary').textContent = 'Failed to get service details.';
            document.getElementById('loading').style.display = 'none';
        }
    });
});

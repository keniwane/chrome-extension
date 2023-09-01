const FALLBACK_API = 'https://tosdr.org/api/v1/service/';

async function getServiceDetails(domain) {
    const response = await fetch(`${FALLBACK_API}all.json`);
    if (response.ok) {
        const responseData = await response.json();

        // Remove "www." from the domain if present
        const cleanDomain = domain.replace(/^www\./i, '');

        // Check if the response contains the 'tosdr/review/' object for the domain
        if (responseData[`tosdr/review/${cleanDomain}`]) {
            const serviceDetails = responseData[`tosdr/review/${cleanDomain}`];
            const serviceId = serviceDetails.id; // Extract the id

            // make another API call using the service ID to get more details
            const fullServiceDetails = await getToSDetails(serviceId);
            return fullServiceDetails;
        } else {
            console.warn(`No service details found for ${domain}`);
        }
    } else {
        console.error(`Failed to fetch all services. Status: ${response.status}`);
    }
    return null;
}

async function getToSDetails(serviceId) {
    const response = await fetch(`${FALLBACK_API}${serviceId}.json`);
    if (response.ok) {
        const details = await response.json();
        console.log("Full Service Details:", details);
        return details;
    } else {
        console.error(`Failed to fetch service details. Status: ${response.status}`);
        return null;
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getToSDetails' && message.domain) {
        const domain = message.domain;

        getServiceDetails(domain).then(serviceData => {
            if (serviceData) {
                sendResponse(serviceData);
            } else {
                sendResponse({ error: 'No service ID and details available' });
            }
        }).catch(error => {
            console.error("Error in getServiceDetails:", error);
            sendResponse({ error: 'Error fetching service details' });
        });

        return true; // indicates the response is sent asynchronously
    } else {
        sendResponse({ error: 'Invalid action or domain' });
    }
});

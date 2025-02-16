let activeTabId = null;
let startTime = null;
let siteTimeData = {}; // वेबसाइटवर घालवलेला वेळ साठवण्यासाठी

// 🟢 कोणती टॅब अ‍ॅक्टिव्ह आहे हे ट्रॅक करा
chrome.tabs.onActivated.addListener(activeInfo => {
    if (activeTabId !== null) {
        trackTimeSpent(activeTabId);
    }
    activeTabId = activeInfo.tabId;
    startTime = new Date().getTime();
});

// 🟢 युजर नवीन वेबसाइट लोड करतोय तेव्हा ट्रॅक करा
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tabId === activeTabId && changeInfo.status === "complete") {
        startTime = new Date().getTime();
    }
});

// 🟢 टॅब बदलला की जुन्या टॅबचा वेळ साठवा
chrome.windows.onFocusChanged.addListener(windowId => {
    if (activeTabId !== null) {
        trackTimeSpent(activeTabId);
    }
    if (windowId !== chrome.windows.WINDOW_ID_NONE) {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            if (tabs.length > 0) {
                activeTabId = tabs[0].id;
                startTime = new Date().getTime();
            }
        });
    }
});

// 🟢 वेळ साठवण्याचे फंक्शन
function trackTimeSpent(tabId) {
    chrome.tabs.get(tabId, tab => {
        if (chrome.runtime.lastError || !tab || !tab.url) {
            return;
        }
        let url = new URL(tab.url);
        let domain = url.hostname;

        let endTime = new Date().getTime();
        let timeSpent = (endTime - startTime) / 1000; // सेकंदात कन्व्हर्ट

        if (siteTimeData[domain]) {
            siteTimeData[domain] += timeSpent;
        } else {
            siteTimeData[domain] = timeSpent;
        }

        chrome.storage.local.set({ siteTimeData }, () => {
            console.log(`🔹 ${domain} वर ${timeSpent} सेकंद घालवले.`);
        });
    });
}

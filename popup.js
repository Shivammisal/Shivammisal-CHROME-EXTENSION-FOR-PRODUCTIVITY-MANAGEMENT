document.addEventListener("DOMContentLoaded", function () {
    let timeDisplay = document.getElementById("time-spent");
    let blockInput = document.getElementById("block-input");
    let addBlockBtn = document.getElementById("add-block");
    let blockList = document.getElementById("block-list");

    // 🕒 वेळ दाखवा
    chrome.storage.local.get("siteTimeData", data => {
        let siteTimeData = data.siteTimeData || {};
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            if (tabs.length > 0) {
                let url = new URL(tabs[0].url);
                let domain = url.hostname;
                let timeSpent = siteTimeData[domain] || 0;
                timeDisplay.innerText = `You spent ${Math.round(timeSpent)} sec on this site`;
            }
        });
    });

    // 🛑 Block List मध्ये Website Add करा
    addBlockBtn.addEventListener("click", function () {
        let site = blockInput.value.trim();
        if (site) {
            chrome.storage.local.get("blockList", data => {
                let blockList = data.blockList || [];
                if (!blockList.includes(site)) {
                    blockList.push(site);
                    chrome.storage.local.set({ blockList }, renderBlockList);
                }
                blockInput.value = "";
            });
        }
    });

    // 🔄 ब्लॉक लिस्ट UI मध्ये अपडेट करा
    function renderBlockList() {
        chrome.storage.local.get("blockList", data => {
            blockList.innerHTML = "";
            let sites = data.blockList || [];
            sites.forEach(site => {
                let li = document.createElement("li");
                li.textContent = site;

                // 🚀 Unblock बटण जोडा
                let removeBtn = document.createElement("button");
                removeBtn.textContent = "Unblock";
                removeBtn.style.marginLeft = "10px";
                removeBtn.onclick = function () {
                    unblockSite(site);
                };

                li.appendChild(removeBtn);
                blockList.appendChild(li);
            });
        });
    }

    // 🛑 ब्लॉक लिस्टमधून वेबसाइट हटवा
    function unblockSite(site) {
        chrome.storage.local.get("blockList", data => {
            let blockList = data.blockList || [];
            let updatedList = blockList.filter(s => s !== site);
            chrome.storage.local.set({ blockList: updatedList }, renderBlockList);
        });
    }

    // 📌 सुरुवातीला ब्लॉक लिस्ट दाखवा
    renderBlockList();
});

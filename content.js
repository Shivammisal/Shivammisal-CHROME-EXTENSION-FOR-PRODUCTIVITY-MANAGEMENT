chrome.storage.local.get("blockList", data => {
    let blockList = data.blockList || [];
    let url = window.location.hostname;

    if (blockList.includes(url)) {
        document.body.innerHTML = `
            <div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#ff4d4d;color:white;font-size:24px;">
                <b>🚫 This site is blocked!</b>
            </div>
        `;
    }
});

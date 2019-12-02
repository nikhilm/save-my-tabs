let Dropbox = new window.Dropbox.Dropbox({ fetch: fetch, clientId: "3u10z0c676bh8z0" });

function saveTabs() {
    chrome.storage.local.get(['dropboxToken'], function(result) {
        var token = result.dropboxToken;
        Dropbox.setAccessToken(token);
        var filename = '/ChromeTabs.txt';
        //Dropbox.filesListFolder({path:''}).then(console.log, console.error);
        chrome.tabs.query({
            status: "complete",
            url: ['http://*/*', 'https://*/*'],
        }, function(tabs) {
            var lines = tabs.map((tab) => tab.url + " | " + tab.title);
            var contents = lines.sort().join("\n");
            Dropbox.filesUpload({
                path: filename,
                contents: contents,
                mode: { '.tag': 'overwrite' },
            })
            .then(function(results) {
                console.log("Saved!");
            }, console.error);
        });
    });
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status != "complete") {
        return;
    }

    saveTabs();
});

chrome.tabs.onRemoved.addListener(function(tabId, changeInfo, tab) {
    saveTabs();
});

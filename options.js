let Dropbox = new window.Dropbox.Dropbox({ fetch: fetch, clientId: "3u10z0c676bh8z0" });

window.onload = function() {
    document.getElementById('auth-link').addEventListener('click', authWithDropbox);
    chrome.storage.local.get(['dropboxToken'], function(result) {
        var existingToken = result.dropboxToken;
        if (existingToken) {
            console.log("Already have a token of length ", existingToken.length);
            document.getElementById('auth-link').style.visibility = "hidden";
            document.getElementById('auth-notice').style.visibility = "visible";
            return;
        }
    });
}

function authWithDropbox(e) {
    e.preventDefault();
    var authUrl = Dropbox.getAuthenticationUrl('https://fkbdkhmbpokikgoclndkhgldkncncmdj.chromiumapp.org/dropbox');
    console.log("Launching auth", authUrl);
    chrome.identity.launchWebAuthFlow({
        'url': authUrl,
        'interactive': true,
    }, function(redirect_uri) {
        if (redirect_uri) {
            var params = new URLSearchParams((new URL(redirect_uri)).hash.substring(1));
            var token = params.get('access_token');
            chrome.storage.local.set({'dropboxToken': token}, function() {
                window.location.reload();
            });
        }
    });
    return false;
}

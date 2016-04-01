/**
 * Default editorial server for tagging and everything.
 *
 * @type {{url: string, env: string}}
 */
//const DEFAULT_SERVER = {
//    url: "http://editorial.prod.cdqarth.prod.walmart.com",
//    env: "PROD"
//};

//var tabUrl;

//function saveServerSettings(settings, callback) {
//    chrome.storage.sync.set({server: settings}, callback);
//}
//
//function getServerSettings(callback) {
//    chrome.storage.sync.get("server", function (items) {
//        callback(items.server || DEFAULT_SERVER);
//    });
//}


chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {

        if (request.type === "SHOW_PAGE_ACTION") {
            chrome.pageAction.show(sender.tab.id);

            getServerSettings(function (server) {
                chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                    sendResponse({server: server});
                });
            });
            return true;
        }
        else if (request.type === "POST") {

            alert('POST ')
            var xhttp = new XMLHttpRequest();
            var method = request.method ? request.method.toUpperCase() : 'GET';

            xhttp.onload = function() {

                sendResponse(xhttp.responseText);
            };
            xhttp.onerror = function() {
                // Do whatever you want on error. Don't forget to invoke the
                // callback to clean up the communication port.
                sendResponse();
            };
            xhttp.open(method, request.url, true);
            if (method == 'POST') {
                alert('hi', xhttp.responseText)
                xhttp.setRequestHeader("Content-Type", "text/xml");
            }
            xhttp.send(request.data);
            return true; // prevents the callback from being called too early on return
        }

    });

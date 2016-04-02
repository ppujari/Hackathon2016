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
                xhttp.setRequestHeader('Content-Type', 'application/json');
            }
            xhttp.send(request.data);
            return true; // prevents the callback from being called too early on return
        }

    });

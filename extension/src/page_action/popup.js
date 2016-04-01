const BACKGROUND = chrome.extension.getBackgroundPage();


function notifyContentScript(server) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "UPDATE_SHELF", server: server});
    });
}

function encrypt(msg) {
    return CryptoJS.AES.encrypt(msg, "fuzzybunny").toString();
}

function showLoginForm() {
    $(".js-login-form").on("submit", function (event) {
        var loginData = {
            username: encrypt("homeoffice" + "\\" + $("#username").val()),
            password: encrypt($("#password").val())
        };

        $(".js-error-message").empty();
        $(".login-spinner").removeClass("hide");

        BACKGROUND.getServerSettings(function(server) {
            $.post(server.url + "/login", loginData, "json")
                .done(function (result, status) {
                    $(".js-login-form").addClass("hide");
                    $(".js-welcome").text("Hello, " + result.userProfile.displayName + ".");
                    $(".js-FAQ-container").html('<a role="button" class="btn btn-primary" target="_blank" href="https://confluence.walmart.com/display/LABS/Product+Shelving+Helper+%28Chrome+Extension%29+-+FAQ">FAQ</a>')
                    notifyContentScript(server);
                })
                .fail(function (xhr, status, errorThrown) {
                    $(".js-error-message").text("Failed to sign in! Please try again.");
                    $(".login-spinner").addClass("hide");
                });
        });

        return false;
    });
}

function getServerSession() {
    BACKGROUND.getServerSettings(function(server) {
        $(".js-server-env").text(server.env);
        $(".js-welcome").empty();
        $(".js-login-form").addClass("hide");

        $.ajax({
            url: server.url + "/session_info",
            headers: {"X-Requested-With": "XMLHttpRequest"}
        }).done(function (data, status, xhr) {
            if (xhr.status === 200) {
                $(".js-welcome").text("Hello, " + data.displayName + ".");
                $(".js-FAQ-container").html('<a role="button" class="btn btn-primary" target="_blank" href="https://confluence.walmart.com/display/LABS/Product+Shelving+Helper+%28Chrome+Extension%29+-+FAQ">FAQ</a>')
                notifyContentScript(server);
            } else {
                $(".js-login-form").removeClass("hide");
                showLoginForm();
            }
        }).fail(function (xhr, status, error) {
            $(".js-login-form").removeClass("hide");
        }).always(function () {
        });
    });
}

$(function () {
    $(".js-server-menu").on("click", "li", function(e) {
        var env = $(this).data("env");
        var url = $(this).data("url");

        BACKGROUND.saveServerSettings({env: env, url: url}, function() {
            getServerSession();
        });
    });
});

getServerSession();

var SPIN_OPTIONS = {lines: 6, length: 10, width: 8, radius: 10, rotate: 90, color: "#FFB94E", className: "spinner_"};

var SERVER;

function tagUrl() {
    if (SERVER) {
        return SERVER.url + "/tagging/producttags";
    }
}

chrome.extension.sendMessage({type: "SHOW_PAGE_ACTION"}, function (response) {
    if (!response.pageAction) {
        return;
    } else {
        SERVER = response.server;

        //getShelf().done(function (result) {
        //    shelf = result;
        //    injectToolbar();
        //});

        //observeSearchContainer();

        //$("#search-container").on("click", ".js-accept-btn,.js-reject-btn", onTogglePopover);
        //$("#search-container").on("click", ".js-confirm-reject-btn", onConfirmReject);
        //$("#search-container").on("click", ".js-confirm-accept-btn", onConfirmAccept);
        //$("#search-container").on("click", ".js-cancel-btn", onTogglePopover);
    }
});

//
//function taxonomyUrl() {
//    if (SERVER) {
//        return SERVER.url + "/tagging/taxonomy/nodes";
//    }
//}
//
//function catalogUrl() {
//    return SERVER.url + "/tagging/shelfCount";
//}
//
//function formatResult(item) {
//    if (item.loading) return item.text;
//
//    var markup = '<div class="clearfix">' +
//        '<div>' + item.name +
//        '<span style="color: #cccccc"> (' + getItemPath(item) + ')</span>' +
//        '</div>';
//
//    return markup;
//}
//
//function getItemPath(item) {
//    var itemPaths = item.relations.parent.expanded;
//    var paths = [];
//    for (var i = 0; i < itemPaths.length; i++) {
//        paths.push(itemPaths[i].name);
//    }
//    return paths.reverse().join(" > ");
//}
//
//function formatSelection(item) {
//    return item.name;
//}
//
//function createSelectOptions() {
//    return {
//        minimumInputLength: 1,
//        placeholder: "Search shelves...",
//        ajax: {
//            url: taxonomyUrl(),
//            type: "GET",
//            headers: {"X-Requested-With": "XMLHttpRequest"},
//            dataType: 'json',
//            quietMillis: 400,
//            data: function (term, page) {
//                return {
//                    page: page,
//                    searchTerm: "(name:" + term + "^4 OR name:" + term + "* OR singular:" + term + "*^3 OR plural:" + term + "*^2)",
//                    searchTypes: ["node"]
//                };
//            },
//            results: function (data, page) {
//                var more = (page * 25) < data._meta.total;
//
//                return {results: data._items, more: more};
//            },
//            cache: true
//        },
//        id: function (item) {
//            return item._id;
//        },
//        dropdownCssClass: "bootstrap",
//        formatResult: formatResult,
//        formatSelection: formatSelection
//    }
//};
//
//function getShelfByMidas() {
//    var metadata;
//
//    var text = $("#search-container").find("script").last().text();
//
//    var index = text.indexOf("window._WML.MIDAS_CONTEXT =");
//    if (index > -1) {
//        var scriptText = text.substring(index + "window._WML.MIDAS_CONTEXT = ".length, 1 + text.lastIndexOf("}"));
//        var metadata = JSON.parse(scriptText);
//    }
//
//    if (!metadata) return null;
//
//    var idPath = metadata.categoryPathId;
//    var namePath = metadata.categoryPathName;
//
//    return {
//        id: idPath.substr(1 + idPath.lastIndexOf(":")),
//        name: namePath.substr(1 + namePath.lastIndexOf("/"))
//    };
//}
//
//function getShelf() {
//    var shelf = getShelfByMidas();
//
//    if (!shelf) {
//        var metadata = JSON.parse($("#tb-djs-wml-base").text());
//        var categoryPathId = metadata.adContextJSON.categoryPathId;
//        var categoryPathName = metadata.adContextJSON.categoryPathName;
//
//        shelf = {
//            id: categoryPathId.substr(1 + categoryPathId.lastIndexOf(":")),
//            name: categoryPathName.substr(1 + categoryPathName.lastIndexOf("/"))
//        };
//    }
//
//    var deferred = $.Deferred();
//    var filter = {
//        category_id: shelf.id
//    };
//
//    $.ajax({
//        url: taxonomyUrl(),
//        type: "GET",
//        headers: {"X-Requested-With": "XMLHttpRequest"},
//        data: {all: true, filter: JSON.stringify(filter)}
//    }).done(function (result) {
//        var node = result._items[0];
//
//        if (node && node.properties.tango.nodeType === "BROWSE_SHELF") {
//            deferred.resolve(shelf);
//        } else {
//            deferred.reject();
//        }
//    }).fail(function () {
//        deferred.reject();
//    });
//
//    return deferred;
//}
//
//function getProductId() {
//    //scrape productId from walmart.com product page
//    var text = $(".js-product-page").next("script").text();
//    var index = text.indexOf('define("product/data",');
//    var text2 = text.substring(index + 'define("product/data",'.length);
//    var indexEnd = text2.indexOf("define");
//    var text3 = text2.substring(0, indexEnd)
//    var newIndexEnd = text3.lastIndexOf("}");
//
//    if (index > -1 && indexEnd > -1) {
//        var scriptText = text3.substring(0, newIndexEnd+1);
//        var metadata = JSON.parse(scriptText);
//        var productId = metadata.productId;
//        return productId;
//    } else {
//        return undefined;
//    }
//}
//
//function injectToolbar() {
//    function rejectPopupContent() {
//        var $tile = $(this).closest(".tile-grid-unit");
//        var itemId = $tile.data("item-id");
//
//        $.ajax({
//            url: catalogUrl() + "/" + itemId,
//            headers: {"X-Requested-With": "XMLHttpRequest"},
//            type: "GET",
//            data: {
//                itemId: itemId
//            }
//        }).done(function (result) {
//            if (result.shelfCount < 2) {
//                $('#rejectPopup').prepend("<span class='warning' style='color:red'>WARNING: This item belongs to only one shelf and would be moved to UNNAV if you continue. We would recommend moving the item to a different shelf.</span><br><br>")
//            }
//            $('#rejectPopup').find('.js-confirm-reject-btn').removeClass('disabled');
//            $('#rejectPopup').find('.js-confirm-reject-btn').data('productId', result.productId)
//        });
//
//        return "<div id='rejectPopup' style='width: 300px; height: 200px;'>" +
//            "Are you sure item \"" + itemId + "\" does not belong on shelf \"" + shelf.name + "\" (" + shelf.id + ")?" +
//            "<div class='yes-no-toolbar_ btn-toolbar' role='toolbar'>" +
//            "<button class='js-confirm-reject-btn dialog-btn_ btn btn-sm btn-primary disabled' type='button'>OK</button>" +
//            "<button class='js-cancel-btn dialog-btn_ btn btn-sm btn-default' type='button'>Cancel</button>" +
//            "</div>" +
//            "</div>";
//    }
//
//    function overridePopupContent() {
//        var $tile = $(this).closest(".tile-grid-unit");
//        var itemId = $tile.data("item-id");
//
//        return "<div style='width: 500px; height: 320px;'>" +
//            "Please choose a new shelf for item \"" + itemId + "\"" +
//            "<div style='padding: 6px 0'>" +
//            "<input class='js-select-tag_ select-tag_'>" +
//            "<div class='js-tag-path_ text-muted' style='padding-top: 10px;'/>" +
//            "<div class='note_ small text-muted'>We will submit your recommendation to move this item from this shelf - this will be reviewed within 2 days.</div>" +
//            "<div class='yes-no-toolbar_ btn-toolbar' role='toolbar'>" +
//            "<button class='js-confirm-accept-btn dialog-btn_ btn btn-sm btn-primary disabled' type='button'>OK</button>" +
//            "<button class='js-cancel-btn dialog-btn_ btn btn-sm btn-default' type='button'>Cancel</button>" +
//            "</div>" +
//            "</div>" +
//            "</div>";
//    }
//
//    $("#tile-container").addClass("bootstrap");
//
//    $("#search-container .tile-grid-unit").append(
//        "<div class='js-tag-toolbar_ tag-toolbar btn-toolbar' role='toolbar'>" +
//        "<a tabindex='0' class='js-accept-btn accept-btn btn btn-xs btn-success btn-center_' role='button' data-toggle='popover'><i class='fa fa-share'></i> Move to...</button>" +
//        "<a tabindex='1' class='js-reject-btn btn btn-xs btn-danger btn-center_' role='button' data-toggle='popover'><span class='glyphicon glyphicon-thumbs-down'/> Remove</button>" +
//        "</div>");
//
//    $('#search-container .js-accept-btn').popover({
//        content: overridePopupContent,
//        html: true,
//        placement: "top",
//        trigger: "manual",
//        title: "Recommend New Shelf for Item"
//    }).on("shown.bs.popover", function (e) {
//        var $toolbar = $(this).closest(".js-tag-toolbar_");
//
//        $toolbar.find(".js-select-tag_").select2(createSelectOptions()).on("change", function (e) {
//            $toolbar.find(".js-tag-path_").text("(" + getItemPath(e.added) + ")");
//            $toolbar.find(".js-confirm-accept-btn").removeClass("disabled");
//        });
//    }).on("hide.bs.popover", function (e) {
//        $(this).closest(".js-tag-toolbar_").find(".js-select-tag_").select2("destroy");
//    });
//
//    $('#search-container .js-reject-btn').popover({
//        content: rejectPopupContent,
//        html: true,
//        placement: "top",
//        trigger: "manual",
//        title: "Recommend Item for Removal"
//    });
//
//    var $tiles = $("#search-container .tile-grid-unit");
//    var $tileContainer = $("#tile-container");
//
//    $tiles
//        .mouseenter(function () {
//            if ($tileContainer.find(".popover.in").length === 0) {
//                $tiles.removeClass("outline");
//                $(this).addClass("outline");
//            }
//        })
//        .mouseleave(function () {
//            if ($(this).find(".popover.in").length === 0) {
//                $(this).removeClass("outline");
//            }
//        });
//}
//
//function injectPrimaryShelfEditor(options) {
//    var url = window.location.pathname;
//    var itemId = url.substring(url.lastIndexOf('/') + 1);
//
//    function editShelfPopupContent() {
//
//        return "<div style='width: 500px; height: 320px;'>" +
//            "Please choose a new primary shelf for item \"" + itemId + "\"" +
//            "<div style='padding: 6px 0'>" +
//            "<input class='js-select-tag_ select-tag_'>" +
//            "<div class='js-tag-path_ text-muted' style='padding-top: 10px;'/>" +
//            "<div class='note_ small text-muted'>We will submit your recommendation to change the primary shelf of this item - this will be reviewed within 2 days.</div>" +
//            "<div class='yes-no-toolbar_ btn-toolbar' role='toolbar'>" +
//            "<button class='js-confirm-accept-btn dialog-btn_ btn btn-sm btn-primary disabled' type='button'>OK</button>" +
//            "<button class='js-cancel-btn dialog-btn_ btn btn-sm btn-default' type='button'>Cancel</button>" +
//            "</div>" +
//            "</div>" +
//            "</div>";
//    }
//
//    if (options && options.noShelf) {
//        $(".js-product-page .breadcrumb-list nav").append(
//            "<li class='breadcrumb'>" +
//            "<span style='color:grey'><i>Suggest a Primary Shelf</i></span>" +
//            "</li>"
//        ).append(
//            "<div class='js-edit-shelf-button bootstrap btn-toolbar' role='toolbar' style='display:inline-block;position:absolute;margin-left:10px'>" +
//            "<a tabindex='1' class='js-edit-btn btn btn-xs btn-default btn-center_' role='button' data-toggle='popover'><span class='glyphicon glyphicon-pencil' style='font-size: 10px'/></a>" +
//            "</div>");
//    } else {
//        $(".js-product-page .breadcrumb-list nav").append(
//            "<div class='js-edit-shelf-button bootstrap btn-toolbar' role='toolbar' style='display:inline-block;position:absolute;margin-left:10px'>" +
//            "<a tabindex='1' class='js-edit-btn btn btn-xs btn-default btn-center_' role='button' data-toggle='popover'><span class='glyphicon glyphicon-pencil' style='font-size: 10px'/></a>" +
//            "</div>");
//    }
//
//    var selector = $(".js-edit-shelf-button");
//
//    $('.js-product-page .breadcrumb-list nav .js-edit-btn').popover({
//        content: editShelfPopupContent,
//        html: true,
//        placement: "bottom",
//        trigger: "manual",
//        title: "Recommend New Primary Shelf for Item"
//    }).on("shown.bs.popover", function (e) {
//
//        $(selector).find(".js-select-tag_").select2(createSelectOptions()).on("change", function (e) {
//            $(selector).find(".js-tag-path_").text("(" + getItemPath(e.added) + ")");
//            $(selector).find(".js-confirm-accept-btn").removeClass("disabled");
//        });
//
//        $(selector).off("click", ".js-confirm-accept-btn").on("click", ".js-confirm-accept-btn", onConfirmEdit);
//        $(selector).off("click", ".js-cancel-btn").on("click", ".js-cancel-btn", onTogglePopover);
//
//    }).on("hide.bs.popover", function (e) {
//        $(selector).find(".js-select-tag_").select2("destroy");
//    });
//}
//
//function injectPCFLink(e) {
//    var productId = getProductId();
//    $(".js-product-page .js-product-primary .product-subhead").append(
//        "<div class='btn-toolbar bootstrap' role='toolbar'>" +
//        "<button role='button' class='js-PCF-button btn btn-xs btn-success cell-btn'>Product Details (PCF)</button>" +
//        "</div>"
//    );
//    //dynamically adjust the link's server.url into the PCF button
//    $('.js-PCF-button').off().on('click', function () {
//        window.open(SERVER.url + "/pcf_product_details/product/canonical?product_id=" + productId, "_blank");
//    })
//}
//
//function onTogglePopover(e) {
//    if ($(this).closest(".popover.in").length === 0) {
//        $(this).popover("show");
//    } else {
//        $(this).closest(".popover.in").popover("hide");
//        return false;
//    }
//}
//
//function createErrorHandler(title) {
//    return function (xhr, status, error) {
//        chrome.extension.sendMessage({
//            type: "NOTIFY",
//            title: title,
//            message: "(" + status + ") " + (xhr.responseText || error)
//        });
//    }
//}
//
//function onConfirmReject(e) {
//    var $tile = $(this).closest(".tile-grid-unit");
//    var itemId = $tile.data("item-id");
//    var productId = $(this).data("productId")
//    var valueIds = [shelf.id];
//    var shelfName = shelf.name;
//    var $popover = $tile.find(".popover.in");
//    var target = $popover.find(".popover-content").get(0);
//    var spinner = new Spinner(SPIN_OPTIONS).spin(target);
//
//    return $.ajax({
//        url: tagUrl() + "/" + productId,
//        headers: {"X-Requested-With": "XMLHttpRequest"},
//        type: "PUT",
//        data: {
//            decision: "is_not",
//            mode: "append",
//            productId: productId,
//            itemId: itemId,
//            attrId: "shelf",
//            valueIds: valueIds
//        }
//    }).done(function (result) {
//
//        chrome.extension.sendMessage({
//            type: "NOTIFY",
//            title: "Recommend Item for Removal",
//            message: "SUCCESS! Item " + itemId + " (" + productId + ") submitted for removal from shelf " + valueIds[0] + " (" + shelfName + ")."
//        });
//
//    }).fail(createErrorHandler("Remove Shelf Tag")).always(function () {
//        spinner.stop();
//        $popover.popover("hide");
//    });
//
//    return false;
//}
//
//function onConfirmAccept(e) {
//    var $tile = $(this).closest(".tile-grid-unit");
//    var itemId = $tile.data("item-id");
//    var productId;
//    var oldValueIds = [shelf.id];
//    var data = $tile.find(".js-select-tag_").select2("data");
//    var newValueIds = [data.category_id];
//    var newShelfName = data.name;
//    var $popover = $tile.find(".popover.in");
//    var target = $popover.find(".popover-content").get(0);
//    var spinner = new Spinner(SPIN_OPTIONS).spin(target);
//
//    var dfd1 = $.ajax({
//        url: tagUrl() + "/" + itemId,
//        headers: {"X-Requested-With": "XMLHttpRequest"},
//        type: "PUT",
//        data: {
//            decision: "is_not",
//            mode: "append",
//            itemId: itemId,
//            attrId: "shelf",
//            valueIds: oldValueIds
//        }
//    });
//
//    var dfd2 = $.ajax({
//        url: tagUrl() + "/" + itemId,
//        headers: {"X-Requested-With": "XMLHttpRequest"},
//        type: "PUT",
//        data: {
//            decision: "is",
//            mode: "append",
//            itemId: itemId,
//            attrId: "shelf",
//            valueIds: newValueIds
//        }
//    }).done(function (result) {
//        productId = result.productId;
//    });
//
//    $.when(dfd1, dfd2)
//        .done(function () {
//            chrome.extension.sendMessage({
//                type: "NOTIFY",
//                title: "Recommend New Shelf for Item",
//                message: "SUCCESS! Item " + itemId + " (" + productId + ") moved to shelf " + newValueIds[0] + " (" + newShelfName + ")."
//            });
//
//        }).fail(createErrorHandler("Recommend New Shelf for Item")).always(function () {
//        spinner.stop();
//        $popover.popover("hide");
//    });
//
//    return false;
//}
//
//function onConfirmEdit(e) {
//    var url = window.location.pathname;
//    var itemId = url.substring(url.lastIndexOf('/') + 1);
//    var productId = getProductId();
//    var data = $(".js-edit-shelf-button").find(".js-select-tag_").select2("data");
//    var newValueIds = [data.category_id];
//    var newShelfName = data.name;
//    var $popover = $(".js-edit-shelf-button").find(".popover.in");
//    var target = $popover.find(".popover-content").get(0);
//    var spinner = new Spinner(SPIN_OPTIONS).spin(target);
//
//    $.ajax({
//        url: tagUrl() + "/" + productId,
//        headers: {"X-Requested-With": "XMLHttpRequest"},
//        type: "PUT",
//        data: {
//            decision: "is",
//            mode: "append",
//            productId: productId,
//            itemId: itemId,
//            attrId: "shelf",
//            valueIds: newValueIds,
//            primary: true
//        }
//    }).done(function (result) {
//        productId = result.productId;
//        chrome.extension.sendMessage({
//            type: "NOTIFY",
//            title: "Recommend New Primary Shelf for Item",
//            message: "SUCCESS! Shelf " + newValueIds[0] + " (" + newShelfName + ") is now the primary shelf for " + itemId + " (" + productId + ")."
//        });
//    }).fail(createErrorHandler("Recommend New Primary Shelf for Item")).always(function () {
//        spinner.stop();
//        $popover.popover("hide");
//    });
//
//    return false;
//}
//
//function observeSearchContainer() {
//    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
//
//    var observer = new MutationObserver(function (mutations, observer) {
//        shelf = null;
//        getShelf().done(function (result) {
//            shelf = result;
//            injectToolbar();
//        });
//    });
//
//    observer.observe(document.querySelector("#search-container"), {
//        subtree: false,
//        childList: true
//    });
//}
//
//chrome.extension.sendMessage({type: "SHOW_EDIT_PRIMARY_SHELF_AND_PCF"}, function (response) {
//    if (!response.pageAction) {
//        return;
//    } else {
//        SERVER = response.server;
//
//        getShelf().done(function (result) {
//            shelf = result;
//            injectPrimaryShelfEditor();
//            injectPCFLink();
//            $(".js-edit-shelf-button").on("click", ".js-edit-btn", onTogglePopover);
//        });
//
//        if ($(".js-product-page .breadcrumb-list nav").children().length === 0) {
//            injectPrimaryShelfEditor({noShelf: true});
//            injectPCFLink();
//            $(".js-edit-shelf-button").on("click", ".js-edit-btn", onTogglePopover);
//        }
//    }
//});

//chrome.extension.onMessage.addListener(
//    function (request, sender, sendResponse) {
//        if (request.type === "UPDATE_SHELF") {
//            SERVER = request.server;
//
//            if (!shelf) {
//                getShelf().done(function (result) {
//                    shelf = result;
//                    injectToolbar();
//                });
//            }
//        }
//    });

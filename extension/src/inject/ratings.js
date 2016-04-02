var $textAreaEditor;
var $ratingsStars;
var $ratingMessage;
var $recomendationYes;
var $recomendationNo;
var $submitButton;
var $reviewRatings;
var $reviewTitle;
var $placeHolder;
var currentRatings;

/**
* calls an API to get the value of ratings.
*/
function getRatingNumber(reviewText) {
	//http://attribute-extract.stg1.cdqarth.prod.walmart.com/v1/rating/predict
	// Implement the Ajax call here and return the value to setReviewRatings;
	//this.setReviewRatings(Math.floor((Math.random() * 5) + 1));
	var ratings = {
		review_text: reviewText,
		rating : currentRatings,
		title: "",
		probability: 0.0,
		positive: [],
		negative: []
	};

	var urlPost = "http://172.28.90.191:5000/v1/rating/predict/";
	//var urlPost = "http://attribute-extract.pqa.cdqarth.qa.walmart.com/extractors/v1/rating/predict/";

	chrome.extension.sendMessage({
		type: "POST",
		method: 'POST',
		action: 'xhttp',
		url: urlPost,
		data: JSON.stringify(ratings),
		contentType: "application/json; charset=utf-8",
		dataType: "json"
	}, function (response) {
		var data = JSON.parse(response);
		console.log('response data ', data)
		currentRatings = parseInt(data.rating);
		setReviewRatings((currentRatings-1), data.title);
	});
}

/**
* Binds the click event on text editor and look for enter and dot.
*/
function getTextEditorValue() {
	console.log('$textAreaEditor ', $textAreaEditor);
	$textAreaEditor.on('keyup', function(e) {
		console.log('keyup');
		if (e.which === 110 || e.which === 190 || e.which === 13 || (e.which === 8 && $textAreaEditor.val().lenght > 5)) {
			console.log('$textAreaEditor.val() ', $textAreaEditor.val());
			getRatingNumber($textAreaEditor.val());
		} else if (e.which === 8 && $textAreaEditor.val().lenght <= 5) {
			clearReview();
		}
	});
}

/**
 * return the rating message that corresponds with the current select rating
 */
function getRatingMessage(ratingIndex) {

  if (ratingIndex === 0) {
	return "Poor";
  } else if (ratingIndex === 1) {
	return "Fair";
  } else if (ratingIndex === 2) {
	return "Average";
  } else if (ratingIndex === 3) {
	return "Good";
  } else if (ratingIndex === 4) {
	return "Excellent";
  }
  return "";
}

function setReviewRatings(ratingIndex, title) {

	clearReview();
	$ratingsStars.each(function () {
		$(this).removeClass("rating-unselected").addClass("rating-selected");
		if (ratingIndex === 0) {
			$(this).addClass('red_star');
		}
		if (ratingIndex === 4) {
			$(this).addClass('blue_star');
		}

		return (ratingIndex !== parseInt($(this).attr("data-index")));
	});
	setRatingMessage(ratingIndex);
	setRecomendation(ratingIndex);
	setReviewTitle(title);
}

function setRatingMessage(ratingIndex) {

	$ratingMessage.text(getRatingMessage(ratingIndex));
}

function setRecomendation(ratingIndex) {

	if (ratingIndex >= 2) {
		//set recommended
		setRecomendationYes();
	} else if (ratingIndex === 0 || _.isNaN(ratingIndex)) {
		//set clear both input
		clearRecomendation();

	} else {
		//set not recommended
		setRecomendationNo();
	}
}

function setReviewTitle(title) {
	var newTitle = title;
	if (title === "This Product") {
		newTitle = title + " is " + $ratingMessage.text();
	}
	$reviewTitle.val(newTitle);
}

function setRecomendationYes() {
	clearRecomendation();
	$recomendationYes.prop('checked', true);
}

function setRecomendationNo() {
	clearRecomendation();
	$recomendationNo.prop('checked', true);
}

function clearRecomendation() {
	$recomendationYes.prop('checked', false);
	$recomendationNo.prop('checked', false);

}

function clearReview() {
	$ratingsStars.removeClass("rating-selected red_star blue_star").addClass("rating-unselected");
	$ratingMessage.text("");
	clearRecomendation();
	$reviewTitle.val("");
}

function defaultActions() {
	setReviewButton();
	setPlaceHolder();
	$submitButton.hide();
	$reviewRatings.addClass("unselectable");
	submitReview();
}

/**
 * this will get the average ratings for the current review statistics
 * @returns {string}
 */

function getAverageOverallRating() {
	var text = $(".center").find("script").text();
	var startIndexText = text.substring(text.indexOf("AverageOverallRating"));
	var endIndexText = startIndexText.substring(0, startIndexText.indexOf(","));
	var averageOverallRating = endIndexText.substring(endIndexText.indexOf(":") + 1 );

	return averageOverallRating;
}

function setReviewFlag() {
	var reviewFlag = "<div class=\"review-flag\">This review has been flag for admin to re-review</div>";
	$(".validation-group").append(reviewFlag);
}

function submitReview() {
	var averageRating = parseFloat(getAverageOverallRating());
	var maxThreshold = parseFloat(currentRatings) + 1.5;
	var minThreshold = parseFloat(currentRatings) - 1.5;
	$(".js-review-button").on("click", function() {
		console.log(averageRating >= maxThreshold || averageRating <= minThreshold);
		console.log(averageRating);
		console.log(currentRatings);
		console.log(maxThreshold);
		if(averageRating && (averageRating >= maxThreshold || averageRating <= minThreshold)) {
			setReviewFlag();
		}
	});
}

function setReviewButton() {
	var reviewButton = "<button class=\"btn js-review-button display-inline-block\" type=\"button\">Submit</button>"

	$(".js-submit-review").hide();
	$(".submit-review-submit-controls").html(reviewButton);

}

function setPlaceHolder() {
	var placeHolder = "<p><img src='" + chrome.extension.getURL("icons/tag.png") +"' style='width:15px'/> Just start typing your review and the review rating and your recommendation decision will automatically be generated!</p>";
	$placeHolder.html(placeHolder);

}

function observeReviewForm() {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var observer = new MutationObserver(function (mutations, observer) {
		$textAreaEditor = $("#review-body");
		$ratingsStars = $(".js-rating-selection");
		$ratingMessage = $(".js-rating-selection-message");
		$recomendationYes = $("#recommend-friend-yes");
		$recomendationNo = $("#recommend-friend-no");
		$submitButton = $(".js-review-button");
		$reviewRatings = $(".submit-review-your-rating");
		$reviewTitle = $("#review-title");
		$placeHolder = $(".js-review-body .textarea-placeholder");
		currentRatings = "0";

		console.log('response received2 ', $("#review-body"))
		defaultActions();
		getTextEditorValue();

    });

    observer.observe(document.querySelector("body"), {
        subtree: false,
        childList: true
    });
}

chrome.extension.sendMessage({type: "SHOW_PAGE_ACTION"}, function (response) {
	$textAreaEditor = $("#review-body");
	$ratingsStars = $(".js-rating-selection");
	$ratingMessage = $(".js-rating-selection-message");
	$recomendationYes = $("#recommend-friend-yes");
	$recomendationNo = $("#recommend-friend-no");
	$submitButton = $(".js-review-button");
	$reviewRatings = $(".submit-review-your-rating");
	$reviewTitle = $("#review-title");
	$placeHolder = $(".js-review-body .textarea-placeholder");
	currentRatings = "0";

	console.log('response received ', $("#review-body"))

	defaultActions();
	getTextEditorValue();

	observeReviewForm();

});

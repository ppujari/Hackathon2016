var $textAreaEditor;
var $ratingsStars;
var $ratingMessage;
var $recomendationYes;
var $recomendationNo;
var $submitButton;
var $reviewRatings;
var $reviewTitle;
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
	rating : currentRatings
	};

	//var urlPost = "http://attribute-extract.stg1.cdqarth.prod.walmart.com/v1/rating/predict/" + JSON.stringify(ratings);
	var urlPost = "http://172.28.90.191:5000/v1/rating/predict/";

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
		setReviewRatings((currentRatings-1));
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

function setReviewRatings(ratingIndex) {

	clearReview();
	$ratingsStars.each(function () {
		$(this).removeClass("rating-unselected").addClass("rating-selected");
		return (ratingIndex !== parseInt($(this).attr("data-index")));
	});
	setRatingMessage(ratingIndex);
	setRecomendation(ratingIndex);
	setReviewTitle(ratingIndex);
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

function setReviewTitle(ratingIndex) {
	$reviewTitle.val(getRatingMessage(ratingIndex));
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
	$ratingsStars.removeClass("rating-selected").addClass("rating-unselected");
	$ratingMessage.text("");
	clearRecomendation();
	$reviewTitle.val("");
}

function disableTemporaryControls() {
	$submitButton.addClass("unselectable");
	$reviewRatings.addClass("unselectable");
}

function remove() {
	remove();
}

function observeReviewForm() {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var observer = new MutationObserver(function (mutations, observer) {
		$textAreaEditor = $("#review-body");
		$ratingsStars = $(".js-rating-selection");
		$ratingMessage = $(".js-rating-selection-message");
		$recomendationYes = $("#recommend-friend-yes");
		$recomendationNo = $("#recommend-friend-no");
		$submitButton = $(".submit-review-submit-controls");
		$reviewRatings = $(".submit-review-your-rating");
		$reviewTitle = $("#review-title");
		currentRatings = "0";

		console.log('response received2 ', $("#review-body"))

		disableTemporaryControls();
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
		$submitButton = $(".submit-review-submit-controls");
		$reviewRatings = $(".submit-review-your-rating");
		$reviewTitle = $("#review-title");
		currentRatings = "0";

		console.log('response received ', $("#review-body"))

		disableTemporaryControls();
		getTextEditorValue();

	observeReviewForm();

});

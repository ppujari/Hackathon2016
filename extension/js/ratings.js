define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {

	var GetRatingsView = Backbone.View.extend({
		el: ".submit-review-form-content",

		/**
		* Initializes the Ratings API
		*/
		initialize: function () {
			this.$textAreaEditor = this.$("#review-body");
			this.$ratingsStars = this.$(".js-rating-selection");
			this.$ratingMessage = this.$(".js-rating-selection-message");
			this.$recomendationYes = this.$("#recommend-friend-yes");
			this.$recomendationNo = this.$("#recommend-friend-no");
			this.$submitButton = this.$(".submit-review-submit-controls");
			this.$reviewRatings = this.$(".submit-review-your-rating");
			this.$reviewTitle = this.$("#review-title");
			this.currentRatings = "0";

			this.desableTemporaryControls();
			this.getTextEditorValue();
		},

		/**
		* calls an API to get the value of ratings.
		*/
		getRatingNumber: function (reviewText) {
			var self = this;
			//http://attribute-extract.stg1.cdqarth.prod.walmart.com/v1/rating/predict
			// Implement the Ajax call here and return the value to setReviewRatings;
			//this.setReviewRatings(Math.floor((Math.random() * 5) + 1));
			var ratings = {
				review_text: reviewText,
  			rating : self.currentRatings
			}

			//var urlPost = "http://attribute-extract.stg1.cdqarth.prod.walmart.com/v1/rating/predict/" + JSON.stringify(ratings);
			var urlPost = "http://172.28.90.191:5000/"

			$.ajax({
		    type: "POST",
		    url: urlPost,
		    // The key needs to match your method's input parameter (case-sensitive).
		    data: JSON.stringify(ratings),
		    contentType: "application/json; charset=utf-8",
		    dataType: "json",
		    success: function(data){
		    	console.log(data);
		    },
		    failure: function(errMsg) {
		        console.log(errMsg);
		    }
			});
		},

		/**
		* Binds the click event on text editor and look for enter and dot.
		*/
		getTextEditorValue: function() {
			var self = this;
			this.$textAreaEditor.on('keyup', function(e) {
			    if (e.which === 110 || e.which === 190 || e.which === 13 || (e.which === 8 && self.$textAreaEditor.val().lenght > 5)) {
			    	self.getRatingNumber(self.$textAreaEditor.val());
			    } else if (e.which === 8 && self.$textAreaEditor.val().lenght <= 5) {
			    	this.clearReview();
			    }
			});
		},

		/**
	     * return the rating message that corresponds with the current select rating
	     */
	    getRatingMessage: function (ratingIndex) {

	      if (ratingIndex === 1) {
	        return "Poor";
	      } else if (ratingIndex === 2) {
	        return "Fair";
	      } else if (ratingIndex === 3) {
	        return "Average";
	      } else if (ratingIndex === 4) {
	        return "Good";
	      } else if (ratingIndex === 5) {
	        return "Excellent";
	      }
	      return "";
	    },

	    setReviewRatings: function (ratingIndex) {

	    	var self = this;
	    	this.clearReview();
	    	this.$ratingsStars.each(function () {
	    		$(this).removeClass("rating-unselected").addClass("rating-selected");
	    		return (ratingIndex !== parseInt($(this).attr("data-index")));
	    	});
	    	this.setRatingMessage(ratingIndex);
	    	this.setRecomendation(ratingIndex);
	    	this.setReviewTitle(ratingIndex);
	    },

	    setRatingMessage: function (ratingIndex) {
	    	var self = this;
	    	this.$ratingMessage.text(self.getRatingMessage(ratingIndex));
	    },

	    setRecomendation: function (ratingIndex) {
	    	var self = this;
	    	if (ratingIndex >= 3) {
	    		//set recommended
	    		self.setRecomendationYes();
	    	} else if (ratingIndex === 0 || _.isNaN(ratingIndex)) {
	    		//set clear both input
	    		self.clearRecomendation();

	    	} else {
	    		//set not recommended
	    		self.setRecomendationNo();
	    	}
	    },

	    setReviewTitle: function (ratingIndex) {
	    	var self = this;
	    	this.$reviewTitle.val(self.getRatingMessage(ratingIndex));
	    } ,

	    setRecomendationYes: function () {
	    	this.clearRecomendation();
	    	this.$recomendationYes.prop('checked', true);
	    },

	    setRecomendationNo: function () {
	    	this.clearRecomendation();
	    	this.$recomendationNo.prop('checked', true);
	    },

	    clearRecomendation: function () {
	    	this.$recomendationYes.prop('checked', false);
	    	this.$recomendationNo.prop('checked', false);

	    },

	    clearReview: function () {
	    	this.$ratingsStars.removeClass("rating-selected").addClass("rating-unselected");
	    	this.$ratingMessage.text("");
	    	this.clearRecomendation();
	    	this.$reviewTitle.val("");
	    },

	    desableTemporaryControls: function () {
	    	this.$submitButton.addClass("unselectable");
	    	this.$reviewRatings.addClass("unselectable");
	    },

	    remove: function () {
	    	this.remove();
	    }

	});

	return GetRatingsView;
});

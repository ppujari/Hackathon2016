define(['js/jquery','src/inject/ratings'], function ($, RatingsView) {
	console.log('main-init.js');
	var ratingView = new RatingsView({ el: this.$(".submit-review-form-content") });
});
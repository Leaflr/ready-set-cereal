define([
	'backbone',
	'communicator',
	'hbs!/templates/user'
], function( Backbone, Communicator, userTemp ){
	'use strict';

	var nav,
		cerealBowl,
		navBar,
		content,
		orderButton;

	return Backbone.Marionette.ItemView.extend({
		template: userTemp,

		events: {
			'click .nav-toggle':'navToggle'
		},

		onRender: function(){
			nav = this.$el.find('.nav-content');
			cerealBowl = $('.cereal-bowl');
			navBar = $('#nav');
			content = $('.content-wrapper');
			orderButton = $('.order-button');
			console.log(this.model)
		},

		navToggle: function(){
console.log(nav)
			if ( navBar.hasClass('nav-open') == false ){
				content.animate({'left': '-85%'}, 200);
				cerealBowl.css('z-index','1').animate({'left': '-85%'}, 200);
				nav.animate({'right': 0 }, 200)
				navBar.addClass('nav-open').animate({'left': '-85%'}, 200);
				orderButton.animate({'left': '-85%'}, 200);
			} else {
				nav.animate({'right': '-85%' }, 200)
				navBar.removeClass('nav-open').animate({'left': '0'}, 200);
				orderButton.animate({'left': '7px'}, 200);
				content.animate({'left': 0}, 200);
				cerealBowl.css('z-index','300').animate({'left': 0}, 200);
			}
			
		}
	});
});
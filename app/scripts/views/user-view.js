define([
	'backbone',
	'communicator',
	'hbs!/templates/user'
], function( Backbone, Communicator, userTemp ){
	'use strict';

	return Backbone.Marionette.ItemView.extend({
		template: userTemp,

		events: {
			'click .nav-toggle':'navToggle'
		},

		initialize: function(){
			console.log(this.model)
		},

		navToggle: function(){
			var nav = this.$el.find('.nav-content'),
				navBar = $('#nav'),
				content = $('.content-wrapper'),
				orderButton = $('.order-button');

			

			if ( navBar.hasClass('nav-open') == false ){
				content.animate({'left': '-85%'}, 200);
				nav.animate({'right': 0 }, 200)
				navBar.addClass('nav-open').animate({'left': '-85%'}, 200);
				orderButton.animate({'left': '-85%'}, 200);
			} else {
				nav.animate({'right': '-85%' }, 200)
				navBar.removeClass('nav-open').animate({'left': '0'}, 200);
				orderButton.animate({'left': '7px'}, 200);
				content.animate({'left': 0}, 200);
			}
			
		}
	});
});
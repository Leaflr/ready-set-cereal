define([
	'backbone',
	'communicator',
	'models/user-model',
	'hbs!/templates/order-button'
], function( Backbone, Communicator, userModel, orderButtonTemp ){
	'use strict';

	return Backbone.Marionette.ItemView.extend({
		template: orderButtonTemp,
		tagName: 'button',
		className: 'nav-button',
		events: {
			'click':'orderRouter'
		},
		initialize: function(){
			var self = this;
			Communicator.events.on('orderCancelled', function(){
				self.orderCancelled();
			});
		},
		orderCancelled: function(){
			this.$el.removeClass('cancel');
			this.$el.find('.text').text('order');
			this.$el.find('.icon').removeClass('icon-times').addClass('icon-plus');
		},
		orderRouter: function(){
			var hasOrder = userModel.get('hasOrder');

			if ( hasOrder != true && this.$el.hasClass('cancel') ){
				Communicator.events.trigger('hideOrder');
				$('#leaderboard').show();
				this.$el.removeClass('cancel')
				this.$el.find('.text').text('order')
				this.$el.find('.icon').removeClass('icon-times').addClass('icon-plus');
			} else if ( hasOrder != true ){
				Communicator.events.trigger('placeOrder');
				this.$el.addClass('cancel')
				this.$el.find('.text').text('cancel')
				this.$el.find('.icon').removeClass('icon-plus').addClass('icon-times');
			} else if ( hasOrder == true ) {
				Communicator.events.trigger('cancelOrder');
			}
		}

	});
});
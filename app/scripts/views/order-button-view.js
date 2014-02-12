define([
	'backbone',
	'communicator',
	'hbs!/templates/order-button'
], function( Backbone, Communicator, orderButtonTemp ){
	'use strict';

	return Backbone.Marionette.ItemView.extend({
		template: orderButtonTemp,
		tagName: 'button',
		className: 'nav-button',
		events: {
			'click':'orderRouter'
		},
		orderRouter: function(){
			var hasOrder = this.model.has('active_order');

			if ( hasOrder == false && this.$el.hasClass('cancel') ){
				Communicator.events.trigger('hideOrder');
				this.$el.removeClass('cancel')
				this.$el.find('.text').text('order')
				this.$el.find('.icon').removeClass('icon-times').addClass('icon-plus');
			} else if ( hasOrder == false ){
				Communicator.events.trigger('placeOrder');
				this.$el.addClass('cancel')
				this.$el.find('.text').text('cancel')
				this.$el.find('.icon').removeClass('icon-plus').addClass('icon-times');
			} else if ( hasOrder == true ) {
				Communicator.events.trigger('cancelOrder');
				this.$el.removeClass('cancel')
				this.$el.find('.text').text('order')
				this.$el.find('.icon').removeClass('icon-times').addClass('icon-plus');
			}
		}

	});
});
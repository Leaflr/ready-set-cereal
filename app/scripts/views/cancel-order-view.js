define([
	'backbone',
	'communicator',
	'hbs!/templates/cancel-order'
], function( Backbone, Communicator, cancelOrderTemp ){
	'use strict';

	return Backbone.Marionette.ItemView.extend({
		template: cancelOrderTemp,
		events: {
			'click .yes':'cancelOrder',
			'click .no':'dontCancel'
		},
		cancelOrder: function(){
			Communicator.events.trigger('orderCancelled');
			this.$el.remove();
		},
		dontCancel: function(){
			this.$el.remove();
		}

	});
});
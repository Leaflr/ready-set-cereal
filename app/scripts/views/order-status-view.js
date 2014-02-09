define([
	'backbone',
	'communicator',
	'models/user-model',
	'views/place-order-view',
	'views/cancel-order-view',
	'hbs!/templates/order-status-active',
	'hbs!/templates/order-status-inactive'
], function( Backbone, Communicator, userModel, placeOrderView, cancelOrderView, orderStatusActiveTemp, orderStatusInactiveTemp ){
	'use strict';

	return Backbone.Marionette.Layout.extend({
		regions: {
			placeOrderForm: '#place-order-form',
			modifyOrderForm: '#modify-order-form'
		},
		events: {
			'click .inactive':'placeOrder',
			'click .active':'cancelOrder'
		},
		initialize: function(){
			var activeOrder = userModel.get('activeOrder');
			this.placeOrder()
			// if user has an active order show views
			if ( activeOrder ){
				this.template = orderStatusActiveTemp
			} else {
				this.template = orderStatusInactiveTemp
			}
		},
		placeOrder: function(){
			this.placeOrderForm.show( new placeOrderView() );
		},
		cancelOrder: function(){
			this.cancelOrderForm.show( new cancelOrderView() );
		}
	});
});
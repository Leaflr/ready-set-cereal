define([
	'backbone',
	'communicator',
	'models/user-model',
	'models/order-model',
	'views/user-view',
	'views/order-status-view',
	'jquery-ui',
	'jquery-ui-touch-punch'
],

function( Backbone, Communicator, userModel, orderModel, userView, orderStatusView ) {
    'use strict';

	var App = new Backbone.Marionette.Application();

	/* Add application regions here */
	App.addRegions({
		user: '#user',
		orderStatus: '#order-status'
	});

	/* Add initializers here */
	App.addInitializer( function () {
		App.user.show( new userView({ model: userModel }) );
		App.orderStatus.show( new orderStatusView({ model: orderModel }) );


	});

	return App;
});

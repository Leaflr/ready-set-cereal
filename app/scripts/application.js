define([
	'backbone',
	'communicator',
	'models/user-model',
	'models/order-model',
	'models/dispensor-status-model',
	'models/leaderboards-collection',
	'views/user-view',
	'views/order-status-view',
	'views/dispensor-status-view',
	'views/leaderboards-view',
	'fastclick'
],

function( Backbone, Communicator, userModel, orderModel, dispensorStatusModel, leaderboardsCollection, userView, orderStatusView, dispensorStatusView, leaderboardsView, fastclick ) {
    'use strict';
    fastclick.attach(document.body);
	var App = new Backbone.Marionette.Application();

	/* Add application regions here */
	App.addRegions({
		user: '#user',
		orderStatus: '#order-status',
		dispensorStatus: '#dispensor-status',
		leaderboard: '#leaderboard'
	});

	/* Add initializers here */
	App.addInitializer( function () {
		App.user.show( new userView({ model: userModel }) );
		App.orderStatus.show( new orderStatusView({ model: orderModel }) );
		App.dispensorStatus.show( new dispensorStatusView({ model: dispensorStatusModel }) );
		App.leaderboard.show( new leaderboardsView({ collection: leaderboardsCollection }) );
	});

	return App;
});

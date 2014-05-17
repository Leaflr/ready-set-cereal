define([
	'backbone',
	'communicator',
	'models/dispensor-status-model',
	'models/user-model',
	'models/order-model',
	'models/leaderboards-collection',
	'views/user-view',
	'views/order-status-view',
	'views/order-button-view',
	'views/dispensor-status-view',
	'views/leaderboards-view',
	'fastclick'
],

function( Backbone, Communicator, statusModel, userModel, orderModel,  leaderboardsCollection, userView, orderStatusView, orderButtonView, dispensorStatusView, leaderboardsView, fastclick ) {
    'use strict';
    
    fastclick.attach(document.body);
	
	var App = new Backbone.Marionette.Application();

	/* Add application regions here */
	App.addRegions({
		user: '#user',
		orderStatus: '#order-status',
		dispensorStatus: '#dispensor-status',
		leaderboard: '#leaderboard',
		orderButton: '#order-button'
	});

	/* Add initializers here */
	App.addInitializer( function () {
			
			App.orderStatus.show( new orderStatusView({ model: userModel }) );
			App.orderButton.show( new orderButtonView({ model: orderModel }) );
			App.user.show( new userView({ model: userModel }) );
			App.leaderboard.show( new leaderboardsView({ collection: leaderboardsCollection }) );

			var dispensorStatusModel = new statusModel();
			
			dispensorStatusModel.on('sync', function(){
				App.dispensorStatus.show( new dispensorStatusView({ model: dispensorStatusModel }) );
				dispensorStatusModel.off('sync');
			});

				// App.dispensorStatus.show( new dispensorStatusView({ model: dispensorStatusModel }) );
			
		$('#leaderboard').prepend('<div class="logo"><img src="images/rsc-logo.svg"></div>');

	});

	Communicator.events.on('userSaved', function(){
				// App.leaderboard.show( new leaderboardsView({ collection: leaderboardsCollection }) );
				leaderboardsCollection.fetch().success(function(){
					App.leaderboard.show( new leaderboardsView({ collection: leaderboardsCollection }) );
				})
	});

	return App;
});

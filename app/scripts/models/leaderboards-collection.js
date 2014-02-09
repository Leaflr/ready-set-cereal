define([
	'backbone',
	'communicator',
	'models/leaderboard-model'
], function( Backbone, Communicator, leaderboardModel ){
	'use strict';

	var leaderboardCollection = Backbone.Collection.extend({
		url: '/users',
		model: leaderboardModel,
		initialize: function(){
			this.fetch();
		}
	});

	var collection = new leaderboardCollection();

	return collection;
});
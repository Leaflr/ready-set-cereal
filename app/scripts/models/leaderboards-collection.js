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
			var self = this;
			
		}
	});

	var collection = new leaderboardCollection();

	collection.fetch()

	return collection;
});
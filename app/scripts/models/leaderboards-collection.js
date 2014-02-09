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
			console.log(this)
		}
	});

	var collection = new leaderboardCollection();

	return collection;
});
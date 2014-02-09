define([
	'backbone',
	'communicator',
	'models/leaderboard-model'
], function( Backbone, Communicator, leaderboardModel ){
	'use strict';

	var leaderboardCollection = Backbone.Collection.extend({
		url: '/users',
		model: leaderboardModel,
	});

	var collection = new leaderboardCollection([
		{
			name: 'Kaleb Clark',
			rank: 1
		},
		{
			name: 'Andy Axton',
			rank: 2
		},
		{
			name: 'Emma Fletcher',
			rank: 3
		},
		{
			name: 'Meritt Thoman',
			rank: 4
		},
		{
			name: 'Andy Colborn',
			rank: 5
		}
	]);

	return collection;
});
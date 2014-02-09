define([
	'backbone',
	'communicator',
	'hbs!/templates/leaderboard'
], function( Backbone, Communicator, leaderboardTemp ){
	'use strict';

	return Backbone.Marionette.ItemView.extend({
		template: leaderboardTemp,
		tagName: 'li'

	});
});
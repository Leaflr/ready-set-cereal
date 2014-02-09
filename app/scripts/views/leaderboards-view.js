define([
	'backbone',
	'communicator',
	'views/leaderboard-view',
	'hbs!/templates/leaderboards'
], function( Backbone, Communicator, leaderboardView, leaderboardsTemp ){
	'use strict';

	return Backbone.Marionette.CompositeView.extend({
		template: leaderboardsTemp,
		itemView: leaderboardView,
		tagName: 'ul',

		onRender: function(){
			this.$el.prepend('<li>cereal masters</li>');
		}


	});
});
define([
	'backbone',
	'communicator',
	'hbs!/templates/dispensor-status'
], function( Backbone, Communicator, dispensorStatusTemp ){
	'use strict';

	return Backbone.Marionette.ItemView.extend({
		template: dispensorStatusTemp

	});
});
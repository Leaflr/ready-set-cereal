define([
	'backbone',
	'communicator',
	'hbs!/templates/cancel-order'
], function( Backbone, Communicator, cancelOrderTemp ){
	'use strict';

	return Backbone.Marionette.ItemView.extend({
		template: cancelOrderTemp

	});
});
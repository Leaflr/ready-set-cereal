define([
	'backbone',
	'communicator',
	'hbs!/templates/place-order'
], function( Backbone, Communicator, placeOrderTemp ){
	'use strict';

	return Backbone.Marionette.ItemView.extend({
		template: placeOrderTemp

	});
});
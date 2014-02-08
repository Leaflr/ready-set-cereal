define([
	'backbone',
	'communicator',
	'hbs!/templates/user'
], function( Backbone, Communicator, userTemp ){
	'use strict';

	return Backbone.Marionette.ItemView.extend({
		template: userTemp,
		initialize: function(){
			console.log(this.model)
		}
	});
});
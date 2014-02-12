define([
	'backbone',
	'communicator',
	'hbs!/templates/dispensor-status'
], function( Backbone, Communicator, dispensorStatusTemp ){
	'use strict';

	return Backbone.Marionette.ItemView.extend({
		template: dispensorStatusTemp,
		className: 'nav-button inactive',
		initialize: function(){
			Communicator.socket.on('status', function( data ){
				console.log(data)
			});
		}

	});
});
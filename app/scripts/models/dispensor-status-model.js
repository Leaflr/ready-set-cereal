define([
	'backbone',
	'communicator'
], function( Backbone, Communicator ){
	'use strict';

	var StatusModel = Backbone.Model.extend({
		url: '/status',
		initialize: function(){
			this.fetch();

			var socket = io.connect('http://localhost');
			console.log(socket)
		}
	});

	var statusModel = new StatusModel();

	return statusModel;
});
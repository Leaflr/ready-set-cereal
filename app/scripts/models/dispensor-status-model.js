define([
	'backbone',
	'communicator'
], function( Backbone, Communicator ){
	'use strict';

	var StatusModel = Backbone.Model.extend({
		url: '/status',
		parse: function(response){
			return response[0];
		},
		initialize: function(){
			this.fetch();
			console.log(this);
		}
	});

	var statusModel = new StatusModel();

	return statusModel;
});
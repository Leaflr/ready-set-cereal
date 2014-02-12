define([
	'backbone',
	'communicator'
], function( Backbone, Communicator ){
	'use strict';

	var StatusModel = Backbone.Model.extend({
		url: '/status',
		initialize: function(){
			this.fetch();
			console.log(this);
		}
	});

	var statusModel = new StatusModel();

	return statusModel;
});
define([
	'backbone',
	'communicator'
], function( Backbone, Communicator ){
	'use strict';

	var StatusModel = Backbone.Model.extend({
		url: '/',
		initialize: function(){
			this.fetch();
		}
	});

	var statusModel = new StatusModel();

	return statusModel;
});
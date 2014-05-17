define([
	'backbone',
	'communicator'
], function( Backbone, Communicator ){
	'use strict';

	var StatusModel = Backbone.Model.extend({
		url: '/status',
		parse: function(response){
			var orders = response.orders.length;
			response.status[0].orders = orders;
			response.status[0]['milk_temp'] = parseFloat(response.status[0]['milk_temp']).toFixed(1);
			return response.status[0];
		},
		initialize: function(){
			var self = this;
			this.fetch();
		}
	});

	return StatusModel;
});
define([
	'backbone',
	'communicator'
], function( Backbone, Communicator ){
	'use strict';

	var OrderModel = Backbone.Model.extend({
		initialize: function(){
			
		}
	});

	var orderModel = new OrderModel();

	return orderModel;
});
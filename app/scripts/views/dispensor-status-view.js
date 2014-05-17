define([
	'backbone',
	'communicator',
	'hbs!/templates/dispensor-status'
], function( Backbone, Communicator, dispensorStatusTemp ){
	'use strict';
	var orders = 14;
	return Backbone.Marionette.ItemView.extend({
		template: dispensorStatusTemp,
		className: 'nav-button inactive',
		initialize: function(){
			var self = this;

			Communicator.socket.on('status', function( data ){
				// console.log(data)
				self.updateData( data );
			});

			Communicator.events.on('orderPlaced', function( orderId ){
				self.model.set('active_order_id', orderId);
				self.orderPlaced();
			});

			Communicator.events.on('orderCancelled', function(){
				self.orderCancelled();
			});
		},
		orderCancelled: function(){
			this.model.unset('active_order_id');
			this.$el.removeClass('active').removeClass('ready').addClass('inactive').removeClass('completed');
			this.$el.find('.icon').removeClass('icon-ticket').removeClass('icon-tick').addClass('icon-time');
			this.$el.empty().html('<span class="icon icon-time"></span>Milk: <span class="milk-temp">'+this.model.get('milk_temp')+'</span> Orders: <span class="orders">'+this.model.get('orders')+'</span>')
		},
		updateData: function( data ){
			var modelData = this.model.attributes,
				milkTemp = parseFloat(data.status[0]['milk_temp']).toFixed(1),
				orderId = data.status[0]['order_id'],
				orders = data.orders.length;
			
			// orders = orders - 1;

			if ( milkTemp != modelData['milk_temp']){
				this.model.set('milk_temp', milkTemp);
			}

			if ( orders != modelData['orders'] ){
				this.model.set('orders', orders);

				if ( this.model.has('active_order_id') == false){
					this.$el.find('.orders').text(orders);
				}
			}
console.log(orders, orderId)
			if ( orderId != modelData['order_id'] && this.model.has('active_order_id') ){
				this.model.set('order_id', orderId);
				var ordersLeft = this.ordersLeft();
				this.$el.find('.orders-left').text(ordersLeft)
			}

		},
		ordersLeft: function(){
			var current = this.model.get('order_id'),
				orders = this.model.get('orders'),
				userOrder = this.model.get('active_order_id'),
				ordersLeft = userOrder - current;

			if ( ordersLeft == 0 ){
				ordersLeft = 'Place Bowl';
				this.userOrderActive();
			} else if ( ordersLeft == 1 ){
				ordersLeft = 'Next Up';
			} else if ( ordersLeft == 2 ){
				ordersLeft = '2nd in Line';
			} else if ( ordersLeft == 3 ){
				ordersLeft = '3rd in Line';
			} else if ( ordersLeft >= 4 ) {
				ordersLeft = ordersLeft + 1 + 'th in Line';
			} else if ( ordersLeft < 0 ){
				ordersLeft = 'Order Completed!';
				this.userOrderCompleted();
			}

			return ordersLeft;
		},
		orderPlaced: function(){
			var ordersLeft = this.ordersLeft();

			this.$el.removeClass('inactive').addClass('active');

			this.$el.empty().html('<span class="icon icon-ticket"></span><span class="orders-left">'+ordersLeft+'</span>');
		},
		userOrderActive: function(){
			this.$el.removeClass('active').addClass('ready');
			this.$el.find('.icon').removeClass('icon-ticket').addClass('icon-tick');
			this.$el.find('.orders-left').text('Place Bowl');
		},
		userOrderCompleted: function(){
			this.$el.removeClass('ready').addClass('completed');
			this.$el.find('.orders-left').text('Order Completed!');

			setTimeout(function(){
				Communicator.events.trigger('orderCompleted');
				Communicator.events.trigger('orderCancelled');
			}, 700)
			
		}

	});
});
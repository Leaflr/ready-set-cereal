define([
	'backbone',
	'communicator',
	'hbs!/templates/place-order',
	'jquery-ui',
	'jquery-ui-touch-punch'
], function( Backbone, Communicator, placeOrderTemp ){
	'use strict';

	var data = { 
		milk: 0,
		c1: 0,
		c2: 0,
		c3: 0
	};

	var nutritionalInfo = {
		milk: {
			calories: 120,
			fat: 9
		},
		c1 : {
			calories: 100,
			fiber: 2,
			fat: 1
		},
		c2 : {
			calories: 200,
			fiber: 4,
			fat: 2
		},
		c3 : {
			calories: 50,
			fiber: 5,
			fat: 3
		}
	}
	
	return Backbone.Marionette.ItemView.extend({
		template: placeOrderTemp,

		ui: {
			milk: '.milk',
			indicator: '.amount-indicator',
			cereal: '.cereal',
			cereal1: '.cereal1',
			cereal2: '.cereal2',
			cereal3: '.cereal3'
		},

		events: {
			'click .submit-order':'submitOrder'
		},

		onRender: function(){
			this.initSliders();
		},

		initSliders: function(){
			this.initMilkSlider();
			this.initCerealSliders();

			this.$el.find('.ui-slider-handle').append('<img src="images/spoon.svg">');
		},

		initMilkSlider: function(){
			var indicator, handle, oz, cups, self = this;

			function indicatorWidth( indicator, offset ){
				indicator.width( offset + 50 )
			}

			this.ui.milk.slider({
				min: 0,
				max: 14,
				step: 1,
				create: function( event, ui ){
					oz = self.ui.milk.find('.amount .oz');
					cups = self.ui.milk.find('.amount .cups');
				},
				start: function( event, ui ){
					indicator = self.ui.milk.find('.amount-indicator');
					handle = self.ui.milk.find('.ui-slider-handle img');
					indicatorWidth( indicator, handle.offset().left )
				},
				slide: function( event, ui ){
					indicatorWidth( indicator, handle.offset().left + 17 )
					
					oz.text( ui.value )
					cups.text( ui.value * .125 )
				},
				stop: function( event, ui ){
					indicatorWidth( indicator, handle.offset().left )
					data.milk = ui.value;
				}
			});
		},

		initCerealSliders: function(){
			var indicator, handle, value, cereal, self = this;

			function indicatorWidth( indicator, offset ){
				indicator.width( offset + 50 )
			}

			this.$el.find('.cereal').slider({
				min: 0,
				max: 2,
				create: function( event, ui ){
					value = $(this).find('.amount');

					value.text( ui.value )
				},
				start: function( event, ui ){
					cereal = $(this).attr('data-cereal');
					indicator = $(this).find('.amount-indicator');
					handle = $(this).find('.ui-slider-handle img');
					indicatorWidth( indicator, handle.offset().left )
				},
				slide: function( event, ui ){
					indicatorWidth( indicator, handle.offset().left + 17 )
					value.text( ui.value )

				},
				stop: function( event, ui ){
					indicatorWidth( indicator, handle.offset().left )
					data[cereal] = ui.value;
				}
			});
		},

		submitOrder: function(){
			
			$.ajax({
				url: '/new_order',
				type: 'POST',
				data: data
			})
		}

	});
});
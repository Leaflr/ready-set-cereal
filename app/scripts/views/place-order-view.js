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
		c3: 0,
		status: 'pending'
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
			var indicator, handle, oz, cups, self = this, 
			milk = this.$el.find('.cereal-bowl .milk'),
			milkFill = this.$el.find('.cereal-bowl .milk-fill');

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
					indicatorWidth( indicator, handle.offset().left + 17 );

					var top = -(ui.value * 8),
						width = 7.25 * ui.value,
						sizeAdjust = 120;

					milk.css({
						'margin-top': 106 + top + 'px',
						'margin-left': 43 - (width/1.84) + 'px',
						'width': sizeAdjust + width + 'px',
						'height': sizeAdjust + width + 'px',
					});

					milkFill.css({
						'margin-top': (204 + top) * .7 + 'px',
						'height': 6 * ui.value + 'px'
					});

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
			var indicator, handle, value, cereal, 
				cerealAmount = 'None', 
				self = this,
				cereal1 = this.$el.find('.cereal-bowl .cereal-1 circle'),
				cereal2 = this.$el.find('.cereal-bowl .cereal-2 circle');

			function indicatorWidth( indicator, offset ){
				indicator.width( offset + 50 )
			}

			function amountCheck(){
				var amount = data.c1 + data.c2 + data.c3;

				if ( amount == 2 ){
					return false;
				} else {
					return true;
				}
			}

			this.$el.find('.cereal').on('mousedown', function(e){
				
				
			}).slider({
				min: 0,
				max: 2,
				create: function( event, ui ){
				
				},
				start: function( event, ui ){
					value = $(this).find('.amount');
					cereal = $(this).attr('data-cereal');
					indicator = $(this).find('.amount-indicator');
					handle = $(this).find('.ui-slider-handle');
					indicatorWidth( indicator, handle.offset().left );
					
				},
				slide: function( event, ui ){
					data[cereal] = ui.value;
					var currentAmount = data.c1 + data.c2 + data.c3,
						c1Colors = ['#fc3037', '#f5903d', '#7a4562', '#b3eb78', '#58ccbb'],
						c2Colors = ['#e3be98', '#d4a77b'],
						c2Colors = ['#00b3e3'],
						showCereal,
						hideCereal;
					indicatorWidth( indicator, handle.offset().left + 17 );

					

					// if ( amountCheck() === false ){
					// 	handle.removeAttr('style')
					// 	handle.css('left','0')
					// } else {
					// 	$(this).css('pointer-events','none')

					// }
					if ( ui.value == 1 )
						cerealAmount = 'Half a bowl';
					else if ( ui.value == 2 )
						cerealAmount = 'Full bowl';

					if ( cereal == 'c1' ){
						colorSet = c1Colors;
					} else if ( cereal == 'c2' ){
						colorSet = c2Colors;
					} else if ( cereal == 'c3' ){
						colorSet = c3Colors;
					}

					if ( currentAmount == 0 && ui.value == 0){
						hideCereal = cereal1;
					} else if ( currentAmount == 0 && ui.value == 1){
						showCereal = cereal1;
						hideCereal = cereal2;
						

					} else if ( currentAmount == 1 && ui.value == 1){
						showCereal = cereal1;
						hideCereal = cereal2;

					} else if ( currentAmount == 1 && ui.value == 0){
						showCereal = cereal1;
						hideCereal = cereal2;

						if ( cereal2.closest('svg').is(':visible') ){
							var colorSet;
							for ( var c in data ){
								if ( data[c] == 1){
									if ( c == 'c1' ){
										colorSet = c1Colors;
									} else if ( c == 'c2' ){
										colorSet = c2Colors;
									} else if ( c == 'c3' ){
										colorSet = c3Colors;
									}
								}
							}
						}
					} else if ( currentAmount == 2 && ui.value == 1) {
						showCereal = cereal2;
						console.log('full')
					} else if ( currentAmount == 2 && ui.value == 2){
						showCereal = cereal2;
					}

						
						if ( hideCereal )
							hideCereal.closest('svg').hide();
						if ( showCereal ){
							showCereal.closest('svg').show();

							for ( var i = 0; i < showCereal.length; i++ ){
								showCereal[i].setAttribute('fill', colorSet[Math.floor(Math.random() * colorSet.length)])
							}
						}
					

					value.text( cerealAmount );
				},
				stop: function( event, ui ){
					indicatorWidth( indicator, handle.offset().left )
					
				}
			});
		},

		submitOrder: function(){
			
			$.ajax({
				url: '/new_order',
				type: 'POST',
				data: data
			}).success(function(){

			});
		}

	});
});
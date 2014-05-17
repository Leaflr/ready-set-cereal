define([
	'backbone',
	'communicator',
	'models/user-model',
	'hbs!/templates/place-order',
	'jquery-ui',
	'jquery-ui-touch-punch'
], function( Backbone, Communicator, userModel, placeOrderTemp ){
	'use strict';

	var data = { 
		order_id: 0,
		spoon: 1,
		milk: 0,
		c1: 0,
		c2: 0,
		c3: 0,
		status: 'pending'
	};

	var nutritionalInfo = {
		milk: {
			calories: 190,
			total_fat: 5,
			sat_fat: 3,
			protein: 8,
			sugar: 12,
			cholesterol: 20 //mg
		},
		// crunch berries
		c1 : {
			calories: 104,
			protein: 1.16, //g
			total_fat: 1.47, //g
			sat_fat: 0.37, //g
			potassium: 53.65, //mg
			sodium: 181.74, //mg
			sugar: 11.58 //g
		},
		//trix
		c2 : {
			calories: 120,
			protein: 1,
			total_fat: 1.5,
			sat_fat: 0,
			potassium: 35,
			sodium: 180,
			sugar: 10
		},
		//fruit loops
		c3 : {
			calories: 110,
			protein: 1,
			total_fat: 1,
			sat_fat: 0.5,
			potassium: 35,
			sodium: 135,
			sugar: 12
		},
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
			var self = this;

			this.initSliders();

			this.$el.find('.sliders-wrapper').hide();

			this.$el.find('.maker-message button').click(function(){
				$(this).parent().hide(100);
				self.$el.find('.sliders-wrapper').fadeIn(100);
			});
		},

		initSliders: function(){
			this.initMilkSlider();
			this.initCerealSliders();
			// console.log(this.$el.find('.ui-slider-handle:first-child'))
			this.$el.find('.slider a:first-child').remove();
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
					handle = self.ui.milk.find('.ui-slider-handle');
					indicatorWidth( indicator, handle.offset().left )
				},
				slide: function( event, ui ){
					data.milk = parseFloat(ui.value);

					if ( ui.value == 14 ){
						handle.css('margin-left','-30px')
					} else {
						handle.css('margin-left','-6px')
					}

					var top = -(ui.value * 8),
						width = 7.25 * ui.value,
						sizeAdjust = 120;

					if ( ui.value == 0 ){
						top = -5;
					}

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
					data.milk = parseFloat(ui.value);
				}
			});
		},

		initCerealSliders: function(){
			var indicator, handle, value, cereal, disabled, 
				cerealAmount = 'None', 
				self = this,
				cereal1 = this.$el.find('.cereal-bowl .cereal-1 circle'),
				cereal2 = this.$el.find('.cereal-bowl .cereal-2 circle');

			function indicatorWidth( indicator, offset ){
				indicator.width( offset + 50 )
			}

			function amountCheck(){
				var amount = data.c1 + data.c2 + data.c3;

				if ( amount > 1 ){
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
					$(this).attr('data-value', 0)
				},
				start: function( event, ui ){
					value = $(this).find('.amount');
					cereal = $(this).attr('data-cereal');
					indicator = $(this).find('.amount-indicator');
					handle = $(this).find('.ui-slider-handle');
										
				},
				slide: function( event, ui ){
					data[cereal] = parseFloat(ui.value);

					var currentAmount = data.c1 + data.c2 + data.c3,
						c1Colors = ['#fc3037', '#f5903d', '#7a4562', '#b3eb78', '#58ccbb'],
						c2Colors = ['#f9eb2a','#f9eb2a','#f9eb2a','#f9eb2a','#ffcd1e','#ffcd1e','#fc3037', '#f5903d', '#2F8E24', '#313B61', '#B12B32','#08A6C9'],
						c3Colors = ['#fc3037', '#f5903d', '#7a4562', '#b3eb78', '#58ccbb'],
						showCereal,
						hideCereal;

					if ( amountCheck() === false ){
						if ( ui.value - $(this).attr('data-value') < 0 ){

						} else {
							data[cereal] = ui.value - 1;
							return false;
						}
					} 

					$(this).attr('data-value', ui.value)

					if ( ui.value == 2 ){
						handle.css('margin-left','-30px')
					} else if ( ui.value == 1){
						handle.css('margin-left','-20px')
					} else {
						handle.css('margin-left','-6px')
					}

					if ( ui.value == 0 )
						cerealAmount = 'None';
					else if ( ui.value == 1 )
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

					console.log(currentAmount, ui.value)

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
					} else if ( currentAmount == 2 && ui.value == 2){
						showCereal = cereal2;
					}

						if ( hideCereal ){
							hideCereal.closest('svg').hide();


						}
							
						if ( showCereal ){
							showCereal.closest('svg').show();

							for ( var i = 0; i < showCereal.length; i++ ){
								showCereal[i].setAttribute('fill', colorSet[Math.floor(Math.random() * colorSet.length)])
							}

							if ( !hideCereal ){
								cereal1.closest('svg').show();

								for ( var i = 0; i < cereal1.length; i++ ){
									cereal1[i].setAttribute('fill', colorSet[Math.floor(Math.random() * colorSet.length)])
								}
							}
						}
					

					value.text( cerealAmount );
				},
				stop: function( event, ui ){
					var currentAmount = data.c1 + data.c2 + data.c3;

					if ( currentAmount == 2 ){
						disabled = true;
						$('.slider.cereal').each(function(){
							var val = $(this).attr('data-value');
							
							if ( ui.value == 2 ){
								console.log(val)
								if ( val == 0 ){
									$(this).addClass('disabled-slider');
								}
							}
						})
					} else {

					}				
				}
			});
		},

		submitOrder: function(){
			for ( var keys in data ){
				if ( keys == 'c1' || keys == 'c2' || keys == 'c3' ){
					if (data[keys] == 1)
						data[keys] = 50
					else if (data[keys] == 2)
						data[keys] = 100
				}
			}

			this.$el.hide();
			$('#leaderboard').show();

				// userModel.set('hasOrder', true);

				// userModel.set('active_order_id', 12);
				// Communicator.events.trigger('orderPlaced', 12 );
			$.ajax({
				url: '/new_order',
				type: 'POST',
				data: data
			}).success(function(data){
				userModel.set('hasOrder', true);
				userModel.set('active_order_id', data.insertId );
				Communicator.events.trigger('orderPlaced', data.insertId );
				console.log(data.insertId, ' id order recieved')
			});

		}

	});
});
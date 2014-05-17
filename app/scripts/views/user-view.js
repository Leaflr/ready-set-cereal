define([
	'backbone',
	'communicator',
	'hbs!/templates/user'
], function( Backbone, Communicator, userTemp ){
	'use strict';

	var nav,
		cerealBowl,
		navBar,
		content,
		orderButton;

	var ranks = {
		1: {
			icon: 'rsc-badge-pacifier.svg',
			name: 'Noob'
		},
		2: {
			icon: 'rsc-badge-spoon.svg',
			name: 'Spoonologist'
		},
		3: {
			icon: 'rsc-badge-milk.svg',
			name: 'Milk Master'
		},
		4: {
			icon: 'rsc-badge-bowl.svg',
			name: 'Bowl Boss'
		},
		5: {
			icon: 'rsc-badge-serious.svg',
			name: 'Serious Cereal'
		},
		6: {
			icon: 'rsc-badge-destroyer.svg',
			name: 'Destroyer of Cereal'
		}
	}

	return Backbone.Marionette.ItemView.extend({
		template: userTemp,

		events: {
			'click .nav-toggle':'navToggle',
			'click .icon-edit':'editName',
			'click .submit-name':'saveName',
			'click .shuffle-name':'randomName'
		},

		initialize: function(){
			var self = this;

			Communicator.events.on('orderCompleted', function(){
				self.showNav();

				// add experience
				setTimeout(function(){
					self.experience('add');

					// hide nav
					setTimeout(function(){
						self.hideNav();
					}, 1500);

				}, 700);
			});
		},

		onRender: function(){
			nav = this.$el.find('.nav-content');
			cerealBowl = $('.cereal-bowl');
			navBar = $('#nav');
			content = $('.content-wrapper');
			orderButton = $('.order-button');

			var self = this;

			this.experience('set');
			
			// setInterval(function(){
			// 	self.experience('add');

			// }, 4000)
		},

		editName: function(){
			var self = this;
			this.$el.find('.edit-user').show();
		},

		randomName: function(){
			var newName = this.model.generateName();

			this.$el.find('input').val(newName);
		},

		saveName: function(){
			var newName = this.$el.find('input').val();
			var rank = this.model.get('rank');
			var bowls = this.model.get('bowls');

			if (newName != this.model.get('name')){
				this.$el.find('.edit-user').hide();
				this.model.set('name', newName);
				this.$el.find('.user-name span:first-child').text(newName);

				$.ajax({
					url: '/user_name/' + this.model.get('user_id'),
					type: 'POST',
					data: { name: newName, rank: rank, bowls: bowls }
				}).success(function(response){
					console.log(response)
				});
			}

		},

		experience: function( action ){
			var rank = this.model.get('rank');
			// var rank = 3;
			var bowls = this.model.get('bowls');
			// var bowls = 3;
			var expBar = 100 * rank;
			var name = this.model.get('name');
			var id = this.model.get('user_id');
			var totalExp = 100 * bowls || 0;
			var adjustedRank = rank - 1 || 0;
			var totalBowls = 0;
			
			var prevExp = 0;

			for (var i = 1; i <= adjustedRank; i++){
				prevExp = prevExp + (i * 100);
			}
			// console.log(prevExp)
			var expBarWidth = Math.abs(prevExp - totalExp);
			var barWidth = (expBarWidth / expBar) * 100;

			if ( action == 'set' ){
				if ( barWidth === 0 ){
					barWidth = 3;
				}

				this.$el.find('.bar-value').width( barWidth + '%' );
			} else if ( action == 'add' ){
				var addExp = expBarWidth + 100;
				var newWidth = (addExp / expBar) * 100;
				
				if ( addExp >= expBar && rank <= 6 ){

					this.$el.find('.bar-value').animate({width: 100 + '%' }, 400, function(){
						$(this).animate({width: '3%'}, 50);
						$('.next-level').text('Lvl ' + (rank + 1));
						$('.level').text('Lvl' + (rank));

						$('.rank-icon img').attr('src', 'images/ranks/' + ranks[rank+1].icon);
						$('.rank-name').text(ranks[rank+1].name);
					});
					this.model.set('rank', rank + 1 );
					$('.standing').text('Level ' + (rank + 1) + ' / 6');
				} else {
					
					this.$el.find('.bar-value').animate({width: newWidth + '%' }, 400);
				}
				$('.bowl-ordered').text((bowls + 1) + ' Bowls Ordered');
				this.model.set('bowls', bowls + 1);
				bowls = this.model.get('bowls');
				rank = this.model.get('rank');

				// $.ajax({
				// 	url: '/user_name/' + id,
				// 	type: 'POST',
				// 	data: { 
				// 		name: name,
				// 		rank: rank,
				// 		bowls: bowls
				// 	},
				// 	error: function(d){
				// 		console.log(d)
				// 	},
				// 	success: function(e){
				// 		console.log(e)
				// 	}
				// }).done(function(response){
				// 	Communicator.events.trigger('userSaved')
				// });
			}

			
		},

		showNav: function(){
				content.animate({'left': '-85%'}, 200);
				cerealBowl.css('z-index','1').animate({'left': '-85%'}, 200);
				nav.animate({'right': 0 }, 200)
				navBar.addClass('nav-open').animate({'left': '-85%'}, 200);
				orderButton.animate({'left': '-85%'}, 200);
		},

		hideNav: function(){
				nav.animate({'right': '-85%' }, 200)
				navBar.removeClass('nav-open').animate({'left': '0'}, 200);
				orderButton.animate({'left': '7px'}, 200);
				content.animate({'left': 0}, 200);
				cerealBowl.css('z-index','300').animate({'left': 0}, 200);
		},

		navToggle: function(){
			if ( navBar.hasClass('nav-open') == false ){
				this.showNav();
			} else {
				this.hideNav();
			}
			
		}
	});
});
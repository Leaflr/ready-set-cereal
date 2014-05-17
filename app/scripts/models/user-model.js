define([
	'backbone',
	'communicator'
], function( Backbone, Communicator ){
	'use strict';

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

	var UserModel = Backbone.Model.extend({
		url: '/user',
		parse: function( response ){
			return response[0];
		},
		initialize: function(){
			var self = this;


			Communicator.events.on('orderCancelled', function(){
				self.set('hasOrder', false);
				self.set('active_order_id', 0);
			});

			function supportsLocalCheck() {
			  try {
			    return 'localStorage' in window && window['localStorage'] !== null;
			  } catch (e) {
			    return false;
			  }
			}
			
			delete localStorage['user'];

			var supportsLocal = supportsLocalCheck(),
				user = localStorage.getItem('user'),
				userEntry;

			if ( supportsLocal === true ){
				if ( user ) {
					var self = this;

					// this.set({ 
					// 	'rank-icon': 'rsc-badge-destroyer.svg',
					// 	'rank-name': 'Destroyer of Cereal',
					// 	'next-rank': 2,
					// 	name: 'Andy Axton',
					// 	rank: 1
					// });

					this.url = '/user/' + user;
					this.fetch().success(function(data){
						if ( self.get('rank') >= 6 )
							self.set('rank', 6);

						self.set('next_rank', self.get('rank') + 1);
						self.set('rank_icon', ranks[self.get('rank')].icon );
						self.set('rank_name', ranks[self.get('rank')].name );

						Communicator.events.trigger('userLoaded');
					});

				} else {
					var self = this;
						
					userEntry = {
						user_id: 0,
						rank: 1,
						rank_name: "Noob",
						active_order_id: 0,
						bowls: 0,
						name: self.generateName()
					}

					$.ajax({
						url: '/new_user',
						type: 'POST',
						data: userEntry
					}).success(function(data){
						localStorage.setItem('user', data.result.insertId);
						self.set(userEntry);
						self.set('bowls', 0);
						self.set('next_rank', self.get('rank') + 1);
						self.set('rank_icon', ranks[self.get('rank')].icon );
						self.set('rank_name', ranks[self.get('rank')].name );
						
						Communicator.events.trigger('userLoaded');
					});
				}
			}
		},
		generateName: function(){
			var userFirst, userLast,
				first = ['The First','Messy','Sensei','Silly','le','The Last','Señor','Sleepy','Master','Boss','Cereal','Spoon','Milk','Captain','Breakfast','Chow','Feast','General','Private','Sargeant','Sugar','Crunch','Junior','Senior','Lil\'','Big','Snack','Fancy','Ultimate','Mighty','Lieutenant'],
				last = ['Connoisseur','Gobbler','Muncher','Snacker','Biter','Nibbler','Chewer','Cruncher','Spoon','Cereal','Snap','Crackle','Pop','Explosion','Flavor','Carton','Cup','Bowl','Munch','Crunch','Snack'];
			
			userFirst = first[ Math.floor(Math.random() * first.length) ];
			userLast = last[ Math.floor(Math.random() * last.length) ];	

			return userFirst + ' ' + userLast;		
		}
	});

	var userModel = new UserModel();

	return userModel;
});
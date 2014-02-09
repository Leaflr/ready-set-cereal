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
		// url: '/user'
		initialize: function(){
			function supportsLocalCheck() {
			  try {
			    return 'localStorage' in window && window['localStorage'] !== null;
			  } catch (e) {
			    return false;
			  }
			}

			var supportsLocal = supportsLocalCheck(),
				user = localStorage.getItem('user'),
				userEntry;

			if ( supportsLocal === true ){
				if ( user ) {
					// delete localStorage['user']
					userEntry = JSON.parse(user);
					
					this.set(userEntry)
				} else {
					userEntry = {
						rank: 1,
						activeOrder: '',
						orders: '',
					}

					this.set(userEntry);
					this.save(userEntry);
					localStorage.setItem('user', JSON.stringify( userEntry ) );
				}
			} else {
				console.log('nooope');
			}

			this.set('next-rank', this.get('rank') + 1);
			this.set('rank-name', ranks[this.get('rank')].name )
			this.set('rank-icon', ranks[this.get('rank')].icon )
		}
	});

	var userModel = new UserModel();

	return userModel;
});
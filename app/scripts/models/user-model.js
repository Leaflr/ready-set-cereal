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
				// if ( user ) {
					// delete localStorage['user']
					var self = this;
					userEntry = JSON.parse(user);
					this.url = '/user/' + userEntry.insertId;

					this.fetch().success(function(){
						console.log(self)
						self.set('next-rank', self.get('rank') + 1);
						self.set('rank-name', ranks[self.get('rank')].name )
						self.set('rank-icon', ranks[self.get('rank')].icon )
					});
					console.log(userEntry, this)

					// this.set(userEntry)

					
				// } else {
					var self = this;

					userEntry = {
						rank: 1,
						name: ''
					}

					this.set(userEntry);
					this.url = '/new_user';

					this.save(userEntry, {
						success:function(data){
							userEntry.insertId = self.get('insertId');
						} 
					})

					

					localStorage.setItem('user', JSON.stringify( userEntry ) );
				// }

				

			} else {
				console.log('nooope');
			}

			
		}
	});

	var userModel = new UserModel();

	return userModel;
});
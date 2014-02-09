define([
	'backbone',
	'communicator'
], function( Backbone, Communicator ){
	'use strict';

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
		}
	});

	var userModel = new UserModel();

	return userModel;
});
module.exports = function(client) {
	'use strict';

	client.use(require('./events/client'));
	client.use(require('./events/network'));
	client.use(require('./events/channel'));
	client.use(require('./events/user'));
};

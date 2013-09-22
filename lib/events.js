module.exports = function(client) {
	client.use(require('./events/network'));
	client.use(require('./events/channel'));
	client.use(require('./events/user'));
};

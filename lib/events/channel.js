var _ = require('underscore');

module.exports = function(client) {
	client.on('network raw:mode', glue);
	client.on('network raw:privmsg', glue);
	client.on('network raw:notice', glue);
	client.on('network raw:join', glue);
	client.on('network raw:part', glue);

	client.on('network channel raw:join', function(event) {
		this.set('joined', true);
	});

	client.on('network channel raw:part', function(event) {
		this.set('joined', false);
	});

};

function glue(event) {
	if (event.prefix.indexOf('!') == -1)
		return;

	if (/#/.test(event.params[0]))
		event.network.channel(event.params[0]).emit(event.event, _.clone(event));
}

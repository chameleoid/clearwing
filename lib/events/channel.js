var _ = require('underscore');

function glue(event) {
	if (event.prefix.indexOf('!') == -1)
		return;

	event = _.clone(event);

	event.user = event.network.user(event.prefix.match(/^[^!]+/).shift());
	event.self = event.user.get('name') == event.network.get('nick');

	if (/#/.test(event.params[0]))
		event.network.channel(event.params[0]).emit(event.event, event);
}

module.exports = function(client) {
	client.on('network raw:mode', glue);
	client.on('network raw:privmsg', glue);
	client.on('network raw:notice', glue);
	client.on('network raw:join', glue);
	client.on('network raw:part', glue);

	client.on('network connect', function(event) {
		event.network.channels.forEach(function(channel) {
			if (channel.get('autojoin'))
				channel.join();
		});
	});

	client.on('network channel raw:join', function(event) {
		if (event.self)
			this.set('joined', true);

		this.emit('join', _.clone(event));
	});

	client.on('network channel raw:part', function(event) {
		if (event.self)
			this.set('joined', false);

		this.emit('part', _.clone(event));
	});
};

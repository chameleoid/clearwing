var _ = require('underscore');

function glue(event) {
	'use strict';

	event.network.emit(event.event, _.clone(event));
}

module.exports = function(client) {
	'use strict';

	var _line = {};

	client.on('network socket:connect', function(event) {
		_line[event.network._name] = '';

		event.network
			.set('connected', true)
			.set('status', 'established')
			.raw('NICK ' + event.network.get('nick'), false)
			.raw('USER clearwing 0 * :Clearwing user', false);
	});

	client.on('network socket:data', function(event) {
		event.message = (_line[event.network._name] + event.message).split('\r\n');
		_line[event.network._name] = event.message.pop();

		event.message.forEach(function(line) {
			var message = event.network.parseMessage(line);
			var command = message.command.toLowerCase();

			event.network.emit('raw:' + command, message);
		});
	});

	client.on('network raw:001', function(event) {
		event.network
			.set('status', 'connected')
			.set('nick', event.params[0])
			.emit('connect', _.clone(event));
	});

	client.on('network raw:433', function(event) {
		var nick = event.network.get('nick') + '_';
		event.network.send(false, 'nick', nick);
	});

	client.on('network raw:ping', function(event) {
		event = _.clone(event);
		event.text = event.params[event.params.length -1];
		event.network.raw('PONG :' + event.text, false);
		event.network.emit('ping', _.clone(event));
	});

	client.on('network user raw:nick', function(event) {
		if (event.self)
			event.network.set('nick', event.params[0]);
	});

	client.on('network user notice', glue);
	client.on('network user message', glue);
	client.on('network channel join', glue);
	client.on('network channel part', glue);
	client.on('network channel notice', glue);
	client.on('network channel message', glue);
};

var _ = require('underscore');

module.exports = function(client) {
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
			var message = event.network.parseMessage(line),
			    command = message.command.toLowerCase();

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

		event.network
			.send(false, 'nick', nick);
	});

	client.on('network raw:ping', function(event) {
		event.network.raw('PONG :' + event.params.join(' '), false);
	});
};

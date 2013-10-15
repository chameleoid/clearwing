var _ = require('underscore');

function glue() {
	'use strict';

	var args  = _.toArray(arguments);
	var event = args.pop();
	var wrap  = args.pop();

	if (event.prefix.indexOf('!') == -1)
		return;

	event = _.clone(event);
	event.user = event.network.user(event.prefix.match(/^[^!]+/).shift());

	if (_.isFunction(wrap))
		event = wrap(event);

	if (!/#/.test(event.params[0]))
		event.user.emit(event.event, event);
}

function gotSelf(event) {
	'use strict';

	event.self = event.user.get('name') == event.network.get('nick');
	return event;
}

module.exports = function(client) {
	'use strict';

	client.on('network raw:privmsg', glue);
	client.on('network raw:notice', glue);
	client.on('network raw:quit', glue);
	client.on('network raw:mode', _.wrap(gotSelf, glue));
	client.on('network raw:nick', _.wrap(gotSelf, glue));

	client.on('network disconnect', function(event) {
		event.network.users.forEach(function(user) {
			user.set('mode', undefined);

			user.channels.forEach(function(channel) {
				channel.set('joined', false);
				channel.set('mode', undefined);
			});
		});
	});

	client.on('network user raw:nick', function(event) {
		event = _.clone(event);
		event.old = event.user.get('name');
		event.new = event.params[0];
		event.user.set('name', event.params[0]);
		event.user._name = event.params[0].toLowerCase();
		event.user.emit('nick', event);
	});

	client.on('network user raw:quit', function(event) {
		event = _.clone(event);
		event.text = event.params[event.params.length - 1];
		event.user.emit('quit', event);
	});

	// TODO: CTCP
	client.on('network user raw:privmsg', function(event) {
		event = _.clone(event);
		event.text = event.params[event.params.length -1];
		event.user.emit('message', event);
	});

	client.on('network user raw:notice', function(event) {
		event = _.clone(event);
		event.text = event.params[event.params.length -1];
		event.user.emit('notice', event);
	});
};

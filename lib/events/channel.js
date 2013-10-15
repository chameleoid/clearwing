var _ = require('underscore');

function glue() {
	'use strict';

	var args  = _.toArray(arguments);
	var event = args.pop();
	var wrap  = args.pop();

	if (event.prefix.indexOf('!') == -1)
		return;

	event = _.clone(event);

	if (_.isFunction(wrap))
		event = wrap(event);

	if (/#/.test(event.params[0]))
		event.network.channel(event.params[0]).emit(event.event, event);
}

function user(event) {
	'use strict';

	event.user = event.network.user(event.prefix.match(/^[^!]+/).shift());
	return event;
}

function gotSelf(event) {
	'use strict';

	event.self = event.user.get('name') == event.network.get('nick');
	return event;
}

/*function glueUser(event) {
	'use strict';

	event.network.channels.forEach(function(channel) {
		if (channel.hasUser(event.user.get('name')))
			channel.emit(event.event, _.clone(event));
	});
}*/

module.exports = function(client) {
	'use strict';

	client.on('network raw:privmsg', _.wrap(user, glue));
	client.on('network raw:notice', _.wrap(user, glue));
	client.on('network raw:mode', _.wrap(_.compose(gotSelf, user), glue));
	client.on('network raw:join', _.wrap(_.compose(gotSelf, user), glue));
	client.on('network raw:part', _.wrap(_.compose(gotSelf, user), glue));
	//client.on('network user quit', glueUser);

	client.on('network connect', function(event) {
		event.network.channels.forEach(function(channel) {
			if (channel.get('autojoin'))
				channel.join();
		});
	});

	client.on('network disconnect', function(event) {
		event.network.channels.forEach(function(channel) {
			channel.set('joined', false);
			channel.set('mode', undefined);

			channel.users.forEach(function(user) {
				user.set('joined', false);
				user.set('mode', undefined);
			});
		});
	});

	client.on('network channel raw:join', function(event) {
		if (event.self)
			event.channel.set('joined', true);

		event.channel.emit('join', _.clone(event));
	});

	client.on('network channel raw:part', function(event) {
		if (event.self)
			event.channel.set('joined', false);

		event.channel.emit('part', _.clone(event));
	});

	// TODO: CTCP
	client.on('network channel raw:privmsg', function(event) {
		event = _.clone(event);
		event.text = event.params[event.params.length -1];
		event.channel.emit('message', event);
	});

	client.on('network channel raw:notice', function(event) {
		event = _.clone(event);
		event.text = event.params[event.params.length -1];
		event.channel.emit('notice', event);
	});
};

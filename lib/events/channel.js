var _ = require('underscore');

function glue() {
	var args  = _.toArray(arguments),
	    event = args.pop(),
	    wrap  = args.pop();

	if (event.prefix.indexOf('!') == -1)
		return;

	event = _.clone(event);

	if (_.isFunction(wrap))
		event = wrap(event);

	if (/#/.test(event.params[0]))
		event.network.channel(event.params[0]).emit(event.event, event);
}

function user(event) {
	event.user = event.network.user(event.prefix.match(/^[^!]+/).shift());
	return event;
}

function gotSelf(event) {
	event.self = event.user.get('name') == event.network.get('nick');
	return event;
}

module.exports = function(client) {
	client.on('network raw:privmsg', _.wrap(user, glue));
	client.on('network raw:notice', _.wrap(user, glue));
	client.on('network raw:mode', _.wrap(_.compose(gotSelf, user), glue));
	client.on('network raw:join', _.wrap(_.compose(gotSelf, user), glue));
	client.on('network raw:part', _.wrap(_.compose(gotSelf, user), glue));

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

	// TODO: CTCP
	client.on('network channel raw:privmsg', function(event) {
		event = _.clone(event);
		event.text = event.params[event.params.length -1];
		this.emit('privmsg', event);
	});
};
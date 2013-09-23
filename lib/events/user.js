var _ = require('underscore');

function glue() {
	var args  = _.toArray(arguments),
	    event = args.pop(),
	    wrap  = args.pop();

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
	event.self = event.user.get('name') == event.network.get('nick');
	return event;
}

module.exports = function(client) {
	client.on('network raw:privmsg', glue);
	client.on('network raw:notice', glue);
	client.on('network raw:mode', _.wrap(gotSelf, glue));
	client.on('network raw:nick', _.wrap(gotSelf, glue));

	client.on('network user raw:nick', function(event) {
		event = _.clone(event);
		event.old = event.user.get('name');
		event.new = event.params[0];
		event.user.set('name', event.params[0]);
		event.user._name = event.params[0].toLowerCase();
		event.user.emit('nick', event);
	});

	client.on('network user raw:privmsg', function(event) {
		event = _.clone(event);
		event.text = event.params[event.params.length -1];
		event.user.emit('message', event);
	});
};

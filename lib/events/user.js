var _ = require('underscore');

function glue(event) {
	if (event.prefix.indexOf('!') == -1)
		return;

	event = _.clone(event);

	event.user = event.network.user(event.prefix.match(/^[^!]+/).shift());
	event.self = event.user.get('name') == event.network.get('nick');

	if (!/#/.test(event.params[0]))
		event.user.emit(event.event, event);
}

module.exports = function(client) {
	client.on('network raw:mode', glue);
	client.on('network raw:privmsg', glue);
	client.on('network raw:notice', glue);
	client.on('network raw:nick', glue);

	client.on('network user raw:nick', function(event) {
		if (event.self)
			this.network.set('nick', event.params[0]);

		this.set('name', event.params[0]);
		this._name = event.params[0].toLowerCase();
	});
};

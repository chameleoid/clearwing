var _ = require('underscore');

function glue(event) {
	if (event.prefix.indexOf('!') == -1)
		return;

	if (!/#/.test(event.params[0]))
		event.network.user(event.prefix.match(/^[^!]+/).shift()).emit(event.event, _.clone(event));
}

module.exports = function(client) {
	client.on('network raw:mode', glue);
	client.on('network raw:privmsg', glue);
	client.on('network raw:notice', glue);
};

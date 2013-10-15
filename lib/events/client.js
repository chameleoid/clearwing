var _ = require('underscore');

function glue(event) {
	'use strict';

	event.client.emit(event.event, _.clone(event));
}

module.exports = function(client) {
	'use strict';

	client.on('network connect', glue);
	client.on('network user notice', glue);
	client.on('network user message', glue);
	client.on('network channel join', glue);
	client.on('network channel part', glue);
	client.on('network channel notice', glue);
	client.on('network channel message', glue);
};

if (process.title == 'node')
	var net = require('net');

/** @constructor */
function Socket(network) {
	'use strict';

	/** {@link Clearwing} instance */
	this.client = network.client;

	/** {@link Network} instance */
	this.network = network;

	this.setUp();
}

// TODO: tearDown()
Socket.prototype.setUp = function() {
	'use strict';

	var that = this;

	if (process.title == 'node') {
		this._socket = new net.Socket();

		// bind events
		// connect, data, end, timeout, drain, error, close
		this._socket.on('connect', function() {
			that.emit('connect');
		});

		this._socket.on('error', function(error) {
			that.emit('error', { error: error });
		});

		this._socket.on('data', function(data) {
			that.emit('data', { message: data.toString() });
		});
	}
};

Socket.prototype.write = function(data) {
	'use strict';

	if (this.client.get('debug') > 2)
		console.log(data.replace(/[\r\n]+$/, ''));

	if (process.title == 'node')
		this._socket.write(data);
};

Socket.prototype.on = function(event, cb) {
	'use strict';

	this.network.on('socket:' + event, cb);
};

Socket.prototype.emit = function(event, data) {
	'use strict';

	this.network.emit('socket:' + event, data || {});
};

Socket.prototype.end = function(data) {
	'use strict';

	if (process.title == 'node') {
		this._socket.end(data);
		this.setUp();
	}
};

Socket.prototype.connect = function() {
	'use strict';

	if (process.title == 'node')
		this._socket.connect.apply(this._socket, arguments);
};

module.exports = Socket;

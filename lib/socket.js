var _ = require('underscore');

if (process.title == 'node')
	var net = require('net');

/** @constructor */
function Socket(network) {
	/** {@link Clearwing} instance */
	this.client = network.client;

	/** {@link Network} instance */
	this.network = network;

	var that = this;

	if (process.title == 'node') {
		var socket       =
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
}

Socket.prototype.write = function(data) {
	if (process.title == 'node')
		this._socket.write(data);
};

Socket.prototype.on = function(event, cb) {
	this.network.on('socket:' + event, cb);
};

Socket.prototype.emit = function(event, data) {
	this.network.emit('socket:' + event, data || {});
};

Socket.prototype.close = function(data) {
	if (process.title == 'node')
		this._socket.close(data);
};

Socket.prototype.connect = function() {
	if (process.title == 'node')
		this._socket.connect.apply(this._socket, arguments);
};

module.exports = Socket;

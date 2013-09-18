var _                  = require('underscore'),
    Clearwing          = require('./clearwing'),
    Channel            = require('./channel'),
    User               = require('./user'),
    ClearwingNamespace = require('./clearwingnamespace'),
    Socket             = require('./socket');

/**
 * @constructor
 * @augments ClearwingNamespace
 */
function Network(client, name) {
	var that = this;

	/** {@link Clearwing} instance */
	this.client = client;

	/** {@link Channel} list */
	this.channels = [];

	/** {@link User} list */
	this.users = [];

	/**
	 * Lowercase network name
	 * @private
	 */
	this._name = name.toLowerCase();

	/**
	 * Namespace
	 * @private
	 * @static
	 */
	this._namespace = [{ network: this._name }];

	// TODO: better buffering
	/**
	 * Message buffer
	 * @private
	 */
	this._sendBuffer = [];

	/**
	 * Interval for passing messages to the server
	 * @private
	 */
	this._sendInterval = setInterval(function() {
		if (that.get('connected') && that._sendBuffer.length)
			that._socket.write(that._sendBuffer.shift() + '\r\n');
	}, 1000);

	/**
	 * Our {@link Socket}
	 * @private
	 */
	this._socket = new Socket(this);

	/* set up data */
	this
		.set('name', name)
		.set('connected', false)
		.set('status', 'disconnected')
		.set('nick', client.get('nick'))
		.set('server', '')
		.set('port', 6667)
		.set('pass', '')
		.set('ssl', false);

	/* set up events */
	this._socket.on('data', function(data) {
		var message = that.parseMessage(data.message);

		message.forEach(function(data) {
			that.emit('raw', data);
			that.emit('raw:' + data.command.toLowerCase(), data);
		});
	});

	this._socket.on('connect', function() {
		that.set('connected', true);
		that.raw('NICK ' + this.get('nick'), false);
		that.raw('USER clearwing 0 * :Clearwing user', false);
	});
}

Network.prototype = new ClearwingNamespace();
Network.prototype.constructor = Network;


/**
 * Lookup a channel by name
 * Note: This function will also create a new {@link Channel} if one is not found
 * @param {string} channel Channel name
 * @return {Channel}
 */
Network.prototype.channel = function(channel) {
	return this.channels.filter(function(n) { return n._name == channel.toLowerCase(); }).pop() ||
	       this.channels[this.channels.push(new Channel(this, channel)) - 1];
};


/**
 * See if a channel exists
 * @param {string} channel Channel name
 * @return {bool} True if channel exists, false if it does not
 */
Network.prototype.hasChannel = function(channel) {
	return !!this.channels.filter(function(n) { return n._name == channel.toLowerCase(); }).length;
};


/**
 * Lookup a user by name
 * Note: This function will also create a new {@link User} if one is not found
 * @param {string} user User name
 * @return {User}
 */
Network.prototype.user = function(user) {
	return this.users.filter(function(n) { return n._name == user.toLowerCase(); }).pop() ||
	       this.users[this.users.push(new User(this, user)) - 1];
};


/**
 * See if a user exists
 * @param {string} user User name
 * @return {bool} True if user exists, false if it does not
 */
Network.prototype.hasUser = function(user) {
	return !!this.users.filter(function(n) { return n._name == user.toLowerCase(); }).length;
};


/**
 * Parse raw messages into an array of events
 * @param {string} message Raw message to parse
 * @param {number} [time=Date.now()] When the message was received
 * @return {array}
 */
Network.prototype.parseMessage = function(message, time) {
	var network = this;

	time = time || Date.now();

	return message.split(/\r\n/g).map(function(line) {
		if (!line.length) return;

		var match = line.match(/^((?::[^\0\r\n ]+ )?)([a-z]+|[0-9]{3})((?: [^\0\r\n :][^\0\r\n ]*){0,14})(( :?[^\0\r\n]*)?)/i),
		    middle = match[3].length ? match[3].substr(1).split(' ') : [],

		    message = {
			    time: time,
			    raw: line,
			    prefix: match[1].substr(1, match[1].length - 2),
			    command: match[2],
			    params: middle.concat(match[4].substr(2))
		    };

		return message;
	}).filter(function($) { return !!$; });
};


/**
 * Connect to a server
 * @param {object} options Connection options
 * @returns {this}
 */
Network.prototype.connect = function(options) {
	if (this.get('status') != 'disconnected')
		this.disconnect();

	if (!_.isObject(options))
		throw new Error('Expected an object to be passed');

	this
		.set('name', options.name || this.client.get('name'))
		.set('status', 'connecting')
		.set('host', options.host)
		.set('pass', options.pass || '')
		.set('port', options.port || 6667)
		.set('ssl', options.ssl || false);

	this._socket.connect(this.get('port'), this.get('host'));

	return this;
};


/**
 * Disconnect from the connected server
 * @return {this}
 */
Network.prototype.disconnect = function() {
	this._socket.close('QUIT :Leaving.');
	return this;
};


/**
 * Reconnect to server
 * @return {this}
 */
Network.prototype.reconnect = function() {
	this.disconnect().connect({
		name: this.get('name'),
		host: this.get('host'),
		port: this.get('port'),
		pass: this.get('pass'),
		ssl: this.get('ssl')
	});
};


/**
 * Send a raw message to the server
 * @example network.raw('PRIVMSG #channel :Hello all!');
 * @param {string} message Message to send
 * @param {bool} [buffered=true] Buffered sending?
 * @return {Network}
 */
Network.prototype.raw = function(message, buffer) {
	if (typeof buffer == 'undefined' || buffer === true)
		this._sendBuffer.push(message);
	else
		this._socket.write(message + '\r\n');

	return this;
};

module.exports = Network;

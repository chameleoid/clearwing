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
		if (that.get('status') == 'connected' && that._sendBuffer.length)
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
		.set('password', '')
		.set('ssl', false);
}

Network.prototype = new ClearwingNamespace();
Network.prototype.constructor = Network;


/**
 * Lookup a channel by name
 * Note: This function will also create a new {@link Channel} if one is not found
 * @param {string} channel Channel name
 * @param {function} [ctx] Channel context
 * @return {Channel}
 */
Network.prototype.channel = function(channel, ctx) {
	if (!this.hasChannel(channel)) {
		_.defer(function() {
			if (channel.network.get('status') == 'connected' && !channel.get('joined'))
				channel.join();
		});
	}

	channel = this.channels.filter(function(n) { return n._name == channel.toLowerCase(); }).pop() ||
	          this.channels[this.channels.push(new Channel(this, channel)) - 1];

	if (_.isFunction(ctx))
		ctx.call(channel, channel);

	return channel;
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
 * @param {function} [ctx] User context
 * @return {User}
 */
Network.prototype.user = function(user, ctx) {
	user = this.users.filter(function(n) { return n._name == user.toLowerCase(); }).pop() ||
	       this.users[this.users.push(new User(this, user)) - 1];

	if (_.isFunction(ctx))
		ctx.call(user, user);

	return user;
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
Network.prototype.parseMessage = function(line, time) {
	var network = this;

	time = time || Date.now();

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
};


/**
 * Connect to a server
 * @param {object} [options] Connection options
 * @returns {this|false} Returns {this} if connecting, false if already connected
 */
Network.prototype.connect = function(options) {
	if (this.get('status') != 'disconnected')
		return false;

	if ((_.isObject(options) && !options.server) || !this.get('server'))
		throw new Error('Server option not passed, or server not set');

	if (!options)
		options = {};

	this
		.set('status', 'connecting')
		.set('name', options.name || this.get('name') || this.client.get('name'))
		.set('server', options.server || this.get('server'))
		.set('password', options.password || this.get('password') || '')
		.set('port', options.port || this.get('port') || 6667)
		.set('ssl', options.ssl || this.get('ssl') || false);

	this._socket.connect(this.get('port'), this.get('server'));

	return this;
};


/**
 * Disconnect from the connected server
 * @return {this}
 */
Network.prototype.disconnect = function() {
	this._socket.end('QUIT :Leaving.');
	this.set('status', 'disconnected');
	this.set('connected', false);
	this.emit('disconnect', {});
	return this;
};


/**
 * Reconnect to server
 * @return {this}
 */
Network.prototype.reconnect = function() {
	return this.disconnect().connect();
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

/**
 * Send a command to the server
 * @param {bool} [buffer=true] Whether or not to buffer sending
 * @param {string} command Command
 * @param {...string} [params] Command parameters
 */
Network.prototype.send = function() {
	var params  = _.toArray(arguments),
	    buffer  = _.isBoolean(params[0]) ? params.shift() : true,
	    command = params.shift();

	// TODO: add command hooks

	// automatically add `:` to trailing parameter if necessary
	if (params.length) {
		var trailing = params.pop();

		if (/ |:/.test(trailing))
			trailing = ':' + trailing;

		params.push(trailing);
	}

	// make our command string an array
	command = [command.toUpperCase()].concat(params);

	// send some raw message
	return this.raw(command.join(' '), buffer);
};

module.exports = Network;

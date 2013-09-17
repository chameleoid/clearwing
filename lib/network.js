var _                  = require('underscore'),
    Clearwing          = require('./clearwing'),
    Channel            = require('./channel'),
    User               = require('./user'),
    ClearwingNamespace = require('./clearwingnamespace');

/**
 * @constructor
 * @augments ClearwingNamespace
 */
function Network(client, name) {
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

	/* set up data */
	this
		.set('name', name)
		.set('connected', false)
		.set('status', 'disconnected')
		.set('nick', client.get('nick'))
		.set('server', '')
		.set('port', 6667);
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
			    param: middle.concat(match[4].substr(2))
		    };

		return message;
	});
};


/**
 * Emit an event
 * @param {...object} [namespace] Event namespace
 * @param {string} event Event name
 * @param {object} data Event data to pass to listeners
 * @return {bool} False if no events are bound, true otherwise
 */
Network.prototype.emit = function() {
	return this.client.emit.apply(this.client, this._namespace.concat(arguments));
};


/**
 * Send a raw message to the server
 * @example network.raw('PRIVMSG #channel :Hello all!');
 * @param {string} message Message to send
 * @return {Network}
 */
Network.prototype.raw = function(message) {
	this._socket.write(message + '\r\n');
	return this;
};

module.exports = Network;

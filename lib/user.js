var _ = require('underscore');
var ClearwingNamespace = require('./clearwingnamespace');

/**
 * @constructor
 * @augments ClearwingNamespace
 */
function User(network, name) {
	'use strict';

	/** {@link Clearwing} instance */
	this.client = network.client;

	/** {@link Network} instance */
	this.network = network;

	/** {@link Channel} list */
	this.channels = [];

	name = User.sanitize(name);

	/**
	 * Lowercase user name
	 * @private
	 */
	this._name = name.toLowerCase();

	/**
	 * Namespace
	 * @private
	 * @static
	 */
	this._namespace = this.network._namespace.concat({ user: this._name });

	this.set('name', name);
}


User.prototype = new ClearwingNamespace();
User.prototype.constructor = User;


/**
 * Sanitize nick to an RFC-2812 nickname
 * @param {string} nick Any nick
 * @return {string}
 */
User.sanitize = function(nick) {
	'use strict';

	return nick.replace(/^[^a-z\[\]\\`_\^{|}]/i, '')
	           .replace(/[^a-z0-9\[\]\\`_\^{|}-]/i, '');
};


/**
 * Set info based on mask
 * @param {string} mask User mask
 * @return {this}
 */
User.prototype.mask = function(mask) {
	mask = mask.match(/^[^!]+!([^@]+)@(.+)$/);

	this
		.set('ident', mask[1])
		.set('host', mask[2])
		.set('mask', mask[0]);

	return this;
};


/**
 * Lookup a channel by name
 * Note: This function will also create a new {@link Channel} if one is not found
 * @param {string} channel Channel name
 * @param {function} [ctx] Channel context
 * @return {Channel}
 */
User.prototype.channel = function(channel, ctx) {
	'use strict';

	channel = this.channels.filter(function(n) { return n._name == channel.toLowerCase(); }).pop() ||
	          this.channels[this.channels.push(this.network.channel(channel)) - 1];

	if (_.isFunction(ctx))
		ctx.call(channel, channel);

	return channel;
};


/**
 * See if a channel exists
 * @param {string} channel Channel name
 * @return {bool} True if channel exists, false if it does not
 */
User.prototype.hasChannel = function(channel) {
	'use strict';

	return !!this.channels.filter(function(n) { return n._name == channel.toLowerCase(); }).length;
};


/**
 * Send a message to the user
 * @param {string} message Message to send
 * @return {this}
 */
User.prototype.message = function(message) {
	'use strict';

	this.network.send('privmsg', this.get('name'), message);
	return this;
};


/**
 * Send a CTCP message to the user
 * @param {string} command CTCP command
 * @param {string} [params] CTCP parameters
 * @return {this}
 */
User.prototype.ctcp = function(command, params) {
	'use strict';

	command = command.toUpperCase();
	var message = [command].concat(params);
	return this.message('\x01' + message.join(' ') + '\x01');
};


/**
 * Send an action to the user
 * @param {string} message Action message contents
 * @return {this}
 */
User.prototype.action = function(message) {
	'use strict';

	return this.ctcp('action', message);
};


/**
 * Send a notice to user
 * @param {string} message Notice message
 * @return {this}
 */
User.prototype.notice = function(message) {
	'use strict';

	this.network.send('notice', this.get('name'), message);
	return this;
};

module.exports = User;

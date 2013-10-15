var _ = require('underscore');
var ClearwingNamespace = require('./clearwingnamespace');

/**
 * @constructor
 * @augments ClearwingNamespace
 */
function Channel(network, name) {
	'use strict';

	/** {@link Clearwing} instance */
	this.client = network.client;

	/** {@link Network} instance */
	this.network = network;

	/** {@link User} list */
	this.users = [];

	name = Channel.sanitize(name);

	/**
	 * Lowercase channel name
	 * @private
	 */
	this._name = name.toLowerCase();

	/**
	 * Namespace
	 * @private
	 * @static
	 */
	this._namespace = this.network._namespace.concat({ channel: this._name });

	/* set up data */
	this
		.set('name', name)
		.set('topic', '')
		.set('mode', '')
		.set('joined', false);
}


/**
 * Sanitize channel name
 * @todo Implement RFC-2812 enforcement
 * @param {string} name Channel name
 * @return {string}
 */
Channel.sanitize = function(name) {
	'use strict';

	return name.replace(/^([^#+!&])/, '#$1');
};


Channel.prototype = new ClearwingNamespace();
Channel.prototype.constructor = Channel;


/**
 * Lookup a user by name
 * Note: This function will also create a new {@link User} if one is not found
 * @param {string} user User name
 * @param {function} [ctx] User context
 * @return {User}
 */
Channel.prototype.user = function(user, ctx) {
	'use strict';

	user = this.users.filter(function(n) { return n._name == user.toLowerCase(); }).pop() ||
	       this.users[this.users.push(this.network.user(user)) - 1];

	if (_.isFunction(ctx))
		ctx.call(user, user);

	return user;
};


/**
 * See if a user exists
 * @param {string} user User name
 * @return {bool} True if user exists, false if it does not
 */
Channel.prototype.hasUser = function(user) {
	'use strict';

	return !!this.users.filter(function(n) { return n._name == user.toLowerCase(); }).length;
};


/**
 * Join channel if we aren't already joined
 * @return {this}
 */
Channel.prototype.join = function() {
	'use strict';

	if (!this.get('joined'))
		this.network.send('join', this.get('name'));

	return this;
};


/**
 * Part channel if we're joined
 * @param {string} [message] Part message
 * @return {this}
 */
Channel.prototype.part = function(message) {
	'use strict';

	if (this.get('joined'))
		this.network.send('part', this.get('name'), message);

	return this;
};


/**
 * Send a message to the channel
 * @param {string} message Message to send
 * @return {this}
 */
Channel.prototype.message = function(message) {
	'use strict';

	this.network.send('privmsg', this.get('name'), message);
	return this;
};


/**
 * Send a CTCP message to the channel
 * @param {string} command CTCP command
 * @param {string} [params] CTCP parameters
 * @return {this}
 */
Channel.prototype.ctcp = function(command, params) {
	'use strict';

	command = command.toUpperCase();
	var message = [command].concat(params);
	return this.message('\x01' + message.join(' ') + '\x01');
};


/**
 * Send an action to the channel
 * @param {string} message Action message contents
 * @return {this}
 */
Channel.prototype.action = function(message) {
	'use strict';

	return this.ctcp('action', message);
};


/**
 * Send a notice to channel
 * @param {string} message Notice message
 * @return {this}
 */
Channel.prototype.notice = function(message) {
	'use strict';

	this.network.send('notice', this.get('name'), message);
	return this;
};

/**
 * Kick a user/users from a channel
 * @param {string|array} user Single user or array of users
 * @param {string} [message] Kick message
 */
Channel.prototype.kick = function(user, message) {
	'use strict';

	var that = this;
	user = [].concat(user);

	user.forEach(function(user) {
		that.network.send('kick', that.get('name'), user, message);
	});
};

module.exports = Channel;

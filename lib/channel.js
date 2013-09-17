var _ = require('underscore');

/** @constructor */
function Channel(network, name) {
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
	return name.replace(/^([^#+!&])/, '#$1');
};


/**
 * Lookup a user by name
 * Note: This function will also create a new {@link User} if one is not found
 * @param {string} user User name
 * @return {User}
 */
Channel.prototype.user = function(user) {
	return this.users.filter(function(n) { return n._name == user.toLowerCase(); }).pop() ||
	       this.users[this.users.push(this.network.user(user)) - 1];
};


/**
 * See if a user exists
 * @param {string} user User name
 * @return {bool} True if user exists, false if it does not
 */
Channel.prototype.hasUser = function(user) {
	return !!this.users.filter(function(n) { return n._name == user.toLowerCase(); }).length;
};


/**
 * Lookup a property
 * @param {...object} [namespace] Namespace name
 * @param {string} property Property name
 * @return {mixed}
 */
Channel.prototype.get = function() {
	return this.network.get.apply(this.network, [{ channel: this._name }].concat(_.toArray(arguments)));
};


/**
 * Set a property
 * @param {...object} [namespace] Namespace name
 * @param {string} property Property name
 * @param {mixed} value New property value
 * @return {mixed}
 */
Channel.prototype.set = function() {
	return this.network.set.apply(this.network, [{ channel: this._name }].concat(_.toArray(arguments)));
};

module.exports = Channel;

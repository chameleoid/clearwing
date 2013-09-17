var _ = require('underscore');

/** @constructor */
function User(network, name) {
	/** {@link Clearwing} instance */
	this.client = network.client;

	/** {@link Network} instance */
	this.network = network;

	/** {@link Channel} list */
	this.channels = [];

	name = User.sanitize(name);

	/** Lowercase user name */
	this._name = name.toLowerCase();

	this.set('name', name);
}


/**
 * Sanitize nick to an RFC-2812 nickname
 * @param {string} nick Any nick
 * @return {string}
 */
User.sanitize = function(nick) {
	return nick.replace(/^[^a-z\[\]\\`_\^{|}]/i, '')
	           .replace(/[^a-z0-9\[\]\\`_\^{|}-]/i, '');
};


/**
 * Lookup a channel by name
 * Note: This function will also create a new {@link Channel} if one is not found
 * @param {string} channel Channel name
 * @return {Channel}
 */
User.prototype.channel = function(channel) {
	return this.channels.filter(function(n) { return n._name == channel.toLowerCase(); }).pop() ||
	       this.channels[this.channels.push(this.network.channel(channel)) - 1];
};


/**
 * See if a channel exists
 * @param {string} channel Channel name
 * @return {bool} True if channel exists, false if it does not
 */
User.prototype.hasChannel = function(channel) {
	return !!this.channels.filter(function(n) { return n._name == channel.toLowerCase(); }).length;
};


/**
 * Lookup a property
 * @param {...object} [namespace] Namespace name
 * @param {string} property Property name
 * @return {mixed}
 */
User.prototype.get = function() {
	return this.network.get.apply(this.network, [{ user: this._name }].concat(_.toArray(arguments)));
};


/**
 * Set a property
 * @param {...object} [namespace] Namespace name
 * @param {string} property Property name
 * @param {mixed} value New property value
 * @return {mixed}
 */
User.prototype.set = function() {
	return this.network.set.apply(this.network, [{ user: this._name }].concat(_.toArray(arguments)));
};

module.exports = User;

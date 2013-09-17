var _ = require('underscore');

/**
 * Provides a number of namespaced features of {@link Clearwing}
 * @constructor
 */
function ClearwingNamespace() {
	/**
	 * Namespace
	 * @abstract
	 * @private
	 * @static
	 */
	this._namespace = [];
}

/**
 * Lookup a property
 * @param {...object} [namespace] Namespace name
 * @param {string} property Property name
 * @return {mixed}
 */
ClearwingNamespace.prototype.get = function() {
	return this.client.get.apply(this.client, this._namespace.concat(_.toArray(arguments)));
};

/**
 * Set a property
 * @param {...object} [namespace] Namespace name
 * @param {string} property Property name
 * @param {mixed} value New property value
 * @return {this}
 */
ClearwingNamespace.prototype.set = function() {
	this.client.set.apply(this.client, this._namespace.concat(_.toArray(arguments)));
	return this;
};


/**
 * Emit an event
 * @param {...object} [namespace] Event namespace
 * @param {string} event Event name
 * @param {object} data Event data to pass to listeners
 * @return {bool} False if no events are bound, true otherwise
 */
ClearwingNamespace.prototype.emit = function() {
	return this.client.emit.apply(this.client, this._namespace.concat(_.toArray(arguments)));
};


/**
 * Bind an event
 * @param {...object} [namespace] Event namespace
 * @param {string|regexp} event Event name
 * @param {function} callback Callback function
 * @return {this}
 */
ClearwingNamespace.prototype.on = function() {
	this.client.on.apply(this.client, this._namespace.concat(_.toArray(arguments)));
	return this;
};

module.exports = ClearwingNamespace;

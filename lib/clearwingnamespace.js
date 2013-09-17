var _ = require('underscore');

/**
 * Provides a number of namespaced features of {@link Clearwing}
 * @constructor
 */
function ClearwingNamespace() {}

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

module.exports = ClearwingNamespace;

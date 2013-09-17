var _       = require('underscore'),
    Network = require('./network');

/**
 * Clearwing object
 * @constructor
 */
function Clearwing(options) {
	/** {@link Network} list */
	this.networks = [];

	/**
	 * Stored data
	 * @private
	 */
	this._data = {};

	/**
	 * Events
	 * @private
	 */
	this._events = {};

	/* set up data */
	this
		.set('nick', 'Fish' + Math.floor(Math.random() * 1000));
}


/**
 * Lookup a property
 * @param {...object} [namespace] Namespace name
 * @param {string} property Property name
 * @return {mixed}
 */
Clearwing.prototype.get = function() {
	return this._data[Clearwing.stringifyPropName(arguments)];
};


/**
 * Set a property
 * @param {...object} [namespace] Namespace name
 * @param {string} property Property name
 * @param {mixed} value New property value
 * @return {Clearwing}
 */
Clearwing.prototype.set = function() {
	this._data[Clearwing.stringifyPropName(_.toArray(arguments).slice(0, -1))] = arguments[arguments.length - 1];
	return this;
};

/**
 * Bind an event
 * @param {...object} [namespace] Namespace name
 * @param {string|regexp} event Event name
 * @param {function} callback Callback function
 * @return {Clearwing}
 */
Clearwing.prototype.on = function() {
	var ns       = _.toArray(arguments),
	    callback = ns.splice(-1).pop(),
	    cb       = callback,
	    event    = ns.splice(-1).pop(),
	    regexp   = event,
	    prop     = '',
	    that     = this;

	ns.push(_.isRegExp(regexp) ? 'msg' : event);
	prop = Clearwing.stringifyPropName(ns);

	if (!_.isFunction(callback))
		return this;

	if (_.isRegExp(regexp)) {
		callback = function(event) {
			if (regexp.test(event.text))
				event.text.match(regexp, cb.bind(that, event));
		};
	}

	(this._events[prop] = this._events[prop] || []).push(callback);

	return this;
};


/**
 * Emit an event
 * @param {...object} [namespace] Namespace name
 * @param {string} event Event name
 * @param {object} data Event data
 * @return {bool} False if no events are bound, true otherwise
 */
Clearwing.prototype.emit = function() {
	var ns      = _.toArray(arguments),
	    data    = ns.splice(-1).pop(),
	    prop    = '',
	    props   = [],
	    that    = this,
	    caught  = false,
	    replace = [
		    [/(user).[^ ]+/, '$1'],
		    [/(user).[^ ]+ /, ''],
		    [/(channel).[^ ]+/, '$1'],
		    [/(channel).[^ ]+ /, ''],
		    [/(network).[^ ]+/, '$1'],
		    [/(network).[^ ]+ /, '']
	    ];

	if (arguments.length < 2)
		throw new Error('#emit() expects at least two arguments');

	if (!_.isObject(arguments[arguments.length - 1]))
		throw new Error('#emit() expected argument ' + arguments.length + ' to be object');

	if (!_.isString(arguments[arguments.length - 2]))
		throw new Error('#emit() expected argument ' + (arguments.length - 1) + ' to be string');

	prop = Clearwing.stringifyPropName(ns);

	props.push(prop);

	replace.forEach(function(re) {
		props.forEach(function(prop) {
			props.push(prop.replace.apply(prop, re));
		});
	});

	props = _.chain(props).uniq().sortBy(function(e) {
		return (/network([. ]|$)/.test(e) || -800) +
		       (/channel([. ]|$)/.test(e) || -400) +
		       (/user([. ]|$)/.test(e)    || -200) +
		       e.length;
	}).value();

	props.forEach(function(event) {
		if (!_.isArray(that._events[event]) || !that._events[event].length)
			return false;

		if (!caught)
			caught = true;

		that._events[event].forEach(function(cb) {
			cb.call(that, data);
		});
	});

	return caught;
};


/**
 * Helper function for flattening lists into property-safe values
 * @param {array} prop Property name array
 * @return {string}
 */
Clearwing.stringifyPropName = function(prop) {
	// Convert [{ network: 'foobar' }, 'option']
	// to 'network.foobar option'
	return _.map(prop, function(a) {
		return _.isObject(a) && !_.isArray(a) ?
		       _.chain(a).pairs().flatten().join('.').value() :
		       a;
	}).join(' ').toLowerCase();
};


/**
 * Helper function to convert flat property names into array form
 * @param {string} prop Property string
 * @return {array}
 */
Clearwing.parsePropName = function(prop) {
	return _.map(prop.toLowerCase().split(' '), function(s) {
		// Yes, a.split('.', 2) would give us two elements, but
		// they would be equivalent to a.split('.').slice(0, 2)
		var a = s.split('.'),
		    o = {};

		if (a.length < 2)
			return s;

		o[a[0]] = a.slice(1).join('.');
		return o;
	});
};


/**
 * Lookup a network by name
 *
 * Note: This function will also create a new {@link Network} if one is not found
 *
 * See {@link Clearwing#hasNetwork} if you want to know if a network exists
 * @param {string} network Network name
 * @return {Network}
 */
Clearwing.prototype.network = function(network) {
	return this.networks.filter(function(n) { return n._name == network.toLowerCase(); }).pop() ||
	       this.networks[this.networks.push(new Network(this, network)) - 1];
};


/**
 * See if a network exists
 * @param {string} network Network name
 * @return {bool} True if network exists, false if it does not
 */
Clearwing.prototype.hasNetwork = function(network) {
	return !!this.networks.filter(function(n) { return n._name == network.toLowerCase(); }).length;
};


/**
 * Use a plugin
 * @param {function} plugin
 * @return {Clearwing}
 */
Clearwing.prototype.use = function(plugin) {
	if (_.isFunction(plugin))
		plugin.call(this, this);

	return this;
};

module.exports = Clearwing;

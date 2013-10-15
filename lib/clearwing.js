var _ = require('underscore');
var Network = require('./network');

/**
 * Clearwing object
 * @constructor
 */
function Clearwing(options) {
	'use strict';

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

	/* set up events */
	this.use(require('./events'));
}


/**
 * Helper function for flattening lists into property-safe values
 * @param {array} prop Property name array
 * @return {string}
 */
Clearwing.stringifyPropName = function(prop) {
	'use strict';

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
	'use strict';

	return _.map(prop.toLowerCase().split(' '), function(s) {
		// Yes, a.split('.', 2) would give us two elements, but
		// they would be equivalent to a.split('.').slice(0, 2)
		var a = s.split('.');
		var o = {};

		if (a.length < 2)
			return s;

		o[a[0]] = a.slice(1).join('.');
		return o;
	});
};


/**
 * Lookup a property
 * @param {...object} [namespace] Namespace name
 * @param {string} property Property name
 * @return {mixed}
 */
Clearwing.prototype.get = function() {
	'use strict';

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
	'use strict';

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
	'use strict';

	var ns = _.toArray(arguments);
	var callback = ns.splice(-1).pop();
	var event = ns.splice(-1).pop();
	var prop = '';

	ns.push(_.isRegExp(event) ? 'message' : event);
	prop = Clearwing.stringifyPropName(ns);

	if (!_.isFunction(callback))
		return this;

	if (_.isRegExp(event)) {
		var regexp = event;
		var cb = callback;

		callback = function(event) {
			if (!_.isString(event.text) || !regexp.test(event.text))
				return;

			event = _.clone(event);

			event.matches = event.text.match(regexp);
			event.replaced = event.text.replace(regexp, '');

			cb.call(this, event);
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
	'use strict';

	var ns = _.toArray(arguments);
	var data = ns.splice(-1).pop();
	var event = ns.splice(-1).pop();
	var that = this;

	if (arguments.length < 2)
		throw new Error('#emit() expects at least two arguments');

	if (!_.isObject(arguments[arguments.length - 1]))
		throw new Error('#emit() expected argument ' + arguments.length + ' to be object');

	if (!_.isString(arguments[arguments.length - 2]))
		throw new Error('#emit() expected argument ' + (arguments.length - 1) + ' to be string');

	var prop = Clearwing.stringifyPropName(ns.concat(event));
	var props = [prop];

	[
		[/(user).[^ ]+/, '$1'],
		[/(channel).[^ ]+/, '$1'],
		[/(network).[^ ]+/, '$1'],
	].forEach(function(re) {
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

	var target = this;
	ns.forEach(function(item) {
		var prop = _.keys(item).pop();
		var name = item[prop];

		switch (prop) {
			case 'network': target = data.network = that.network(name); break;
			case 'user': target = data.user = data.network.user(name); break;
			case 'channel': target = data.channel = data.network.channel(name); break;
		}
	});

	data.client = that;

	data.event = event;

	var caught = false;
	props.forEach(function(path) {
		if (!_.isArray(that._events[path]) || !that._events[path].length)
			return false;

		if (!caught)
			caught = true;

		that._events[path].forEach(function(cb) {
			cb.call(target, data);
		});
	});

	if (this.get('debug') > 5)
		console.log(data);
	else if ((this.get('debug') > 4 && data.raw) || (this.get('debug') > 3 && data.raw && !caught))
		console.log(data.event, data.raw);

	return caught;
};


/**
 * Lookup a network by name
 *
 * Note: This function will also create a new {@link Network} if one is not found
 *
 * See {@link Clearwing#hasNetwork} if you want to know if a network exists
 * @param {string} network Network name
 * @param {function} [ctx] Network context
 * @return {Network}
 */
Clearwing.prototype.network = function(network, ctx) {
	'use strict';

	if (!this.hasNetwork(network)) {
		_.defer(function() {
			if (network.get('autoconnect') && network.get('server'))
				network.connect();
		});
	}

	network = this.networks.filter(function(n) { return n._name == network.toLowerCase(); }).pop() ||
	          this.networks[this.networks.push(new Network(this, network)) - 1];

	if (_.isFunction(ctx))
		ctx.call(network, network);

	return network;
};


/**
 * See if a network exists
 * @param {string} network Network name
 * @return {bool} True if network exists, false if it does not
 */
Clearwing.prototype.hasNetwork = function(network) {
	'use strict';

	return !!this.networks.filter(function(n) { return n._name == network.toLowerCase(); }).length;
};


/**
 * Use a plugin
 * @param {function} plugin
 * @return {Clearwing}
 */
Clearwing.prototype.use = function(plugin) {
	'use strict';

	if (_.isFunction(plugin))
		plugin.call(this, this);

	return this;
};

module.exports = Clearwing;

var _                  = require('underscore'),
    ClearwingNamespace = require('./clearwingnamespace');

/**
 * @constructor
 * @augments ClearwingNamespace
 */
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

	var that = this;
	this.network.on('raw:join', function(event) {
		that.set('joined', true);
		that.emit('join', _.clone(event));
	});

	this.network.on('raw:part', function(event) {
		that.set('joined', false);
		that.emit('part', _.clone(event));
	});
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


Channel.prototype = new ClearwingNamespace();
Channel.prototype.constructor = Channel;


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
 * Join channel if we aren't already joined
 * @return {this}
 */
Channel.prototype.join = function() {
	if (!this.get('joined'))
		this.network.send('join', this.get('name'));

	return this;
};


/**
 * Part channel if we're joined
 * @return {this}
 */
Channel.prototype.part = function(message) {
	if (this.get('joined'))
		this.network.send('part', this.get('name'));

	return this;
};

module.exports = Channel;

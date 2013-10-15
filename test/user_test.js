var Clearwing = require('../lib/clearwing.js');
var should = require('should');

describe('User', function() {
	'use strict';

	var client;
	var network;
	var user;

	beforeEach(function() {
		client = new Clearwing();
		network = client.network('Foo');
		user = network.user('foo');
	});

	describe('instantiation via Network#user', function() {
		it('should be case insensitive', function() {
			var user1 = network.user('Foo');
			var user2 = network.user('foo');

			user1.should.equal(user2);
		});

		it('should instantiate multiple users', function() {
			var user1 = network.user('foo');
			var user2 = network.user('bar');

			user1.should.not.equal(user2);
		});
	});

	describe('#get', function() {
		it('should return undefined for undefined properties', function() {
			should.strictEqual(undefined, user.get('foo'));
			should.notStrictEqual(null, user.get('foo'));
		});

		it('should get Clearwing#_data[path]', function() {
			client._data['network.foo user.foo foo'] = 'bar';
			user.get('foo').should.equal('bar');
		});

		it('should be case insensitive', function() {
			client._data['network.foo user.foo foo'] = 'bar';
			user.get('FOO').should.equal('bar');
		});

		it('should let you retrieve values via Network#get', function() {
			user.set('foo', 'bar');
			network.get('user.foo foo').should.equal('bar');
		});

		it('should let you retrieve values via Client#get', function() {
			user.set('foo', 'bar');
			client.get('network.foo user.Foo foo').should.equal('bar');
		});
	});

	describe('#set', function() {
		it('sets Clearwing#_data[path]', function() {
			user.set('foo', 'bar');
			client._data['network.foo user.foo foo'].should.equal('bar');
		});
	});

	describe('#on', function() {
		it('sets Clearwing#_events[event]', function() {
			var fn = function() {};
			user.on('foo', fn);
			client._events['network.foo user.foo foo'].should.eql([ fn ]);
		});
	});

	describe('#emit', function() {
		it('should trigger an event', function(done) {
			client._events['network.foo user.foo foo'] = [ function() { done(); } ];
			user.emit('foo', {});
		});
	});
});

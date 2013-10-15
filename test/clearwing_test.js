var _ = require('underscore');
var Clearwing = require('../lib/clearwing.js');
var should = require('should');


describe('Clearwing', function() {
	'use strict';

	var client;

	beforeEach(function() {
		client = new Clearwing();
	});

	describe('prop names', function() {
		var string = 'network.foo channel.#bar bah baz';
		var array = [ { network: 'foo' }, { channel: '#bar' }, 'bah', 'baz' ];

		describe('.stringifyPropName', function() {
			it('should parse an array that matches string', function() {
				Clearwing.stringifyPropName(array).should.equal(string);
			});
		});

		describe('.parsePropName', function() {
			it('should parse a string that matches array', function() {
				Clearwing.parsePropName(string).should.eql(array);
			});
		});
	});

	describe('#get', function() {
		it('should return undefined for undefined properties', function() {
			should.strictEqual(undefined, client.get('foo'));
			should.notStrictEqual(null, client.get('foo'));
		});

		it('should get Clearwing#_data[path]', function() {
			client._data['foo'] = 'bar';
			client.get('foo').should.equal('bar');
		});
	});

	describe('#set', function() {
		it('sets Clearwing#_data[path]', function() {
			should.strictEqual(undefined, client._data['foo']);
			client.set('foo', 'bar');
			client._data['foo'].should.equal('bar');
		});
	});

	describe('#on', function() {
		it('sets Clearwing#_events[event]', function() {
			var fn = function() {};
			client.on('foo', fn);
			client._events['foo'].should.eql([ fn ]);
		});
	});

	describe('#emit', function() {
		it('should work', function(done) {
			client._events['test'] = [ function() { done(); } ];
			client.emit('test', {});
		});

		it('should thrown an error if fewer than two arguments are supplied', function() {
			_.bind(client.emit, client, 'foo').should.throw('#emit() expects at least two arguments');
		});

		it('should return false if an event is not bound', function() {
			client.emit('bar', {}).should.equal(false);
		});

		it('should return true if an event is bound', function() {
			client.on('baz', function() {});
			client.emit('baz', {}).should.equal(true);
		});
	});
});

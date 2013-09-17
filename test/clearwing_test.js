var _         = require('underscore'),
    Clearwing = require('../lib/clearwing.js'),
    should    = require('should');

var client,
    string = 'network.foo channel.#bar bah baz',
    array  = [ { network: 'foo' }, { channel: '#bar' }, 'bah', 'baz' ];

describe('Clearwing', function() {
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

	before(function() {
		client = new Clearwing();
	});

	describe('#get and #set', function() {
		it('should return undefined for undefined properties', function() {
			should.strictEqual(undefined, client.get('foo'));
			should.notStrictEqual(null, client.get('foo'));
		});

		it('should let you set and retrieve values', function() {
			client.set('foo', 'bar');
			client.get('foo').should.equal('bar');
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
	});
});

var Clearwing = require('../lib/clearwing.js'),
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

	describe('#get and #set', function() {
		before(function() {
			client = new Clearwing();
		});

		it('should return undefined for undefined properties', function() {
			should.strictEqual(undefined, client.get('foo'));
			should.notStrictEqual(null, client.get('foo'));
		});

		it('should let you set and retrieve values', function() {
			client.set('foo', 'bar');
			client.get('foo').should.equal('bar');
		});
	});
});

var Clearwing = require('../lib/clearwing.js'),
    should    = require('should');

var client, network;
describe('Channel', function() {
	before(function() {
		client = new Clearwing();
	});

	describe('instantiation via Network#channel', function() {
		it('should be case insensitive', function() {
			var network1 = client.network('Foo'),
			    network2 = client.network('foo');

			network1.should.equal(network2);
		});

		it('should instantiate multiple networks', function() {
			var network1 = client.network('Foo'),
			    network2 = client.network('Bar');

			network1.should.not.eql(network2);
		});
	});

	describe('#get and #set', function() {
		before(function() {
			network = client.network('Foo');
		});

		it('should return undefined for undefined properties', function() {
			should.strictEqual(undefined, network.get('foo'));
			should.notStrictEqual(null, network.get('foo'));
		});

		it('should let you set and retrieve values', function() {
			network.set('foo', 'bar');
			network.get('foo').should.equal('bar');
		});

		it('should let you retrieve values via Client#get', function() {
			network.set('doh', 'dah');
			client.get('network.Foo doh').should.equal('dah');
		});
	});
});

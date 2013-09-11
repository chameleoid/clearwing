var Clearwing = require('../lib/clearwing.js'),
    should    = require('should');

var client, network, channel;
describe('Channel', function() {
	before(function() {
		client = new Clearwing();
		network = client.network('Foo');
	});

	describe('instantiation via Network#channel', function() {
		it('should be case insensitive', function() {
			var channel1 = network.channel('#Foo'),
			    channel2 = network.channel('#foo');

			channel1.should.equal(channel2);
		});

		it('should instantiate multiple channels', function() {
			var channel1 = network.channel('#foo'),
			    channel2 = network.channel('#bar');

			channel1.should.not.eql(channel2);
		});
	});

	describe('#get and #set', function() {
		before(function() {
			channel = network.channel('#foo');
		});

		it('should return undefined for undefined properties', function() {
			should.strictEqual(undefined, channel.get('foo'));
			should.notStrictEqual(null, channel.get('foo'));
		});

		it('should let you set and retrieve values', function() {
			channel.set('foo', 'bar');
			channel.get('foo').should.equal('bar');
		});

		it('should let you retrieve values via Network#get', function() {
			channel.set('bah', 'baz');
			network.get('channel.#foo bah').should.equal('baz');
		});

		it('should let you retrieve values via Client#get', function() {
			channel.set('doh', 'dah');
			client.get('network.foo channel.#foo doh').should.equal('dah');
		});
	});
});

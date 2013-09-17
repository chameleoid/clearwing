var Clearwing = require('../lib/clearwing.js'),
    should    = require('should');

var client, network, channel;
describe('Channel', function() {
	beforeEach(function() {
		client = new Clearwing();
		network = client.network('Foo');
		channel = network.channel('#foo');
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

	describe('#get', function() {
		it('should return undefined for undefined properties', function() {
			should.strictEqual(undefined, channel.get('foo'));
			should.notStrictEqual(null, channel.get('foo'));
		});

		it('should get Clearwing#_data[path]', function() {
			client._data['network.foo channel.#foo foo'] = 'bar';
			channel.get('foo').should.equal('bar');
		});

		it('should be case insensitive', function() {
			client._data['network.foo channel.#foo foo'] = 'bar';
			channel.get('FOO').should.equal('bar');
		});

		it('should let you retrieve values via Network#get', function() {
			channel.set('foo', 'bar');
			network.get('channel.#foo foo').should.equal('bar');
		});

		it('should let you retrieve values via Client#get', function() {
			channel.set('foo', 'bar');
			client.get('network.foo channel.#Foo foo').should.equal('bar');
		});
	});

	describe('#set', function() {
		it('sets Clearwing#_data[path]', function() {
			channel.set('foo', 'bar');
			client._data['network.foo channel.#foo foo'].should.equal('bar');
		});
	});

	describe('#on', function() {
		it('sets Clearwing#_events[event]', function() {
			var fn = function() {};
			channel.on('foo', fn);
			client._events['network.foo channel.#foo foo'].should.eql([ fn ]);
		});
	});

	describe('#emit', function() {
		it('should trigger an event', function(done) {
			client._events['network.foo channel.#foo foo'] = [ function() { done(); } ];
			channel.emit('foo', {});
		});
	});
});

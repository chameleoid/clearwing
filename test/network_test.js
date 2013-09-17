var Clearwing = require('../lib/clearwing.js'),
    should    = require('should');

var client, network;
describe('Channel', function() {
	beforeEach(function() {
		client = new Clearwing();
		network = client.network('Foo');
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

	describe('#get', function() {
		it('should return undefined for undefined properties', function() {
			should.strictEqual(undefined, network.get('foo'));
			should.notStrictEqual(null, network.get('foo'));
		});

		it('should get Clearwing#_data[path]', function() {
			client._data['network.foo foo'] = 'bar';
			network.get('foo').should.equal('bar');
		});

		it('should be case insensitive', function() {
			client._data['network.foo foo'] = 'bar';
			network.get('FOO').should.equal('bar');
		});

		it('should let you retrieve values via Client#get', function() {
			network.set('foo', 'bar');
			client.get('network.Foo foo').should.equal('bar');
		});
	});

	describe('#set', function() {
		it('sets Clearwing#_data[path]', function() {
			network.set('foo', 'bar');
			client._data['network.foo foo'].should.equal('bar');
		});
	});

	describe('#on', function() {
		it('sets Clearwing#_events[event]', function() {
			var fn = function() {};
			network.on('foo', fn);
			client._events['network.foo foo'].should.eql([ fn ]);
		});
	});

	describe('#emit', function() {
		it('should trigger an event', function(done) {
			client._events['network.foo foo'] = [ function() { done(); } ];
			network.emit('foo', {});
		});
	});
});

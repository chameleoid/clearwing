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

var client, network;
exports['network'] = {
	setUp: function(done) {
		client = new Clearwing();
		done();
	},

	'network initialization': function(test) {
		test.expect(2);
		test.equal(client.networks.length, 0, 'should have no networks');
		network = client.network('Foo');
		network = client.network('foo');
		test.equal(client.networks.length, 1, 'should have one network');
		test.done();
	},

	'set and get data': function(test) {
		test.expect(4);

		test.equal(client.get('foo'), undefined);
		client.set('foo', 'bar');
		test.equal(client.get('foo'), 'bar');

		network = client.network('foo');
		test.equal(client.get('network.foo bah'), undefined);
		network.set('bah', 'bar');
		test.equal(client.get('network.foo bah'), 'bar');

		test.done();
	},

	'message parsing': {
		'server message': function(test) {
			test.expect(5);

			var raw      = ':irc.example.com 123 * :This message has a : in it',
			    messages = network.parseMessage(raw),
			    message  = messages.slice(0, 1).pop();

			test.equal(messages.length, 1, 'should have one message');
			test.equal(message.raw, raw);
			test.equal(message.prefix, 'irc.example.com');
			test.equal(message.command, '123');
			test.deepEqual(message.param, [ '*', 'This message has a : in it' ]);

			test.done();
		}
	}
};


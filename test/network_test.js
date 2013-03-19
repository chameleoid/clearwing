var Clearwing = require('../lib/clearwing.js');

/*
	======== A Handy Little Nodeunit Reference ========
	https://github.com/caolan/nodeunit

	Test methods:
		test.expect(numAssertions)
		test.done()
	Test assertions:
		test.ok(value, [message])
		test.equal(actual, expected, [message])
		test.notEqual(actual, expected, [message])
		test.deepEqual(actual, expected, [message])
		test.notDeepEqual(actual, expected, [message])
		test.strictEqual(actual, expected, [message])
		test.notStrictEqual(actual, expected, [message])
		test.throws(block, [error], [message])
		test.doesNotThrow(block, [error], [message])
		test.ifError(value)
*/

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

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

var client, network, channel;
exports['channel'] = {
	setUp: function(done) {
		client = new Clearwing();
		network = client.network('Foo');
		done();
	},

	'channel initialization': function(test) {
		test.expect(2);
		test.equal(network.channels.length, 0, 'should have no channels');
		channel = network.channel('#Foo');
		channel = network.channel('#foo');
		test.equal(network.channels.length, 1, 'should have one channel');
		test.done();
	},

	'set and get data': function(test) {
		test.expect(4);

		test.equal(channel.get('foo'), undefined);
		channel.set('foo', 'bar');
		test.equal(channel.get('foo'), 'bar');

		channel = network.channel('#foo');
		test.equal(network.get('channel.#foo bah'), undefined);
		channel.set('bah', 'bar');
		test.equal(network.get('channel.#foo bah'), 'bar');

		test.done();
	}
};

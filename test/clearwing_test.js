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
exports['clearwing'] = {
	setUp: function(done) {
		client = new Clearwing();
		done();
	},

	'property stringifying/parsing': function(test) {
		test.expect(2);

		var string = 'network.foo channel.#bar bah baz',
		    array  = [ { network: 'foo' }, { channel: '#bar' }, 'bah', 'baz' ];

		test.equal(Clearwing.stringifyPropName(array), string);
		test.deepEqual(Clearwing.parsePropName(string), array);
		test.done();
	},

	'getters and setters': function(test) {
		test.expect(2);
		test.equal(client.get('foo'), undefined);
		client.set('foo', 'bar');
		test.equal(client.get('foo'), 'bar');
		test.done();
	}
};

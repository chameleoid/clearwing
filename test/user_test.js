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

var client, network, user;
exports['user'] = {
	setUp: function(done) {
		client = new Clearwing();
		network = client.network('Foo');
		done();
	},

	'user initialization': function(test) {
		test.expect(2);
		test.equal(network.users.length, 0, 'should have no users');
		user = network.user('Foo');
		user = network.user('foo');
		test.equal(network.users.length, 1, 'should have one user');
		test.done();
	},

	'set and get data': function(test) {
		test.expect(4);

		test.equal(user.get('foo'), undefined);
		user.set('foo', 'bar');
		test.equal(user.get('foo'), 'bar');

		user = network.user('foo');
		test.equal(network.get('user.foo bah'), undefined);
		user.set('bah', 'bar');
		test.equal(network.get('user.foo bah'), 'bar');

		test.done();
	}
};

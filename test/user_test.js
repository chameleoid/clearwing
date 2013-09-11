var Clearwing = require('../lib/clearwing.js'),
    should    = require('should');

var client, network, user;
describe('Channel', function() {
	before(function() {
		client = new Clearwing();
		network = client.network('Foo');
	});

	describe('instantiation via Network#user', function() {
		it('should be case insensitive', function() {
			var user1 = network.user('Foo'),
			    user2 = network.user('foo');

			user1.should.equal(user2);
		});

		it('should instantiate multiple users', function() {
			var user1 = network.user('foo'),
			    user2 = network.user('bar');

			user1.should.not.eql(user2);
		});
	});

	describe('#get and #set', function() {
		before(function() {
			user = network.user('foo');
		});

		it('should return undefined for undefined properties', function() {
			should.strictEqual(undefined, user.get('foo'));
			should.notStrictEqual(null, user.get('foo'));
		});

		it('should let you set and retrieve values', function() {
			user.set('foo', 'bar');
			user.get('foo').should.equal('bar');
		});

		it('should let you retrieve values via Network#get', function() {
			user.set('bah', 'baz');
			network.get('user.foo bah').should.equal('baz');
		});

		it('should let you retrieve values via Client#get', function() {
			user.set('doh', 'dah');
			client.get('network.foo user.foo doh').should.equal('dah');
		});
	});
});

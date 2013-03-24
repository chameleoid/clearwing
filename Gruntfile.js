module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile %>',
				tasks: 'jshint:gruntfile'
			},

			dist: {
				files: '<%= jshint.dist %>',
				tasks: 'jshint:dist'
			},

			test: {
				files: '<%= jshint.test %>',
				tasks: 'jshint:test'
			}
		},

		nodeunit: {
			dist: ['test/**/*_test.js']
		},

		jsdoc: {
			dist: {
				src: ['lib/**/*.js', 'test/**/*_test.js'],
				dest: 'docs'
			}
		 },

		jshint: {
			gruntfile: 'Gruntfile.js',
			dist: 'lib/**/*.js',
			test: 'test/**/*.js',

			options: {
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				quotmark: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: false,
				regexdash: true,
				smarttabs: true,
				strict: false,
				node: true,
				browser: true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-jsdoc');

	// Default task.
	grunt.registerTask('default', ['test', 'doc']);
	grunt.registerTask('test', ['jshint', 'nodeunit']);
	grunt.registerTask('doc', ['jsdoc']);
};

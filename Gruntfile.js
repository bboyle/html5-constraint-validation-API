'use strict';

module.exports = function( grunt ) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON( 'package.json' ),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		// Task configuration.
		clean: {
			files: [ 'dist' ]
		},
		connect: {
			server: {
				options: {
					port: 8000,
					base: '.'
				}
			}
		},
		// production pipeline tasks
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			dist: {
				src: [ 'src/<%= pkg.name %>.js' ],
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				src: 'dist/<%= pkg.name %>.js',
				dest: 'dist/<%= pkg.name %>.min.js'
			},
		},
		// code quality tasks
		qunit: {
			unit: [ 'test/**/*.html' ],
			// test other jquery versions
			jquery: {
				options: {
					timeout: 12000,
					urls: [
						'http://localhost:8000/test/change.html?jquery=1.4.4',
						'http://localhost:8000/test/checkValidity.html?jquery=1.4.4',
						'http://localhost:8000/test/custom.html?jquery=1.4.4',
						'http://localhost:8000/test/disabled.html?jquery=1.4.4',
						'http://localhost:8000/test/email.html?jquery=1.4.4',
						'http://localhost:8000/test/invalid.html?jquery=1.4.4',
						'http://localhost:8000/test/novalidate.html?jquery=1.4.4',
						'http://localhost:8000/test/pattern.html?jquery=1.4.4',
						'http://localhost:8000/test/required.html?jquery=1.4.4',
						'http://localhost:8000/test/submit.html?jquery=1.4.4',
						// latest
						'http://localhost:8000/test/change.html?jquery=2.1.0',
						'http://localhost:8000/test/checkValidity.html?jquery=2.1.0',
						'http://localhost:8000/test/custom.html?jquery=2.1.0',
						'http://localhost:8000/test/disabled.html?jquery=2.1.0',
						'http://localhost:8000/test/email.html?jquery=2.1.0',
						'http://localhost:8000/test/invalid.html?jquery=2.1.0',
						'http://localhost:8000/test/novalidate.html?jquery=2.1.0',
						'http://localhost:8000/test/pattern.html?jquery=2.1.0',
						'http://localhost:8000/test/required.html?jquery=2.1.0',
						'http://localhost:8000/test/submit.html?jquery=2.1.0',
					]
				}
			}
		},
		jshint: {
			gruntfile: {
				options: {
					jshintrc: '.jshintrc'
				},
				src: [
					'Gruntfile.js',
					'src/.jshintrc',
					'test/.jshintrc',
					'.jshintrc'
				]
			},
			src: {
				options: {
					jshintrc: 'src/.jshintrc'
				},
				src: [ 'src/**/*.js' ]
			},
			test: {
				options: {
					jshintrc: 'test/.jshintrc'
				},
				src: [ 'test/*.js' ]
			},
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: [ 'jshint:gruntfile' ]
			},
			src: {
				files: '<%= jshint.src.src %>',
				tasks: [ 'jshint:src', 'qunit:unit' ]
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: [ 'jshint:test', 'qunit:unit' ]
			},
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-connect' );
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );

	// Default task.
	grunt.registerTask( 'test', [ 'jshint', 'connect', 'qunit' ]);
	grunt.registerTask( 'produce', [ 'clean', 'concat', 'uglify' ]);
	grunt.registerTask( 'default', [ 'test', 'produce' ]);

};

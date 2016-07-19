'use strict';

module.exports = function( grunt ) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON( 'package.json' ),
		title: '<%= pkg.title || pkg.name %> - v<%= pkg.version %>',
		buildNumber: process.env.TRAVIS_BUILD_ID || grunt.template.today("isoUtcDateTime"),
		banner: '/*! <%= title %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

		browsers: [
			{ browserName: 'Internet Explorer', version:  '6' },
			{ browserName: 'android', version: '4.0' }, // old, like Google Earth (maybe not quite that old)
			{ browserName: 'Internet Explorer', version:  '8' },
			{ browserName: 'Internet Explorer', version:  '9' },
			// modern browsers (polyfill should play nice)
			{ browserName: 'Internet Explorer' },
			{ browserName: 'Chrome' },
			{ browserName: 'iPhone' },
			{ browserName: 'android' },
			{ browserName: 'Firefox' }
		],

		// Task configuration.
		clean: {
			files: [ 'sc_*.log' ]
		},
		connect: {
			server: {
				options: {
					port: 8080,
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
			unit: [
				'test/*.html',
				'!test/google-earth.html'
			],
			// test other jquery versions
			jquery144: {
				options: {
					timeout: 12000,
					urls: [
						'http://127.0.0.1:8080/test/change.html?jquery=1.4.4',
						'http://127.0.0.1:8080/test/checkValidity.html?jquery=1.4.4',
						'http://127.0.0.1:8080/test/custom.html?jquery=1.4.4',
						'http://127.0.0.1:8080/test/disabled.html?jquery=1.4.4',
						'http://127.0.0.1:8080/test/email.html?jquery=1.4.4',
						'http://127.0.0.1:8080/test/invalid.html?jquery=1.4.4',
						'http://127.0.0.1:8080/test/novalidate.html?jquery=1.4.4',
						'http://127.0.0.1:8080/test/pattern.html?jquery=1.4.4',
						'http://127.0.0.1:8080/test/required.html?jquery=1.4.4',
						'http://127.0.0.1:8080/test/submit.html?jquery=1.4.4'
					]
				}
			},
			jquery172: {
				options: {
					timeout: 12000,
					urls: [
						'http://127.0.0.1:8080/test/change.html?jquery=1.7.2',
						'http://127.0.0.1:8080/test/checkValidity.html?jquery=1.7.2',
						'http://127.0.0.1:8080/test/custom.html?jquery=1.7.2',
						'http://127.0.0.1:8080/test/disabled.html?jquery=1.7.2',
						'http://127.0.0.1:8080/test/email.html?jquery=1.7.2',
						'http://127.0.0.1:8080/test/invalid.html?jquery=1.7.2',
						'http://127.0.0.1:8080/test/novalidate.html?jquery=1.7.2',
						'http://127.0.0.1:8080/test/pattern.html?jquery=1.7.2',
						'http://127.0.0.1:8080/test/required.html?jquery=1.7.2',
						'http://127.0.0.1:8080/test/submit.html?jquery=1.7.2'
					]
				}
			},
			jquery213: {
				options: {
					timeout: 12000,
					urls: [
						'http://127.0.0.1:8080/test/change.html?jquery=2.1.3',
						'http://127.0.0.1:8080/test/checkValidity.html?jquery=2.1.3',
						'http://127.0.0.1:8080/test/custom.html?jquery=2.1.3',
						'http://127.0.0.1:8080/test/disabled.html?jquery=2.1.3',
						'http://127.0.0.1:8080/test/email.html?jquery=2.1.3',
						'http://127.0.0.1:8080/test/invalid.html?jquery=2.1.3',
						'http://127.0.0.1:8080/test/novalidate.html?jquery=2.1.3',
						'http://127.0.0.1:8080/test/pattern.html?jquery=2.1.3',
						'http://127.0.0.1:8080/test/required.html?jquery=2.1.3',
						'http://127.0.0.1:8080/test/submit.html?jquery=2.1.3'
					]
				}
			},
			jquery310: {
				options: {
					timeout: 12000,
					urls: [
						'http://127.0.0.1:8080/test/change.html?jquery=3.1.0',
						'http://127.0.0.1:8080/test/checkValidity.html?jquery=3.1.0',
						'http://127.0.0.1:8080/test/custom.html?jquery=3.1.0',
						'http://127.0.0.1:8080/test/disabled.html?jquery=3.1.0',
						'http://127.0.0.1:8080/test/email.html?jquery=3.1.0',
						'http://127.0.0.1:8080/test/invalid.html?jquery=3.1.0',
						'http://127.0.0.1:8080/test/novalidate.html?jquery=3.1.0',
						'http://127.0.0.1:8080/test/pattern.html?jquery=3.1.0',
						'http://127.0.0.1:8080/test/required.html?jquery=3.1.0',
						'http://127.0.0.1:8080/test/submit.html?jquery=3.1.0'
					]
				}
			}
		},
		'saucelabs-qunit': {
			change: {
				options: {
					testname: 'change - <%= title %>',
					build: '<%= buildNumber %>',
					urls: [ 'http://127.0.0.1:8080/test/change.html?jquery=1.7.2' ],
					browsers: '<%= browsers %>'
				}
			},
			checkValidity: {
				options: {
					testname: 'checkValidity() - <%= title %>',
					build: '<%= buildNumber %>',
					urls: [ 'http://127.0.0.1:8080/test/checkValidity.html?jquery=1.7.2' ],
					browsers: '<%= browsers %>'
				}
			},
			customValidity: {
				options: {
					testname: 'customValidity - <%= title %>',
					build: '<%= buildNumber %>',
					urls: [ 'http://127.0.0.1:8080/test/custom.html?jquery=1.7.2' ],
					browsers: '<%= browsers %>'
				}
			},
			disabled: {
				options: {
					testname: 'disabled - <%= title %>',
					build: '<%= buildNumber %>',
					urls: [ 'http://127.0.0.1:8080/test/disabled.html?jquery=1.7.2' ],
					browsers: '<%= browsers %>'
				}
			},
			email: {
				options: {
					testname: 'email - <%= title %>',
					build: '<%= buildNumber %>',
					urls: [ 'http://127.0.0.1:8080/test/email.html?jquery=1.7.2' ],
					browsers: '<%= browsers %>'
				}
			},
			invalid: {
				options: {
					testname: 'invalid - <%= title %>',
					build: '<%= buildNumber %>',
					urls: [ 'http://127.0.0.1:8080/test/invalid.html?jquery=1.7.2' ],
					browsers: '<%= browsers %>'
				}
			},
			novalidate: {
				options: {
					testname: 'novalidate - <%= title %>',
					build: '<%= buildNumber %>',
					urls: [ 'http://127.0.0.1:8080/test/novalidate.html?jquery=1.7.2' ],
					browsers: '<%= browsers %>'
				}
			},
			pattern: {
				options: {
					testname: 'pattern - <%= title %>',
					build: '<%= buildNumber %>',
					urls: [ 'http://127.0.0.1:8080/test/pattern.html?jquery=1.7.2' ],
					browsers: '<%= browsers %>'
				}
			},
			required: {
				options: {
					testname: 'required - <%= title %>',
					build: '<%= buildNumber %>',
					urls: [ 'http://127.0.0.1:8080/test/required.html?jquery=1.7.2' ],
					browsers: '<%= browsers %>'
				}
			},
			submit: {
				options: {
					testname: 'submit - <%= title %>',
					build: '<%= buildNumber %>',
					urls: [ 'http://127.0.0.1:8080/test/submit.html?jquery=1.7.2' ],
					browsers: '<%= browsers %>'
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
	grunt.loadNpmTasks( 'grunt-saucelabs' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );

	// Default task.
	grunt.registerTask( 'test', [ 'jshint', 'connect', 'qunit' ]);
	grunt.registerTask( 'test-remote', [ 'jshint', 'qunit:unit', 'connect', 'clean', 'saucelabs-qunit' ]);
	grunt.registerTask( 'produce', [ 'clean', 'concat', 'uglify' ]);
	grunt.registerTask( 'default', [ 'test', 'produce' ]);

};

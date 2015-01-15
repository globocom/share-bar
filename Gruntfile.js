/*global require, module:false */
module.exports = function (grunt) {
    'use strict';

    var distJs = 'dist/js/',
        distCss = 'dist/css/';

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            js: {
                src: ['src/js/*.js'],
                dest: distJs + '<%= pkg.name %>.js'
            },
            css: {
                src: ['src/css/*.css'],
                dest: distCss + '<%= pkg.name %>.css'
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.js.dest %>',
                dest: distJs + '<%= pkg.name %>.min.js'
            }
        },

        cssmin: {
            minify: {
                src: 'dist/css/share.bar.css',
                dest: 'dist/css/share.bar.min.css',
                banner: '<%= banner %>'
            }
        },

        jslint: {
            client: {
                src: ['<%= concat.js.src %>', 'tests/*.spec.js', 'Gruntfile.js'],
                directives: {
                    browser: true,
                    unparam: true,
                    regexp: true,
                    nomen: true,
                    plusplus: true
                }
            }
        },

        compass: {
            dist: {
                options: {
                    sassDir: 'src/sass',
                    cssDir: 'src/css',
                    outputStyle: 'compressed',
                    noLineComments: true,
                    relativeAssets: true

                }
            }
        },

        svgstore: {
            options: {
                prefix : 'icon-'
            },
            default: {
                files: {
                    'dist/img/icons.svg': ['src/img/*.svg']
                }
            }
        },

        svgmin: {
            options: {
                plugins: [
                    { removeViewBox: false },
                    { cleanupIDs: false }
                ]
            },
            dist: {
                files: {
                    'dist/img/icons.svg': 'dist/img/icons.svg'
                }
            }
        },

        'string-replace': {
            dist: {
                files: {
                    'dist/js/share.bar.js': 'dist/js/share.bar.js'
                },
                options: {
                    replacements: [{
                        pattern: '[[X_SVG_X]]',
                        replacement: grunt.file.read('dist/img/icons.svg')
                    }]
                }
            }
        },

        jasmine: {
            share: {
                src: 'src/js/share.js',
                options: {
                    specs: 'tests/*.spec.js',
                    vendor: [],
                    junit: {
                        path: 'tests/reports/',
                        consolidate: true
                    },
                    keepRunner: true,
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'tests/reports/conbertura.json',
                        report: [{
                            type: 'lcov',
                            options: {
                                dir: 'tests/reports/'
                            }
                        }]
                    },
                    // phantom options
                    '--web-security' : false,
                    '--local-to-remote-url-access' : true,
                    '--ignore-ssl-errors' : true
                }
            }
        },

        coveralls: {

            options: {
                force: true
            },
            main_target: {
                src: "tests/reports/lcov.info"
            }
        },

        watch: {
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['jslint']
            },
            test: {
                files: 'tests/*.spec.js',
                tasks: ['jstest']
            },
            buildJS: {
                files: ['<%= concat.js.src %>'],
                tasks: ['jstest', 'js']
            },
            buildCSS: {
                files: ['src/sass/*.scss'],
                tasks: ['css']
            },
            buildIcons: {
                files: ['src/img/*.svg'],
                tasks: ['icon']
            }
        },

        connect: {
            server: {
                options: {
                    port: 9002,
                    base: '.',
                    livereload: true
                }
            }
        },

        webfont: {
            icons: {
                src: 'src/img/*.svg',
                dest: 'src/fonts',
                destCss: 'src/sass',
                options: {
                    font: 'share-icon',
                    hashes: false,
                    htmlDemo: false,
                    stylesheet: 'scss',
                    embed: ['woff', 'ttf'],
                    templateOptions: {
                        baseClass: 'share-font',
                        classPrefix: 'ico-share-',
                        mixinPrefix: 'ico-share-'
                    },
                    types: 'woff,ttf'
                }
            }
        },

        buddyjs: {
            src: ['<%= concat.js.src %>'],
            options: {}
        },

        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release version: %VERSION%',
                commitFiles: ['-a'],
                createTag: true,
                tagName: '%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin master',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-webfont');
    grunt.loadNpmTasks('grunt-svgstore');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-buddyjs');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-coveralls');

    // Custom tasks
    grunt.registerTask('icon', ['svgstore', 'webfont', 'svgmin', 'string-replace']);
    grunt.registerTask('jstest', ['jslint', 'buddyjs', 'jasmine']);
    grunt.registerTask('js', ['concat:js', 'string-replace', 'uglify']);
    grunt.registerTask('css', ['compass', 'concat:css', 'cssmin']);
    grunt.registerTask('server', ['connect:server', 'watch']);
    grunt.registerTask('ci', ['jasmine', 'coveralls']);

    // Default task.
    grunt.registerTask('default', ['icon', 'jstest', 'js', 'css']);
};

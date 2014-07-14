/*global require, module:false */
module.exports = function(grunt) {
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

        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {}
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            test: {
                src: ['<%= concat.js.src %>', 'tests/*.spec.js']
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
                        coverage: 'tests/reports/coverage.json',
                        report: 'tests/reports'
                    },
                    // phantom options
                    '--web-security' : false,
                    '--local-to-remote-url-access' : true,
                    '--ignore-ssl-errors' : true
                }
            }
        },

        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'jasmine']
            },
            buildJS: {
                files: ['<%= concat.js.src %>'],
                tasks: ['concat:js', 'uglify']
            },
            buildCSS: {
                files: ['src/sass/*.scss'],
                tasks: ['compass', 'concat']
            },
        },
        connect: {
            server: {
               options: {
                   port: 9002,
                   base: '.',
                   keepalive: true
               }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('default', ['jshint', 'jasmine', 'concat', 'uglify']);

};

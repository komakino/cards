module.exports = function(grunt) {

    var static = 'build/static/';
    var temp = 'build/temp/';
    var backend = 'app/backend/';
    var frontend = 'app/frontend/';

    var config = {pkg: grunt.file.readJSON('package.json')};

    // Express
    config.express = {
        options: {
            // Override defaults here
        },
        dev: {
            options: {
                script: 'bootstrap.js'
            }
        },
    };

    // Watch
    config.watch = {
        bower: {
            files: 'bower_components/*',
            tasks: 'bower_concat'
        },
        express: {
            files: ['bootstrap.js',backend + '**/*.js'],
            tasks: ['express:dev'],
            options: {
                spawn: false
            }
        },
        ngtemplates: {
            files: frontend + 'html/**/*.html',
            tasks: ['ngtemplates','concat','uglify']
        },
        js: {
            files: '<%= concat.js.src %>',
            tasks: ['concat', 'uglify']
        },
        less: {
            files: '<%= less.build.src %>',
            tasks: ['less']
        }
    };

    // Angular templates
    config.ngtemplates = {
        app: {
            cwd: frontend + 'html',
            src: '**/*.html',
            dest: temp + 'ngtemplates.js'
        }
    };

    // Concat
    config.concat = {
        options: {
            sourceMap: true,
        },
        js: {
            src: [frontend + 'js/app.js',frontend + 'js/**/*.js','<%= ngtemplates.app.dest %>'],
            dest: static + 'js/app.js'
        }
    };

    // Uglify
    config.uglify = {
        options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
            sourceMap: true,
            sourceMapIncludeSources: true,
            sourceMapIn: '<%= concat.js.dest %>.map'
        },
        build: {
            src: '<%= concat.js.dest %>',
            dest: static + 'js/app.min.js'
        }
    };

    // Less
    config.less = {
        build: {
            options: {
                // paths: ["assets/css"]
            },
            src: frontend + 'less/**/*.less',
            dest: static + 'css/app.css'
        },
    };

    // Bower concat
    config.bower_concat = {
        all: {
            dest: static + 'js/vendor.js',
            cssDest: static + 'css/vendor.css',
            exclude: ['jquery'],
            dependencies: {},
            bowerOptions: {
                relative: false
            }
        }
    };


    // Project configuration.
    grunt.initConfig(config);

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['build','express:dev','watch']);
    grunt.registerTask('build', ['bower_concat','ngtemplates','concat','uglify','less']);

};
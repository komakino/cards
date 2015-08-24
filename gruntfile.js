module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          port: 8000,
          hostname: '*'
        }
      }
    },
    watch: {
      js: {
        files: 'src/js/**/*.js',
        tasks: ['concat','uglify']
      },
      less: {
        files: 'src/less/**/*.less',
        tasks: ['less']
      }
    },
    concat: {
      options: {
        sourceMap: true,
      },
      js: {
        src: '<%= watch.js.files %>',
        dest: 'dist/cards.js',
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap : true,
        sourceMapIncludeSources : true,
        sourceMapIn : 'dist/cards.js.map'
      },
      build: {
        src: '<%= concat.js.dest %>',
        dest: 'dist/cards.min.js'
      }
    },
    less: {
      build: {
        options: {
          // paths: ["assets/css"]
        },
        files: {
          'dist/cards.css': '<%= watch.less.files %>'
        }
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('default', ['connect','watch']);

};
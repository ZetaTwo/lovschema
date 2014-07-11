module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    bowercopy: {
      options: {
        clean: true
      },

      foundation: {
        options: {
          destPrefix: 'public'
        },
        files: {
          'js/vendor': 'foundation/js/vendor',
          'js/foundation.min.js': 'foundation/js/foundation.min.js',

          'css/vendor/foundation.css': 'foundation/css/foundation.css',
          'css/vendor/foundation.css.map': 'foundation/css/foundation.css.map',
          'css/vendor/normalize.css': 'foundation/css/normalize.css',
          'css/vendor/normalize.css.map': 'foundation/css/normalize.css.map'
        }
      },

      stickytables: {
        options: {
          destPrefix: 'public/js'
        },
        files: {
          'jquery.stickytableheaders.min.js': 'StickyTableHeaders/js/jquery.stickytableheaders.min.js'
        }
      }
    },

    uglify: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'public/js/lovschema.js':
            ['public/js/src/LovschemaApp.js',
              'public/js/src/LovschemaResources.js',
              'public/js/src/LovschemaServices.js',
              'public/js/src/RegisterCtrl.js',
              'public/js/src/LoginCtrl.js',
              'public/js/src/UserCtrl.js',
              'public/js/src/CalendarCtrl.js']
        }
      }
    },

    cssmin: {
      combine: {
        files: {
          'public/css/vendor/foundation.min.css': ['public/css/vendor/foundation.css']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.registerTask('default', ['bowercopy']);
};
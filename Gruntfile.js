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
          'css/vendor/normalize.css': 'foundation/css/normalize.css'
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

    }
  });

  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.registerTask('default', ['bowercopy']);
};
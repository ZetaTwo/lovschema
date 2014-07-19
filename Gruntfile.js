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
      },

      qtip2: {
        options: {
          destPrefix: 'public'
        },
        files: {
          'js/jquery.qtip.min.js': 'qtip2/jquery.qtip.min.js',
          'js/jquery.qtip.min.map': 'qtip2/jquery.qtip.min.map',

          'css/jquery.qtip.min.css': 'qtip2/jquery.qtip.min.css'
        }
      },

      toastr: {
        options: {
          destPrefix: 'public'
        },
        files: {
          'js/toastr.min.js': 'toastr/toastr.min.js',
          'js/toastr.min.js.map': 'toastr/toastr.min.js.map',

          'css/toastr.min.css': 'toastr/toastr.min.css'
        }
      },

      mailgun_validator: {
        options: {
          destPrefix: 'public/js'
        },
        files: {
          'mailgun_validator.js': 'validator-demo/mailgun_validator.js'
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
            ['src/js/LovschemaApp.js',
              'src/js/LovschemaResources.js',
              'src/js/LovschemaFilters.js',
              'src/js/LovschemaDirectives.js',
              'src/js/RegisterCtrl.js',
              'src/js/LoginCtrl.js',
              'src/js/UserCtrl.js',
              'src/js/CalendarCtrl.js'],

          'public/js/mailgun_validator.min.js': 'public/js/mailgun_validator.js'
        }
      }
    },

    cssmin: {
      combine: {
        files: {
          'public/css/vendor/foundation.min.css': ['public/css/vendor/foundation.css'],
          'public/css/lovschema.min.css': ['src/css/lovschema.css']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.registerTask('default', ['bowercopy', 'uglify', 'cssmin']);
  grunt.registerTask('compress', ['uglify', 'cssmin']);
};
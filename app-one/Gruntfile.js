module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    paths: {
      src: {
        js: 'js/src/*.js',
        jsApp: 'modules/**/*.js'
      },
      dest: {
        js: 'js/app.min.js',
      }
    },
    concat: {
      options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
      },
      merge: {
        src: ['js/lib/*.min.js'],
        dest: 'js/main.min.js',
      },
      mergeApp: {
        src: ['js/src/*.js', 'modules/**/*.js'],
        dest: 'js/app.min.js',
      },
    },
    uglify: {
      options: {
        compress: true,
        mangle: false,
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      target: {
        src: 'js/app.min.js',
        dest: 'js/app.min.js'
      }
    },
    cssmin: {
      options: {
        mergeIntoShorthands: true,
        roundingPrecision: -1
      },
      minify: {
        files: [{
          'css/global.min.css': ['css/src/*.css', '!css/src/p*.css'],
          'css/paper.min.css': ['css/src/paper.css'],
          'css/print.min.css': ['css/src/print.css']
        }]
      }
    },
    ngdocs: {
      options: {
        dest: 'docs',
        scripts: ['angular.js', '../src.js'],
        // html5Mode: true,
        // startPage: '/docs',
        title: "JulietONE Developer Console",
        // image: "D:/JulietONE/app-one/images/logo.png",
        // imageLink: "http://my-domain.com",
        titleLink: "/docs",
        bestMatch: true
      },
      payroll: {
        src: ['modules/pay/**/controllers.js'],
        title: 'Payroll'
      }
    },
    browserSync: {
      dev: {
        bsFiles: {
          src: [
            'css/*.min.css',
            'js/*.min.js',
            'modules/***/**/*.html',
            'index.html'
          ]
        },
        options: {
          server: {
            watchTask: true,
            baseDir: "./",
          }
        }
      }
    },
    watch: {
      scripts: {
        files: ['js/src/*.js', 'modules/**/*.js'],
        tasks: ['concat', 'uglify']
      },
      cssmin: {
        files: ['css/src/*.css'],
        tasks: ['cssmin:minify'],
        options: {
          debounceDelay: 250,
          spawn: false
        }
      },
      ngdocs: {
        files: ['js/src/**/*.js', 'modules/**/**/*.js'],
        tasks: ['ngdocs'],
        options: {
          debounceDelay: 250,
          spawn: false
        }
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ngdocs');
  grunt.loadNpmTasks('grunt-browser-sync');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'cssmin', 'uglify', 'ngdocs', 'watch']);
  grunt.registerTask('server', ['browserSync', 'watch']);
};

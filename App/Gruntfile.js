// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function
module.exports = function(grunt) {
   // CONFIGURE GRUNT
   grunt.initConfig({
      // get the configuration info from package.json file
      // this way we can use things like name and version (pkg.name)
      pkg: grunt.file.readJSON('package.json'),

      // all of our configuration goes here
      concat: {
       options: {
         separator: '',
                },
         dist:  {
               src: ['js/empController.js', 'js/fact.js', 'js/servicemethod.js'],
               dest: 'js/app.js',
                },
         },
     uglify: {
      myfile1: {
        files: [
                {src:['js/app.js'],dest:'main.min.js'},
               ],
            }
        },
    ngdocs: {
      options: {
        dest: 'docs',
            scripts: ['angular.js','../src.js'],
            title: "My Controller Docs",
            titleLink: "/docs",
            bestMatch: true,
                },
       empController: {
            src: ['js/*.js'],
            title: 'empController'
                }
        },

    browserSync: {
        bsFiles: {
            src : [
                  'js/*.js',
                  'modules/*.html',
                  'index.html'
                ]
            },
            options: {
                server: {
                  watchTask: true,
                  basDir: './'
                }
            }
        },
    watch: {
        scripts: {
            files: ['js/src/*.js', 'modules/**/*.js'],
            tasks: ['concat', 'uglify']
          },
        ngdocs: {
            files: ['js/*.js'],
            tasks: ['ngdocs'],
            options: {
            debounceDelay: 250,
            spawn: false
          }
        },

   }
 });

   // log something
   grunt.log.write('Hello world! Welcome to Tutorialspoint!!\n');

   // Load the plugin that provides the "uglify" task.
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-browser-sync');
   grunt.loadNpmTasks('grunt-ngdocs');
   grunt.loadNpmTasks('grunt-contrib-concat');

   // Default task(s).
   grunt.registerTask('default', ['concat','uglify','ngdocs','watch']);
   grunt.registerTask('server', ['browserSync','watch']);
};

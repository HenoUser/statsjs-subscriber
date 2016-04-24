module.exports = function(grunt) {

    grunt.initConfig({
        concat : {
            dev : {
                src : [
                    'src/app.js',
                    'src/client.js',
                    'src/timing.js',
                    'src/features.js',
                    'src/browser.js'
                ],
                dest : 'dist/statsjs.js'
            }
        },
        uglify: {
            dev: {
                files: {
                    'dist/statsjs-with-logs.min.js': ['dist/statsjs.js']
                }
            }
        },
        removelogging: {
            dev: {
                src: "dist/statsjs-with-logs.min.js",
                dest: "dist/statsjs.min.js"
            }
        },
        jshint: {
            options : {
                jshintrc : true
            },
            dev: ['dist/statsjs.js'],
            min : ['dist/statsjs.min.js']
        },
        watch : {
            dev : {
                files : ["src/*.js"],
                tasks : ['concat:dev', 'uglify:dev', 'removelogging:dev']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks("grunt-remove-logging");
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['concat:dev', 'uglify:dev', 'removelogging:dev']);

};
// Create a list of the most common tasks,
var tasks = ["jsbeautifier", "jshint"];

// establish a file-list,
var files = ["main.js"];

// and setup the Grunfile.
module.exports = function(grunt) {
  grunt.initConfig({

    // Retrieve a reference to the package.json
    pkg: grunt.file.readJSON("package.json"),

    // Beautify the code
    jsbeautifier: {
      files: files,
      options: {
        html: {
          indentSize: 2,
        },
        css: {
          indentSize: 2
        },
        js: {
          indentSize: 2,
        }
      }
    },

    // and ensure there are no incidental mistakes.
    jshint: {
      all: {
        src: files,
      }
    },

    release: {
    },


    // Watch for changes.
    watch: {
      files: files,
      tasks: tasks
    }
  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-jsbeautifier");
  grunt.loadNpmTasks("grunt-release");

  grunt.registerTask("default", tasks.concat(["watch"]));
  grunt.registerTask("publish", tasks.concat(["release"]));

};
// Create a list of the most common tasks,
var tasks = ["jsbeautifier", "jshint", "browserify", "uglify", "docco"];

// establish a file-list,
var files = ["background/**/*", "client/**/*", "www/**/*", "Gruntfile.js", "package.json", "!www/bin/*", "!www/assets/*"];

// and setup the Grunfile.
module.exports = function(grunt) {
  grunt.initConfig({

    // Retrieve a reference to the package.json
    pkg: grunt.file.readJSON("package.json"),
    // and the manifest.json (part of chrome).
    mnsft: grunt.file.readJSON("www/manifest.json"),

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
        src: ["background/*", "client/*", "Gruntfile.js", "package.json"],
      }
    },

    // Package the background and client js files.
    browserify: {
      "www/bin/background.js": "background/background.js",
      "www/bin/client.js": "client/client.js"
    },

    // Create annotated source.
    docco: {
      all: {
        src: files,
        options: {
          output: "docs/"
        }
      }
    },

    // Uglify the sources (uncomment for production)
    uglify: {
      options: {
        maxLineLen: 160
      },
      all: {
        files: {
          // "www/bin/background.js": "www/bin/background.js",
          // "www/bin/client.js": "www/bin/client.js"
        }
      }
    },

    // Watch for changes.
    watch: {
      files: files,
      tasks: tasks
    }
  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-docco-multi");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-jsbeautifier");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  grunt.registerTask("default", tasks.concat(["watch"]));
  grunt.registerTask("tasks", tasks);

};
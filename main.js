#!/usr/bin/env node

var exec = require("child_process").exec;
var spawn = require("child_process").spawn;
var fs = require("fs");
var prompt = require("prompt");

var testCCA = function(name) {
  var test = exec("cca",
    function(error, stdout, stderr) {
      if (error !== null) {
        console.log("\tPlease run `sudo npm install -g cca` before continuing.\n\tRun `cca create [ANY_NAME_YOU_WANT]`.\n\tFinally remove the folder with `rm -rf [ANY_NAME_YOU_WANT]`.\n\tThis is to install and setup cca.");
      } else {
        createChromeCordovaApp(name);
      }
    }
  );
};

var createChromeCordovaApp = function(name) {
  var cca = exec("cca create " + name,
    function(error, stdout, stderr) {
      if (stdout)
        console.log(stdout);
      if (stderr)
        console.log(stderr);
      if (error !== null) {
        console.log(":: 'cca create 'failed");
      } else {
        NPMinit(name);
      }
    }
  );
};

var NPMinit = function(name) {
  var npm = spawn("npm", ["init"], {
    stdio: 'inherit',
    cwd: "./" + name
  });

  npm.on('close', function(code) {
    if (code !== 0) {
      console.log(":: 'npm init' failed.");
    } else {
      updateFiles(name);
    }
  });
};

var updateFiles = function(name) {
  updateREADME(name);
  updatePackageJSON(name);
  updateGruntfileJS(name);
  updateGitignore(name);
  updateManifest(name);
  updateIndexHTML(name);
  updateWWWFolder(name);
  updateBackground(name);
  updateClient(name);
  promptForBuild(name);
};

var updateREADME = function(name) {
  var contents = fs.readFileSync(__dirname + "/templates/_README.md");
  fs.writeFileSync("./" + name + "/README.md", contents);
};

var updatePackageJSON = function(name) {
  var currentPackage = JSON.parse(fs.readFileSync("./" + name + "/package.json"));
  currentPackage.devDependencies = {
    "grunt": "", // "^0.4.5",
    "grunt-browserify": "", // "^3.3.0",
    "grunt-contrib-jshint": "", // "^0.11.0",
    "grunt-contrib-uglify": "", // "^0.8.0",
    "grunt-contrib-watch": "", // "^0.6.1",
    "grunt-jsbeautifier": "", // "^0.2.8",
    "grunt-docco-multi": "", // "^0.0.2"
  };
  currentPackage.main = "www/background.js";

  fs.writeFileSync("./" + name + "/package.json", JSON.stringify(currentPackage, null, 2));
};

var updateGruntfileJS = function(name) {
  var contents = fs.readFileSync(__dirname + "/templates/_Gruntfile.js");
  fs.writeFileSync("./" + name + "/Gruntfile.js", contents);
};

var updateGitignore = function(name) {
  var contents = fs.readFileSync("./" + name + "/.gitignore");
  var additions = fs.readFileSync(__dirname + "/templates/_gitignore");
  fs.writeFileSync("./" + name + "/.gitignore", contents + additions);
};

var updateManifest = function(name) {
  var manifest = JSON.parse(fs.readFileSync("./" + name + "/www/manifest.json"));
  manifest.app.background.scripts = ["./bin/background.js"];
  fs.writeFileSync("./" + name + "/www/manifest.json", JSON.stringify(manifest, null, 2));
};

var updateIndexHTML = function(name) {
  var contents = fs.readFileSync(__dirname + "/templates/_index.html");
  fs.writeFileSync("./" + name + "/www/index.html", contents);
};

var updateWWWFolder = function(name) {
  fs.mkdirSync("./" + name + "/www/bin");
  fs.mkdirSync("./" + name + "/www/lib");
  fs.writeFileSync("./" + name + "/www/bin/background.js", "");
  fs.writeFileSync("./" + name + "/www/bin/client.js", "");

  fs.unlink("./" + name + "/www/background.js");
};

var updateBackground = function(name) {
  fs.mkdirSync("./" + name + "/background");
  var contents = fs.readFileSync(__dirname + "/templates/_background.js");
  fs.writeFileSync("./" + name + "/background/background.js", contents);
};

var updateClient = function(name) {
  fs.mkdirSync("./" + name + "/client");
  var contents = fs.readFileSync(__dirname + "/templates/_client.js");
  fs.writeFileSync("./" + name + "/client/client.js", contents);
};

var promptForBuild = function(name) {
  // prompt.start();
  prompt.message = "ncca";
  prompt.get("Install Packages and Build? (y/n)", function(err, results) {
    if (err) {
      console.log(":: Unable to retrieve user input.");
    } else {
      if (results["Install Packages and Build? (y/n)"] == 'y') {
        build(name);
      } else if (results["Install Packages and Build? (y/n)"] != 'n') {
        promptForBuild(name);
      }
    }
  });
};

var build = function(name) {
  spawnInOrder([
    ["npm", ["install"], {
      stdio: 'inherit',
      cwd: "./" + name
    }, ":: 'npm install' failed."],
    ["./node_modules/grunt-cli/bin/grunt", ["tasks"], {
      stdio: 'inherit',
      cwd: "./" + name
    }, ":: 'Grunt tasks' failed."],
    ["cca", ["prepare"], {
      stdio: 'inherit',
      cwd: "./" + name
    }, ":: 'cca prepare' failed."],
    ["cca", ["build"], {
      stdio: 'inherit',
      cwd: "./" + name
    }, ":: 'cca build' failed."],
  ], function(err) {
    process.exit();
  });
};

var spawnInOrder = function(spawns, cb) {
  if (spawns.length > 0) {
    var s = spawns.shift();
    var cmd = spawn(s[0], s[1], s[2]);

    cmd.on('close', function(code) {
      if (code !== 0) {
        console.log(s[3]);
        cb(s);
      } else {
        spawnInOrder(spawns);
      }
    });
  } else {
    if (cb) {
      cb();
    }
  }
};

if (process.argv[2] && process.argv[2].indexOf(" ") == -1) {
  testCCA(process.argv[2]);
} else {
  console.log(":: Usage (appName cannot contain spaces): ncca [appName]");
}

// main();

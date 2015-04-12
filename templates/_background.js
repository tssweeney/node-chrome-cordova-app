// Use Node require to require any background dependencies here. 
// This is the entry of the server.

// Establish a simple log function. This is useful for identifying
// differences between desktop and mobile OS calls.
function log(message) {
  console.log(message);
}

// When the application is launched, 
chrome.app.runtime.onLaunched.addListener(function() {
  log("onLaunched");

  // create a new window using index.html (relative to www/).
  chrome.app.window.create('index.html', {

    // Establish the desired aspect ratio of the window.
    width: 244,
    height: 380,

    // Once the window has been created,
  }, function(theWindow) {

    // setup a listener for its load completion,
    theWindow.contentWindow.addEventListener('load', function() {
      log("windowLoad");
    });

    // a listener for the close event,
    theWindow.onClosed.addListener(function() {
      log("windowClosed");
    });

    // and a listener for the bounds changing.
    theWindow.onBoundsChanged.addListener(function() {
      log("window.onBoundsChanged");
    });

    // NOTE: each of these listeners are optional, but they may be useful
    // for your particular applicaiton.
  });
});

// Additioanlly, setup listeners for the restart event,
chrome.app.runtime.onRestarted.addListener(function() {
  log("onRestarted");
});


// installation event (good for DB seeding - also ran on updates),
chrome.runtime.onInstalled.addListener(function() {
  log("onInstalled");
});

// the startup event,
chrome.runtime.onStartup.addListener(function() {
  log("onStartup");
});

// the suspend event (major differences between desktop and mobile),
chrome.runtime.onSuspend.addListener(function() {
  log("onSuspend");
});

// and the suspend canceled.
chrome.runtime.onSuspendCanceled.addListener(function() {
  log("onSuspendCanceled");
});

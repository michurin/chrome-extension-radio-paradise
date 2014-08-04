chrome.browserAction.onClicked.addListener(function () {
  chrome.alarms.getAll(function (aa) {
    console.log('all:', aa);
    chrome.alarms.clearAll(function (ok) {
      console.log('claenAll:', ok);
      var when = Date.now();
      var i;
      // 0 works! how?!
      for (i = 0; i < 120; i += i < 10 ? 1 : 20) {
        console.log('create:', when);
        chrome.alarms.create('test_' + i, {
          when: when + i * 1000
        })
      }
      console.log('created all');
    });
  });
});

function init_alarms() {
  // clean and install listener
  chrome.alarms.getAll(function (aa) {
    console.log('all:', aa);
    chrome.alarms.clearAll(function () { // .clear(name, callback)
      chrome.alarms.onAlarm.addListener(function (a) {
        chrome.browserAction.setBadgeText({text: a.name.substr(5)}); // remove 'test_'
        console.log('alarm:', a);
      });
    });
  });
}

chrome.runtime.onStartup.addListener(function () {
  chrome.browserAction.setBadgeText({text: ''});
  init_alarms();
  console.log('start up');
});

chrome.runtime.onInstalled.addListener(function (reason) {
  chrome.browserAction.setBadgeText({text: ''});
  init_alarms();
  console.log('installed:', reason.reason, reason.previousVersion, reason);
});

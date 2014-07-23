/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window, chrome */
/*global storage */

'use strict';

(function () {

  var bugreport_element = window.document.getElementById('bugreport');
  var root_element = window.document.getElementById('bugreport-body');

  bugreport_element.onclick = function () {
    root_element.style.display = 'block';
    storage.get(null, function (stor) {
      root_element.innerText =
        'Contributions and bug reports are welcome from anyone!\n' +
        'Please attach this summary to your bug report.\n\n' +
        JSON.stringify({
          ext_version: chrome.app.getDetails().version,
          user_agent: window.navigator.userAgent,
          storage: stor,
          runtime: {
            now: (new Date()).toUTCString(),
            last_error: (chrome.runtime.lastError || '-'),
            id: chrome.runtime.id,
            manifest: chrome.runtime.getManifest()
          }
        }, undefined, 2) + '\n\n' +
        'Try to explain what you did (steps to reproduce),\n' +
        'what you experienced (screenshots) and what you expected\n' +
        '(unless that is obvious).\n\n' +
        'Thanks for reporting!\n\n' +
        chrome.app.getDetails().author;
    });
  };

}());

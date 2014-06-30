/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window, chrome */
/*jslint
  indent:   2,
  vars:     true,
  plusplus: true
*/

(function () {

  var bugreport_element = window.document.getElementById('bugreport')
  var root_element = bugreport_element.parentElement;

  bugreport_element.onclick = function () {
    storage.get(null, function (stor) {
      root_element.removeChild(bugreport_element);
      var e = window.document.createElement('pre');
      root_element.appendChild(e);
      e.innerText =
        'Contributions and bug reports are welcome from anyone!\n' +
        'Please attach this summary to your bug report.\n\n' +
        JSON.stringify({
          ext_version: chrome.app.getDetails().version,
          user_agent: window.navigator.userAgent,
          storage: stor
        }, undefined, 2) + '\n\n' +
        'Try to explain what you did (steps to reproduce),\n' +
        'what you experienced (screenshots) and what you expected\n' +
        '(unless that is obvious).\n\n' +
        'Thanks for reporting!\n\n' +
      chrome.app.getDetails().author;
    });
  };
}());
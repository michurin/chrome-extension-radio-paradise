/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window, chrome */
/*global $ */

'use strict';

(function () {

  var bugreport_element = $.id('bugreport');
  var root_element = $.id('bugreport-body');

  bugreport_element.onclick = function () {

    root_element.style.display = 'block';
    $.empty(root_element);

    chrome.alarms.getAll(function (all_alarms) {
      chrome.storage.local.get(null, function (stor) {
        window.dom_keeper.get_all(function (cache) {

          root_element.innerText =
            'Contributions and bug reports are welcome from anyone!\n' +
            'Please attach this summary to your bug report.\n\n' +
            JSON.stringify({
              ext_version: chrome.app.getDetails().version,
              user_agent: window.navigator.userAgent,
              storage: stor,
              alarms: all_alarms,
              runtime: {
                now: (new Date()).toUTCString(),
                last_error: (chrome.runtime.lastError || '-'),
                id: chrome.runtime.id,
                manifest: chrome.runtime.getManifest()
              },
              cache: cache
            }, function(k, v) {
              var r;
              if (typeof v === 'undefined') {
                return 'undefined value';
              }
              if (v.nodeType) {
                if (v.nodeType === 1) {
                  r = {tag: v.tagName};
                  if (v.attributes.length > 0) {
                    r.attributes = {};
                    Array.prototype.slice.call(v.attributes, 0).forEach(function (v) {
                      r.attributes[v.name] = v.value;
                    });
                  }
                  if (v.childNodes.length > 0) {
                    if (v.childNodes.length === 1) {
                      r.child = v.childNodes[0];
                    } else {
                      r.childs = Array.prototype.slice.call(v.childNodes, 0);
                    }
                  }
                  return r;
                } else if (v.nodeType === 3) {
                  return v.textContent;
                } else {
                  return 'nodeType=' + v.nodeType;
                }
              }
              return v;
            }, 2) + '\n\n' +
            'Try to explain what you did (steps to reproduce),\n' +
            'what you experienced (screenshots) and what you expected\n' +
            '(unless that is obvious).\n\n' +
            'Thanks for reporting!\n\n' +
            chrome.app.getDetails().author;

        }); // window.dom_keeper.get_all
      }); // chrome.storage.local.get
    }); // chrome.alarms.getAll

  }; // onclick

}());

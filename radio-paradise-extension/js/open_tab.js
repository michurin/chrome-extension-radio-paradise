/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global chrome */
/*jslint
  indent:   2,
  vars:     true,
  plusplus: true
*/

'use strict';

var open_url_in_new_tab = (function () {

  var permissions = {
    permissions: ['tabs']
  };

  function remove_permissions() {
    chrome.permissions.remove(permissions);
  }

  return function (target_url) {
    chrome.permissions.request(permissions, function (granted) {
      if (granted) {
        chrome.tabs.query({
          url: '*://*.radioparadise.com/*'
        }, function (tabs) {
          var tab, tab_selector;
          if (tabs.length) {
            tab = tabs[0];
            tab_selector = function () {
              var tab_options = {
                active: true
              };
              if (tab.url !== target_url) {
                tab_options.url = target_url;
              }
              chrome.tabs.update(tab.id, tab_options, remove_permissions);
            };
            chrome.windows.getCurrent(undefined, function (w) {
              var window_options;
              if (w.id !== tab.windowId) {
                window_options = {
                  focused: true
                };
                if (w.state === 'minimized') {
                  window_options.state = 'normal';
                }
                chrome.windows.update(tab.windowId, window_options, tab_selector);
              } else {
                tab_selector();
              }
            });
          } else {
            chrome.tabs.create({
              active: true,
              url: target_url
            }, remove_permissions);
          }
        });
      }
    });
  };

}());

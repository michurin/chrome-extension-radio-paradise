/*
 * Radio Paradise player
 * Copyright (c) 2014-2018 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global chrome */
/*exported open_url_in_new_tab */

'use strict';

function open_url_in_new_tab(target_url) {
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
        chrome.tabs.update(tab.id, tab_options);
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
      });
    }
  });
}

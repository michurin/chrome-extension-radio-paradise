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
          if (tabs.length) {
            chrome.tabs.update(tabs[0].id, {
              active: true,
              url: target_url
            }, remove_permissions);
          } else {
            chrome.tabs.create({
              url: target_url
            }, remove_permissions);
          }
        });
      }
    });
  };

}());

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

'use strict';

(function () {

  var permissions = {
    permissions: ['tabs']
  };

  function remove_permissions() {
    chrome.permissions.remove(permissions);
  }

  window.document.getElementById('rp-link').onclick = function () {
    chrome.permissions.request(permissions, function (granted) {
      if (granted) {
        chrome.tabs.query({
          url: '*://*.radioparadise.com/*'
        }, function (tabs) {
          if (tabs.length) {
            chrome.tabs.update(tabs[0].id, {
              active: true
            }, remove_permissions);
          } else {
            chrome.tabs.create({
              url: 'http://www.radioparadise.com/'
            }, remove_permissions);
          }
        });
      }
    });
  };

}());

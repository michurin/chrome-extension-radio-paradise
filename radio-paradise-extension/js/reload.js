/*
 * Radio Paradise player
 * Copyright (c) 2014-2018 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global chrome */
/*global opacity_animator_generator, $ */

'use strict';

(function () {

  var dialog = opacity_animator_generator('dialog-reload');
  $.id('dialog-reload-cancel').onclick = dialog.close;
  $.id('dialog-reload-reload').onclick = function () {
    dialog.close();
    chrome.runtime.reload();
  };

  $.id('reload').onclick = dialog.open;

}());


(function () {

  var dialog = opacity_animator_generator('dialog-hard-reload');
  $.id('dialog-hard-reload-cancel').onclick = dialog.close;
  $.id('dialog-hard-reload-reload').onclick = function () {
    dialog.close();
    chrome.storage.local.clear(function () {
      chrome.alarms.clearAll(function () {
        chrome.runtime.reload();
      });
    });
  };

  $.id('hard-reload').onclick = dialog.open;

}());

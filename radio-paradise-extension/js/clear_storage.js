/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window, chrome */
/*global storage, opacity_animator_generator */
'use strict';

(function () {

  var dialog = opacity_animator_generator('dialog-hard-reload');
  window.document.getElementById('dialog-hard-reload-cancel').onclick = dialog.close;
  window.document.getElementById('dialog-hard-reload-reload').onclick = function () {
    dialog.close();
    storage.clear(function () {
      chrome.runtime.reload();
    });
  };

  window.document.getElementById('hard-reload').onclick = dialog.open;

}());
